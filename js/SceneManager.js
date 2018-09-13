var camera,
    scene,
    renderer,
    controls,
    interaction,
    terrains,
    allSeasons,
    spring,
    summer,
    fall,
    winter,
    attractions,
    opening,
    composer;

var current_season = 0;
var objects = [];
var animating = false;

var modelPlacementMode = false;
var globalModel;

init();

async function init(){

  //create scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x4FAFFF);

  // Camera
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

  camera.receiveShadow = true;
  camera.castShadow = true;

  //Renderer
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  //Load correct season by current month
  function seasonActualizer() {
    let date = new Date
    let month = (date.getMonth() + 1) % 12;
    console.log(month);
    const summer = [6, 7, 8];
    const fall = [9, 10, 11];
    const winter = [12, 1, 2];
    const spring = [3, 4, 5];

    if (summer.includes(month)) {
      return 2;
    } else if (fall.includes(month)) {
      return 3;
    } else if (winter.includes(month)) {
      return 4;
    } else {
      return 1;
    }
  }

  //terrain files from json for season changer
  await loadJSON('json/terrains.json',function(response) {
    terrains = JSON.parse(response);
  });
  await loadJSON('json/spring.json',function(response) {
    spring = JSON.parse(response);
  });
  await loadJSON('json/summer.json',function(response) {
    summer = JSON.parse(response);
  });
  await loadJSON('json/fall.json',function(response) {
    fall = JSON.parse(response);
  });
  await loadJSON('json/winter.json',function(response) {
    winter = JSON.parse(response);
  });
  await loadJSON('json/allSeasons.json',async function(response) {
    allSeasons = JSON.parse(response);
    seasonChanger(seasonActualizer()); //Load inital season after parsing json
  });


  // Object Interaction
  interaction = new THREE.Interaction(renderer, scene, camera);
  interaction.on;

  //Orbit Controls
  controls = new THREE.OrbitControls( camera );
  controls.update();



  // Lighting
  var light = new THREE.DirectionalLight( 0xffffff, 1, 100);
  light.position.set(-30,60,45);
  light.intensity = 0.4;
  light.castShadow = true;
  scene.add(light);
  light.shadow.mapSize.width = 4096;
  light.shadow.mapSize.height = 4096;
  light.shadow.camera.near = 60;
  light.shadow.camera.right = 25;
  light.shadow.camera.left = -25;
  light.shadow.camera.top = 25;
  light.shadow.camera.bottom = -25;
  light.shadow.camera.far = 115;
  light.shadow.bias = - 0.01;

  var ambient = new THREE.AmbientLight(0xfffffff);
  ambient.intensity = 0.6;
  scene.add(ambient);

  //Camera Shadow Box Helper (uncomment to see shadow map)
  // var helper = new THREE.CameraHelper( light.shadow.camera );
  // scene.add( helper );

  //Have loading screen update on Loading Manager
  THREE.DefaultLoadingManager.onLoad = function ( ) {
    document.getElementById('loadingScreen').style.animation = "fadeOut 1s";
    document.getElementById('loadingScreen').style.opacity = 0;
    if (modelPlacementMode) {
      document.getElementById('modelPlacementscreen').hidden = false;
    }
    // startIntro();
    console.log( 'Loading Complete!');
    trigger_animations(scene,objects,animating);
  };

  THREE.DefaultLoadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
    var percent = Math.round((itemsLoaded/itemsTotal)*100);
    document.getElementById('loadingText').innerHTML = "Loading " + percent + "%";
    // console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
  };
  update();

}



// Refresh scene and switch to selected Season
async function seasonChanger(season){
    document.getElementById('loadingScreen').style.opacity = 1;

    // Model Placement mode
    if (modelPlacementMode) {
      await testGlb(winter.forestBathing);
    }


    for (var key in allSeasons){
      loadGlb(allSeasons[key], true);
    }
    if (season === 0) { //TESTING SEASON
      current_season = 0;
    } else if(season === 1) { //SPRING
      current_season = 1;
      refresh();
      loadGlb(terrains.springTerrain,false);
      for (var key in spring){
        loadGlb(spring[key], true);
      }
    } else if(season === 2) { //SUMMER
      current_season = 2;
      refresh();
      loadGlb(terrains.summerTerrain,false);
      for (var key in summer){
        loadGlb(summer[key], true);
      }
    } else if (season === 3) { //FALL
      current_season = 3;
      refresh();
      loadGlb(terrains.fallTerrain,false);
      for (var key in fall){
        loadGlb(fall[key], true);
      }
    } else if (season === 4) { //WINTER
      current_season = 4;
      refresh();
      loadGlb(terrains.winterTerrain,false);
      for (var key in winter){
        loadGlb(winter[key], true);
      }
    }
}

