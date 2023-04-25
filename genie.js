//    genie.js

////////////////////////////////////////////////////////////////////////
// initGenieMotions()
////////////////////////////////////////////////////////////////////////

function initGenieMotions() {
  //                                                [x,y,Cpx,Cpy,squish,dir]
  genieMotion.addKeyFrame(new Keyframe('keyA', 0.0, [0, 3, 0, 5, 1, 0]));
  genieMotion.addKeyFrame(new Keyframe('keyA', 2.0, [0, 6, 0, 5, 1, 0]));
  genieMotion.addKeyFrame(new Keyframe('keyB', 2.0, [0, 7, 2, 5, 1, 0]));
  genieMotion.addKeyFrame(new Keyframe('keyA', 1.0, [0, 7, 0, 5, 1, 0]));
  genieMotion.addKeyFrame(new Keyframe('keyB', 1.0, [0, 7, -2 ,5, 1, 0]));
  genieMotion.addKeyFrame(new Keyframe('keyA', 1.0, [0, 7.5, -1, 5, 1, 0]));
  genieMotion.addKeyFrame(new Keyframe('keyB', 1.0, [0, 8, -2 ,5, 1, 0]));
  genieMotion.addKeyFrame(new Keyframe('keyA', 1.0, [0, 8, 0, 5, 1, 0]));
  genieMotion.addKeyFrame(new Keyframe('keyB', 2.0, [0, 8, 2, 5, 1, 0]));

  genieMotion.addKeyFrame(new Keyframe('keyA', 2.0, [0, 8, 0, 5, 1, 1]));
  genieMotion.addKeyFrame(new Keyframe('keyA', 4.0, [0, 8, 0, 10, 1, 1]));
  genieMotion.addKeyFrame(new Keyframe('keyA', 2.0, [0, 8.5, 0, 10, 1, 1]));

  genieMotion.addKeyFrame(new Keyframe('keyA', 2.0, [0, 8, 0, 3, 1, 1]));


  genieMotion.addKeyFrame(new Keyframe('keyA', 0.5, [0, 11, 0, 6, 1, 0]));
  genieMotion.addKeyFrame(new Keyframe('keyA', 0.5, [0, 11, 0, 5, 1, 0]));
  genieMotion.addKeyFrame(new Keyframe('keyA', 10.0, [0, 11, 0, 5, 1, 0]));
}

/////////////////////////////////////	
// initGenieObject()
/////////////////////////////////////	

