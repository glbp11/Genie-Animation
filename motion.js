////////////////////////////////////////////////////////////
// Keyframe   and   Motion  classes
////////////////////////////////////////////////////////////

class Keyframe {
   constructor(name,dt,avars,time=0.0) {
       this.name = name;
       this.dt = dt;                 // time since last keyframe
       this.avars = avars;           // animation variables
       this.time = time;             // absolute time of keyframe;  to be computed later
   };
}

class Motion {
    constructor(setMatricesFunc) {
	this.keyFrameArray = [];          // list of keyframes
	this.maxTime = 0.0;               // time of last keyframe
	this.currTime = 0.0;              // current playback time
	this.updateMatrices = setMatricesFunc;    // function to call to update transformation matrices
    };
    reset() {                     // go back to first keyframe
	this.currTime = 0.0;
    };
    addKeyFrame(keyframe) {               // add a new keyframe at end of list
	this.keyFrameArray.push(keyframe);
	this.maxTime += keyframe.dt;
	keyframe.time = this.maxTime;
    };
    print() {
	var nKF = this.keyFrameArray.length;
	for (var n=0; n<nKF; n++) {
	    console.log("Keyframe ",n, this.keyFrameArray[n]);
	}
    };
    timestep(dt) {                //  take a time-step
	this.currTime += dt;
	if (this.currTime > this.maxTime)  // loop to beginning if beyond end
	    this.currTime = 0;     
	if (this.currTime < 0.0)           // loop to end if beyond beginning (for negative dt)
	    this.currTime = this.maxTime;
//	var avars = this.getAvarsLinear();
	var avars = this.getAvarsSpline();
	this.updateMatrices(avars);
    };

    genMotionCurves(dt) {
	var curvePts = [];
	for (var t=0; t<this.maxTime; t+=dt) {
	    this.currTime = t;
//	    var avars = this.getAvarsLinear();
	    var avars = this.getAvarsSpline();
	    curvePts.push(avars);
	}
//	console.log(curvePts);
	return curvePts;
    };

    getAvarsSpline() {       // Catmull-Rom spline interpolation across multiple segments
	var Mh = new THREE.Matrix4();     // hermite basis matrix
	Mh.set( 2, -2, 1, 1,        // set using row-major ordering
	   -3, 3, -2, -1,
	   0, 0, 1, 0,
	   1, 0, 0, 0 );
	var i = 1;      // begin with the first curve segment
	var eps=0.001;
//	console.log("currTime=",this.currTime);
	while (this.currTime > this.keyFrameArray[i].time)      // find the right pair of keyframes
	    i++;
	var avars = [];
	var nKF = this.keyFrameArray.length;
	for (var n=0; n<this.keyFrameArray[i-1].avars.length; n++) {  
              // compute point indices
	    var i1 = i-2;  if (i1<0) i1=0;                    // get the indexes of all four points needed to compute catmull rom curve, P1
	    var i2 = i-1;							          // P2
	    var i3 = i;                                       // P3
	    var i4 = i+1;  if (i4>nKF-1) i4=nKF-1;            // P4
	    var kf1 = this.keyFrameArray[i1];                 // get the four keyframes based on index
	    var kf2 = this.keyFrameArray[i2];                 //
	    var kf3 = this.keyFrameArray[i3];                 //
	    var kf4 = this.keyFrameArray[i4];                 //
	    var y1 = kf1.avars[n],  t1 = kf1.time;            // set variables to be current animation variable and time
	    var y2 = kf2.avars[n],  t2 = kf2.time;            //
	    var y3 = kf3.avars[n],  t3 = kf3.time;            //
	    var y4 = kf4.avars[n],  t4 = kf4.time;            //
	    var y2p = (t3-t2)*(y3-y1)/(t3-t1);                // take the difference between the position and time of the 1st and 3rd point and multiply by the difference of time between the 2nd and 3rd points
	    var y3p = (t3-t2)*(y4-y2)/(t4-t2);                // take the difference between the position and time of the 2nd and 4th point and multiply by the difference of time between the 2nd and 3rd points
														  // Used to calculate the Geometry matrix of Hermite (G)
	    var t = (this.currTime - t2)/(t3-t2);             // take the current time difference between the two points for the curve we want
	    var T = new THREE.Vector4( t*t*t, t*t, t, 1 );    // create the Time matrix (T) with the current time
	    var G = new THREE.Vector4(y2,y3,y2p,y3p);         // create the Geometry matrix (G) of equivalent Hermite curve
	    var A = G.applyMatrix4(Mh);                       // dot basis matrix of Hermite (Mh) and Geometry matrix (G) to get (A)
	    var val = T.dot(A);                               // dot Time matrix (T) and (A) to get the result
	    avars.push(val);                                  // push the result
	}
	return avars;                                         // It deals with variable-spacing in the time domain by using the difference in time between the points.
    };

    getAvarsLinear() {        // linear interpolation of values
	var i = 1;      // begin with the first curve segment
	while (this.currTime > this.keyFrameArray[i].time)      // find the right pair of keyframes
	    i++;
	var avars = [];
	for (var n=0; n<this.keyFrameArray[i-1].avars.length; n++) {   // interpolate the values
	    var y0 = this.keyFrameArray[i-1].avars[n];
	    var y1 = this.keyFrameArray[i].avars[n];
	    var x0 = this.keyFrameArray[i-1].time;
	    var x1 = this.keyFrameArray[i].time;
	    var x = this.currTime;
	    var y = y0 + (y1-y0)*(x-x0)/(x1-x0);    // linearly interpolate
	    avars.push(y);
	}
	return avars;         // return list of interpolated avars
    };
}