function refresh(){
  for (var i = 0; i < objects.length; i++) {
    scene.remove(objects[i]);
  }
  objects = [];
}

//Json Loader for loading object descriptions and properties
async function loadJSON(path,callback) {
   var xobj = new XMLHttpRequest();
       xobj.overrideMimeType("application/json");
   xobj.open('GET', path, true);
   xobj.onreadystatechange = function () {
         if (xobj.readyState == 4 && xobj.status == "200") {
           callback(xobj.responseText);
         }
   };
   xobj.send(null);
}

// Render gltf model from object
function loadGlb(object,selectable) {
    loader.load(
      object.path,
      function ( gltf ) {
        gltf.scene.traverse(function(node){
          node.castShadow = true;
          node.receiveShadow = true;
        });
        gltf.scene.name = object.name;
        gltf.scene.description = object.description;

        gltf.scene.scale.x = object.scale.x;
        gltf.scene.scale.y = object.scale.y;
        gltf.scene.scale.z = object.scale.z;

        gltf.scene.position.x = object.position.x;
        gltf.scene.position.y = object.position.y;
        gltf.scene.position.z = object.position.z;

        gltf.scene.rotation.x = object.rotation.x;
        gltf.scene.rotation.y = object.rotation.y;
        gltf.scene.rotation.z = object.rotation.z;

        gltf.scene.cameraPosition = {"x":0,"y":0,"z":0}
        gltf.scene.cameraPosition.x = object.cameraPosition.x;
        gltf.scene.cameraPosition.y = object.cameraPosition.y;
        gltf.scene.cameraPosition.z = object.cameraPosition.z;

        gltf.scene.photo = object.photo;
        gltf.scene.video = object.video;


        if (selectable) {
          gltf.scene.selectable = true;
        }

        objects.push(gltf.scene);
        scene.add( gltf.scene );

      }
    );
}

async function testGlb(object) {
    loader.load(

      object.path,

      function ( gltf ) {
        gltf.scene.traverse(function(node){
          node.castShadow = true;
          node.receiveShadow = true;
        });

        gltf.scene.scale.x = object.scale.x;
        gltf.scene.scale.y = object.scale.y;
        gltf.scene.scale.z = object.scale.z;

        gltf.scene.position.x = 0;
        gltf.scene.position.y = 0;
        gltf.scene.position.z = 0;

        globalModel = gltf.scene;
        scene.add(globalModel);


      }
    );
}

function startIntro(){
  controls.autoRotate = true; //upgrade to custom camera animation
  //Transition between 3 different Icons
  document.getElementById("click").style.animation = "fadeInOut 2s";
  document.getElementById("zoom").style.animation = "fadeInOut 2s 2s";
  document.getElementById("rotate").style.animation = "fadeInOut 2s 4s";
  document.getElementById("tutorialOne").style.animation = "fadeOut 1s 5s forwards";
  //Switch to Season text
  document.getElementById("tutorialTwo").style.animation = "fadeIn 1s 6s forwards";
  //Fade in Season dropdown
  document.getElementById("topbar").style.animation = "fadeIn 1s 7s forwards";
  document.getElementById("tutorialScreen").style.animation = "fadeOut 1s 8s forwards";
}

function endIntro(){
  controls.autoRotate = false;
  for (let i = 0; i < objects.length; i++) {
    objects[i].bounce()
  }
  opening = false
}




//scaling
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}