function initGenieObject() {
    // image from https://pixabay.com/p-3374506/?no_redirect 
  var genieTexture = new THREE.TextureLoader().load('images/genie.png');  
  genieTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  var genieMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff, 
                          map: genieTexture, side: THREE.DoubleSide, transparent: true });
  var geom = new THREE.Geometry(); 

  var genieCoords = [];

  var genieCoords = [
    //  0            1                2                3                         
        0, 0,	   0.33,  0,        0.66, 0,        1, 0,
    //  4            5                6                7         
        0, 0.33,   0.33,  0.33,     0.66, 0.33,     1, 0.33,
    //  8            9                10               11           
        0, 0.66,   0.33,  0.66,     0.66, 0.66,     1, 0.66,
    //  12           13               14               15       
        0, 1,	   0.33,  1,        0.66, 1,        1, 1,];
      
  var vertList = [];
  genie_uvList = [];
  for (var n=0; n<genieCoords.length; n+=2) {
  geom.vertices.push(new THREE.Vector3( genieCoords[n], genieCoords[n+1], 0));   // xyz coords
  genie_uvList.push(new THREE.Vector2( genieCoords[n], genieCoords[n+1] ));    // texture coords
  }

  geom.faces.push( new THREE.Face3( 0, 1, 5) );
  geom.faces.push( new THREE.Face3( 0, 5, 4) );
  geom.faces.push( new THREE.Face3( 1, 2, 6) );
  geom.faces.push( new THREE.Face3( 1, 6, 5) );
  geom.faces.push( new THREE.Face3( 2, 3, 7) );
  geom.faces.push( new THREE.Face3( 2, 7, 6) );

  geom.faces.push( new THREE.Face3( 4, 5, 9) );
  geom.faces.push( new THREE.Face3( 4, 9, 8) );
  geom.faces.push( new THREE.Face3( 5, 6, 10) );
  geom.faces.push( new THREE.Face3( 5, 10, 9) );
  geom.faces.push( new THREE.Face3( 6, 7, 11) );
  geom.faces.push( new THREE.Face3( 6, 11, 10) );

  geom.faces.push( new THREE.Face3( 8, 9, 13) );
  geom.faces.push( new THREE.Face3( 8, 13, 12) );
  geom.faces.push( new THREE.Face3( 9, 10, 14) );
  geom.faces.push( new THREE.Face3( 9, 14, 13) );
  geom.faces.push( new THREE.Face3( 10, 11, 15) );
  geom.faces.push( new THREE.Face3( 10, 15, 14) );

  geom.computeFaceNormals();
  geom.computeBoundingBox();
  var max = geom.boundingBox.max, min = geom.boundingBox.min;
  var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
  var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
  var faces = geom.faces;
  geom.faceVertexUvs[0] = [];
  for (var i = 0; i < faces.length ; i++) {
  var v1 = geom.vertices[faces[i].a], 
          v2 = geom.vertices[faces[i].b], 
          v3 = geom.vertices[faces[i].c];
  geom.faceVertexUvs[0].push([
      new THREE.Vector2(v1.x, v1.y),
      new THREE.Vector2(v2.x, v2.y),
      new THREE.Vector2(v3.x, v3.y)
  ]);
  }
  geom.uvsNeedUpdate = true;

  genie = new THREE.Mesh( geom, genieMaterial);
  genie.position.set(0,5,4);
  genie.rotation.z = -Math.PI/2;
  genie.scale.x = 5.0;
  genie.scale.y = 5.0;
  genie.scale.z = 5.0;
  genie.castShadow = false;    genie.receiveShadow = false;
  scene.add(genie);

    // Bezier curve

    // Bezier control points
  bezCpGeometry = new THREE.SphereGeometry(0.015, 16, 16);    // control point sphere: rad, nseg, nseg
  bezCpSphereListV = [];
  bezCpListV = [];
  for (var n=0; n<4; n++) {
  var x=n/3, y=0.5, z=0;
  bezCpListV.push(new THREE.Vector3(x,y,z));
        // create a control point sphere
  var bezCps = new THREE.Mesh(bezCpGeometry, blueMaterial);
  bezCps.position.set(x,y,z);
  //genie.add(bezCps);
  bezCpSphereListV.push(bezCps);
  }

    // Bezier curve
  bezNpts = 10;
  lineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff, linewidth: 2 });
  lineGeometry = new THREE.BufferGeometry();
  linePositions = new Float32Array( bezNpts * 6 ); // 3 vertices per point    // attributes
  lineGeometry.addAttribute( 'position', new THREE.BufferAttribute( linePositions, 3 ) );
  lineObj = new THREE.Line( lineGeometry,  lineMaterial );
  //genie.add( lineObj );
  bezTvec = [];
  for (var n=0, i=0; n<bezNpts; n++) {      // set the vertex positions
  var t=n/(bezNpts-1);
  bezTvec.push(t);
  linePositions[ i++ ] = n/(bezNpts-1);
  linePositions[ i++ ] = 0.5;
  linePositions[ i++ ] = 0;
  }
  lineObj.geometry.setDrawRange( 0, bezNpts );   

}

///////////////////////////////////////////////////////////////////////////////////////
// updateGenie(avars)
///////////////////////////////////////////////////////////////////////////////////////

