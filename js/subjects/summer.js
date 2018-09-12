
function Summer(scene,object){
  var summer_objects = []
  // Gas Station
  var loader = new THREE.GLTFLoader();

  loader.load(
    // resource URL
    'assets/models/GasStation/GasStation.gltf',
    // called when the resource is loaded
    function ( gltf ) {
      gltf.scene.traverse(function(node){
        node.position.set(0,-.61,0);
        // console.log(node.material);
        summer_objects.push(node);
      });

      for (var i = 0; i < summer_objects.length; i++) {
        object = summer_objects[i];
        object.castShadow = true;
        object.receiveShadow = true;
        object.selectable = true;
        scene.add(object);
      }
      trigger_animations(scene);
    });

    // Load a glTF resource
    loader.load(
    	// resource URL
    	'assets/models/Pavilion/Pavilion_WinterIceRink.glb',
    	// called when the resource is loaded
    	function ( gltf ) {

        gltf.scene.traverse(function(node){
          if (node instanceof THREE.Mesh) {
            node.receiveShadow = true;
            node.castShadow = true;
            console.log("NODE: " + node);
          }
        });
        console.log(gltf.scene);
        gltf.scene.scale.set(.004,.004,.004);
        gltf.scene.position.set(1.5,2,3);
        gltf.scene.selectable = true;
        gltf.scene.index = 0;


        scene.add( gltf.scene );
        // summer_objects.push(gltf.scene);
        // objects = summer_objects;

    	});



    // loader.load(
    //   // resource URL
    //   'assets/models/Pavilion/Pavilion_AllSeasons.glb',
    //   // called when the resource is loaded
    //   function ( gltf ) {
    //     // gltf.scene.scale.set(.0001,.0001,.0001);
    //     var meshWrap = new THREE.Mesh();
    //     gltf.scene.traverse(function(node){
    //       if( node instanceof THREE.Mesh){
    //         node.scale.set(.004,.004,.004);
    //         meshWrap.add(node);
    //         // summer_objects.push(node);
    //       }
    //       // // var purple = gltf.scene.children[0];
    //       // node.scale.set(.004,.004,.004);
    //       // // purple.position.set(1.5,0,3);
    //       // // purple.index = 0;
    //       // node.rotation.set(0,0,0);
    //       // // group.add(node);
    //       // node.selectable = true;
    //     });
    //     // outerMesh.scale.set(.004,.004,.004);
    //
    //     // console.log("summer: "+summer_objects);
    //
    //     summer_objects.push(meshWrap);
    //     scene.add(meshWrap)
    //
    //     objects = summer_objects;
    //     // for (var i = 0; i < summer_objects.length; i++) {
    //     //   object = summer_objects[i];
    //     //   object.receiveShadow = true;
    //     //   object.castShadow = true;
    //     //   object.selectable = true;
    //     //   scene.add(object);
    //     // }
    //     trigger_animations(scene);
    //   });


    // var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    // var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
    // var cube = new THREE.Mesh( geometry, material );
    // cube.name = "cube1";
    // cube.castShadow = true;
    // cube.receiveShadow = true;
    // cube.selectable = true;
    // cube.animating = false;
    // cube.position.set(-2,3,0);
    // cube.index = [0];
    // summer_objects.push(cube);
    //
    // var geometry = new THREE.PlaneGeometry( 5, 5, 32 );
    // var material = new THREE.MeshLambertMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    // var plane = new THREE.Mesh( geometry, material );
    // plane.rotation.set(1.5708,0,0);
    // plane.position.set(-2,2,0);
    // plane.castShadow = true;
    // plane.receiveShadow = true;
    // plane.name = "plane";
    // plane.selectable = false;
    // plane.animating = false;
    // summer_objects.push(plane);
    // console.log(plane.material);
    //
    // objects = summer_objects;

}
