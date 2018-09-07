function Spring(scene,object){
  var spring_objects = []
  // Gas Station
  var loader = new THREE.GLTFLoader();

  loader.load(
    // resource URL
    'assets/models/GasStation/GasStation.gltf',
    // called when the resource is loaded
    function ( gltf ) {
      gltf.scene.traverse(function(node){
        node.position.set(0,-0.5,0);
        spring_objects.push(node);
      });
      objects = spring_objects;
      for (var i = 0; i < spring_objects.length; i++) {
        object = spring_objects[i];
        // console.log(object.name);
        object.castShadow = true;
        // object.selectable = true;
        scene.add(object);
      }
    });
}
