
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



}
