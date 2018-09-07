
function GasStation(scene,object){
  var station_objects = []
  // Gas Station
  var loader = new THREE.GLTFLoader();

  loader.load(
    // resource URL
    'assets/models/GasStation/GasStation.gltf',
    // called when the resource is loaded
    function ( gltf ) {
      gltf.scene.traverse(function(node){
        node.position.set(0,-0.5,0);
        station_objects.push(node);
      });
      for (var i = 0; i < station_objects.length; i++) {
        object = station_objects[i];
        if (object.name == "buffer-0-mesh-0_21") {
          object.material.color.set("#B37400");
        }
        if (object.name == "buffer-0-mesh-0_4") {
          object.material.color.set("#B37400");
        }

        // console.log(object.name);
        object.recieveShadow = true;
        object.castShadow = true;
        object.selectable = true;
        scene.add(object);
      }
        objects = station_objects;
      trigger_animations(scene);
    });


}