function update() {

  if (globalModel) {
    globalModel.position.copy(controls.target);
    globalModel.position.y = camera.position.y - 2;
    globalModel.position.z = camera.position.z - 2;
  }

  if (modelPlacementMode) {
    document.getElementById("modelX").innerHTML = controls.target.x;
    document.getElementById("modelY").innerHTML = camera.position.y - 2;
    document.getElementById("modelZ").innerHTML = controls.target.z;

    document.getElementById("cameraX").innerHTML = camera.position.x;
    document.getElementById("cameraY").innerHTML = camera.position.y;
    document.getElementById("cameraZ").innerHTML = camera.position.z;

    camera.position.set( 0, 5, 9);
  }
  // var title = document.getElementById("sunTitle");
  // title.innerHTML = ("Camera: "+camera.position.x+" "+camera.position.y+ " "+ camera.position.z+ "Origin: "+controls.target.x+" "+controls.target.y+ " "+ controls.target.z);



//Camera Rotation Path
 let curve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(21.7, 17.1, -25.7),
  new THREE.Vector3(-12.2, 10.8, -17.3),
  new THREE.Vector3(-34.7, 27.2, 40.6),
  new THREE.Vector3(17.4, 13.9, 21.2)
])
console.log(curve);
curve.closed = true;

let mouseX;
let mouseXOnMouseDown;
let rotateOnMouseDown;
let targetRotation = 0;
let currPoint = 0;


document.addEventListener('mousedown', onDocumentMouseDown, false);

 function onDocumentMouseDown(event) {
  event.preventDefault();
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('mouseup', onDocumentMouseUp, false);
  document.addEventListener('mouseout', onDocumentMouseOut, false);
  mouseXOnMouseDown = event.clientX - window.innerWidth / 2;;
  rotateOnMouseDown = targetRotation;
}

function onDocumentMouseMove(event) {
  mouseX = event.clientX - window.innerWidth / 2;;
  targetRotation = rotateOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;
  currPoint = (targetRotation - rotateOnMouseDown) * 0.05;
}

function onDocumentMouseUp(event) {
  document.removeEventListener('mousemove', onDocumentMouseMove, false);
  document.removeEventListener('mouseup', onDocumentMouseUp, false);
  document.removeEventListener('mouseout', onDocumentMouseOut, false);
}

function onDocumentMouseOut(event) {
  document.removeEventListener('mousemove', onDocumentMouseMove, false);
  document.removeEventListener('mouseup', onDocumentMouseUp, false);
  document.removeEventListener('mouseout', onDocumentMouseOut, false);
}


// simulate snow
// if (seasonActualizer() === 4) {}
var particleCount = 9000;
var pMaterial = new THREE.PointsMaterial({
 color: 0xc1c0bd,
 size: 1,
 blending: THREE.AdditiveBlending,
 depthTest: true,
 transparent: true
});
var particles = new THREE.Geometry;

for (let i = 0; i < particleCount; i++) {
    let pX = Math.random()*1000 - 500;
    let pY = Math.random()* window.innerHeight;
    let pZ = Math.random()*1000 - 700;
    particle = new THREE.Vector3(pX, pY, pZ);
    particle.velocity = {};
    particle.velocity.y = -0.1;
    particles.vertices.push(particle);
}

let particleSystem = new THREE.Points(particles, pMaterial);
particleSystem.position.y = 200;
scene.add(particleSystem);

let simulateSnow = function(){
  let pCount = particleCount;
  while (pCount--) {
    let particle = particles.vertices[pCount];
    if (particle.y < -200) {
      particle.y = 200;
      particle.velocity.y = -1;
    }

    particle.velocity.y -= Math.random() * .005;

    particle.y += particle.velocity.y;
  }

  particles.verticesNeedUpdate = true;
};

function render(){
  requestAnimationFrame( render );
  TWEEN.update();
  simulateSnow();
  if (!animating) {
    controls.update();
    controls.dispose();
  }
  if (!animating && !modelPlacementMode) {
    curve.getPoint(currPoint, camera.position);
    camera.lookAt(scene.position);
    } else {
    if (globalModel) {
      globalModel.position.copy(controls.target);
      globalModel.position.y = camera.position.y - 2;
      controls.update();
    }

    if (modelPlacementMode) {
      document.getElementById("modelX").innerHTML = controls.target.x;
      document.getElementById("modelY").innerHTML = camera.position.y - 2;
      document.getElementById("modelZ").innerHTML = controls.target.z;

      document.getElementById("cameraX").innerHTML = camera.position.x;
      document.getElementById("cameraY").innerHTML = camera.position.y;
      document.getElementById("cameraZ").innerHTML = camera.position.z;
    }
  }
  renderer.render( scene, camera );
}


render();
};