function updateGenie(avars) {
  genie.position.set(avars[0],avars[1],2.2);

    // update a control point    using avars[2], avars[3]

  if (avars[5] == 0){
    var yNew = 0.5 + 0.2*avars[2];
    var xNew = 0.5 - 0.1*avars[3];
    bezCpListV[0].x = xNew;           // change x of the first control point
    bezCpListV[0].y = yNew;           // change y of the first control point
    bezCps = bezCpSphereListV[0];     // update position of the corresponding sphere
    bezCps.position.set(xNew, yNew, 0);
  
    yNew = 0.5 + 0.1*avars[2];
    xNew = -0.3 + 0.1*avars[3];
    bezCpListV[1].x = xNew;           // change x of the second control point
    bezCpListV[1].y = yNew;           // change y of the second control point
    bezCps = bezCpSphereListV[1];     // update position of the corresponding sphere
    bezCps.position.set(xNew, yNew, 0);
    updateGenie_details(avars[4]); // update the Bezier curve and genie geometry based on control points
  }
  else {
    var yNew = 0.5 -0.2*avars[2];
    var xNew = 0.5 - 0.1*avars[3];
    bezCpListV[0].x = xNew;           // change y of the first control point
    bezCpListV[0].y = yNew;           // change y of the first control point
    bezCps = bezCpSphereListV[0];     // update position of the corresponding sphere
    bezCps.position.set(xNew, yNew, 0);

    updateGenie_details(avars[4]); // update the Bezier curve and genie geometry based on control points
  }
}

function updateGenie_details(genie_width) {

  Mbez = new THREE.Matrix4;
  Mbez.set(-1, 3, -3, 1,
           3, -6, 3, 0,
           -3, 3, 0, 0,
          1, 0, 0, 0);

   // compute the curve positions at the curve sample t values

  positions = lineObj.geometry.attributes.position.array;
  Gx = new THREE.Vector4(bezCpListV[0].x, bezCpListV[1].x, bezCpListV[2].x, bezCpListV[3].x);
  Gy = new THREE.Vector4(bezCpListV[0].y, bezCpListV[1].y, bezCpListV[2].y, bezCpListV[3].y);
  Gz = new THREE.Vector4(bezCpListV[0].z, bezCpListV[1].z, bezCpListV[2].z, bezCpListV[3].z);
  for (var n=0, i=0; n<bezNpts; n++) {      // set the vertex positions
  var t = bezTvec[n];
  var tmpVec;
  var T = new THREE.Vector4(t*t*t, t*t, t, 1);    // build T vector

  tmpVec = Gx.clone();         // x = T M Gx
  tmpVec.applyMatrix4(Mbez);
  var vx = T.dot(tmpVec);
  tmpVec = Gy.clone();         // y = T M Gy
  tmpVec.applyMatrix4(Mbez);
  var vy = T.dot(tmpVec);
  tmpVec = Gz.clone();         // z = T M Gz
  tmpVec.applyMatrix4(Mbez);
  var vz = T.dot(tmpVec);

  positions[ i++ ] = vx;
  positions[ i++ ] = vy;
  positions[ i++ ] = vz;
  }
  lineObj.geometry.attributes.position.needsUpdate = true; 

  // Compute new genie vertices, based on their UV coordinates.

  var vertices = genie.geometry.vertices;
  var nVert = genie_uvList.length;
  for (var n=0; n<nVert; n++) {
  var t = genie_uvList[n].x;
  var yOffset = genie_width*(genie_uvList[n].y - 0.5);
  var tmpVec;
  var T = new THREE.Vector4(t*t*t, t*t, t, 1);    // build T vector

  tmpVec = Gx.clone();         // x = T M Gx
  tmpVec.applyMatrix4(Mbez);
  var vx = T.dot(tmpVec);
  tmpVec = Gy.clone();         // y = T M Gy
  tmpVec.applyMatrix4(Mbez);
  var vy = T.dot(tmpVec);
  tmpVec = Gz.clone();         // z = T M Gz
  tmpVec.applyMatrix4(Mbez);
  var vz = T.dot(tmpVec);

  vertices[n].x = vx;
  vertices[n].y = vy + yOffset;
  vertices[n].z = vz ;
  }

  genie.geometry.verticesNeedUpdate = true; 
}
