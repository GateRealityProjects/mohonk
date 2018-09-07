
function Winter(scene,object){
  var winter_objects = []
  // Gas Station
  var loader = new THREE.GLTFLoader();

  loader.load(
    // resource URL
    'assets/models/GasStation/GasStation.gltf',
    // called when the resource is loaded
    function ( gltf ) {
      gltf.scene.traverse(function(node){
        node.position.set(0,-0.5,0);
        winter_objects.push(node);
      });
      objects = winter_objects;
      for (var i = 0; i < winter_objects.length; i++) {
        object = winter_objects[i];
        if (object.name == "buffer-0-mesh-0_21") {
          object.material.color.set("#ffffff");
        }
        if (object.name == "buffer-0-mesh-0_4") {
          object.material.color.set("#ffffff");
        }
        if (object.name == "buffer-0-mesh-0_6") {
          object.material.color.set("#ffffff");
        }

        // console.log(object.name);
        object.castShadow = true;
        // object.selectable = true;
        scene.add(object);
      }
      trigger_animations(scene);
    });
}
