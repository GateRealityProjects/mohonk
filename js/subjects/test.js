var loader = new THREE.GLTFLoader();
async function Test_environment(scene,object,attractions){
  var summer_objects = [];
  // Gas Station


  loader.load(
    // resource URL
    'assets/models/terrain/MASTER.glb',
    // called when the resource is loaded
    function ( gltf ) {
      gltf.scene.traverse(function(node){
        node.position.set(0,-.61,0);
        node.scale.set(.0001,.0001,.0001);
        // console.log(node.material);
        summer_objects.push(node);
      });

      for (var i = 0; i < summer_objects.length; i++) {
        object = summer_objects[i];
        object.castShadow = true;
        object.receiveShadow = true;
        // object.selectable = true;
        scene.add(object);
      }
      trigger_animations(scene);
    });

    // loadGlb(attractions.Pavilion);
    // loadGlb(attractions.IceRink);
    // loadGlb(attractions.Barn);
    // loadGlb(attractions.Carriage);
    // loadGlb(attractions.DiningRoom);
    // loadGlb(attractions.IndoorPool);
    // loadGlb(attractions.KidsClub);
    // loadGlb(attractions.Porch);
    // loadGlb(attractions.Snowshoes);
    // loadGlb(attractions.SummerHouse);
    console.log(attractions.Pavilion.description);

}

function loadGlb(object) {
    loader.load(
      // resource URL
      object.path,
      // called when the resource is loaded
      function ( gltf ) {
        // console.log(attractions[j].name);
        gltf.scene.traverse(function(node){
          node.castShadow = true;
          node.receiveShadow = true;
        });
        gltf.scene.name = object.name;
        gltf.scene.description = object.description;
        // gltf.scene.scale.set(.004,.004,.004);
        gltf.scene.scale.x = object.scale.x;
        gltf.scene.scale.y = object.scale.y;
        gltf.scene.scale.z = object.scale.z;
        // gltf.scene.position.set(1.5,0,3);
        gltf.scene.position.x = object.position.x;
        gltf.scene.position.y = object.position.y;
        gltf.scene.position.z = object.position.z;

        gltf.scene.cameraPosition = {"x":0,"y":0,"z":0}
        gltf.scene.cameraPosition.x = object.cameraPosition.x;
        gltf.scene.cameraPosition.y = object.cameraPosition.y;
        gltf.scene.cameraPosition.z = object.cameraPosition.z;

        gltf.scene.photo = object.photo;



        gltf.scene.selectable = true;


        scene.add( gltf.scene );
        // summer_objects.push(gltf.scene);
        // objects = summer_objects;

      }
    );
}
