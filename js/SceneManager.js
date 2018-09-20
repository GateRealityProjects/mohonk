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
    winterSnow,
    fallFog,
    intro,
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


  //Have loading screen update on Loading Manager
  THREE.DefaultLoadingManager.onLoad = function ( ) {
    document.getElementById('loadingScreen').style.animation = "fadeOut 1s";
    document.getElementById('loadingScreen').style.opacity = 0;
    if (modelPlacementMode) {
      document.getElementById('modelPlacementscreen').hidden = false;
    }
    startIntro();
    console.log( 'Loading Complete!');
    trigger_animations(scene,objects,animating);
  };

  THREE.DefaultLoadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
    var percent = Math.round((itemsLoaded/itemsTotal)*100);
    document.getElementById('loadingText').innerHTML = "Loading " + percent + "%";
  };
  update();

}


// Refresh scene and switch to selected Season
async function seasonChanger(season){
    document.getElementById('loadingScreen').style.opacity = 1;

    // Select Model for Placement
    if (modelPlacementMode) {
      await testGlb(winter.ski);
    }


    for (var key in allSeasons){
      loadGlb(allSeasons[key], true);
    }
    if (season === 0) { //TESTING SEASON
      current_season = 0;
    } else if(season === 1) { //SPRING
      current_season = 1;
       winterSnow = false
       fallFog = false;
      refresh();
      loadGlb(terrains.springTerrain,false);
      for (var key in spring){
        loadGlb(spring[key], true);
      }
    } else if(season === 2) { //SUMMER
       winterSnow = false
       fallFog = false;
      current_season = 2;
      refresh();
      loadGlb(terrains.summerTerrain,false);
      for (var key in summer){
        loadGlb(summer[key], true);
      }
    } else if (season === 3) { //FALL
      current_season = 3;
       winterSnow = false;
       fallFog = true;
      refresh();
      loadGlb(terrains.fallTerrain,false);
      for (var key in fall){
        loadGlb(fall[key], true);
      }
    } else if (season === 4) { //WINTER
      current_season = 4;
       winterSnow = true
       fallFog = true;
      refresh();
      loadGlb(terrains.winterTerrain,false);
      for (var key in winter){
        loadGlb(winter[key], true);
      }
    }
}

function refresh(){
  animating = false
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
  // //Transition between 3 different Icons
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
//
function hide() {
   let elem = document.getElementById('tutorialScreen');
   elem.parentNode.removeChild(elem);
};

function endIntro(){
  new TWEEN.Tween(camera.position).to({ x: -12.2, y: 17.1, z: -17.3 }, 2000).easing(TWEEN.Easing.Linear.Out).start();
  new TWEEN.Tween(camera.position).to({ x: -34.7, y: 27.2, z: 40.6 }, 2000).easing(TWEEN.Easing.Linear.Out).start();
  new TWEEN.Tween(camera.position).to({ x: 17.4, y: 13.9, z: 21.2 }, 2000).easing(TWEEN.Easing.Linear.Out).start();
  new TWEEN.Tween(camera.position).to({ x: 21.7, y: 17.1, z: -25.7 }, 2000).easing(TWEEN.Easing.Linear.Out).start();
};



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
 const curve = new THREE.CatmullRomCurve3([
   new THREE.Vector3(21.7, 17.1, -25.7),
   new THREE.Vector3(-12.2, 10.8, -17.3),
   new THREE.Vector3(-34.7, 27.2, 40.6),
   new THREE.Vector3(17.4, 13.9, 21.2)
])
curve.closed = true;

curve.getPoint(0, camera.position);
camera.lookAt(scene.position);

let mouseX;
let mouseXOnMouseDown = 0;
let currPoint = 0;
let currPointOnMouseDown = 0;
let windowHalfX = window.innerWidth / 2
let rotateOnMouseDown;
let targetRotation = 0;

document.addEventListener('mousedown', onDocumentMouseDown, true);

function onDocumentMouseDown(event) {
  event.preventDefault();
  event.stopPropagation();
  window.addEventListener('touchmove', onDocumentTouchMove, true)
  window.addEventListener('mousemove', onDocumentMouseMove, true);
  window.addEventListener('mouseup', removeListeners, true);
  rotateOnMouseDown = targetRotation;
  mouseXOnMouseDown = event.clientX;
  currPointOnMouseDown = currPoint;
}

function onDocumentTouchMove( event ) {
  if ( event.touches.length == 1 ) {
    event.preventDefault();
    mouseX = event.touches[0].clientX - windowHalfX;
    targetRotation = rotateOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;
    currPoint = (targetRotation - rotateOnMouseDown) * 0.05;
  }
}
function onDocumentMouseMove(event) {
  event.preventDefault();
  event.stopPropagation();
  let deltaMouseX = event.clientX - mouseXOnMouseDown;
  currPoint = THREE.Math.euclideanModulo(currPointOnMouseDown + deltaMouseX * 0.0005, 1);
}

function removeListeners() {
  window.removeEventListener('mousemove', onDocumentMouseMove, true);
  window.removeEventListener('mouseup', removeListeners, true);
}


// snow
class Particle {
  constructor(particleCount, color) {
  this.particleCount = particleCount;
  this.pMaterial = new THREE.PointsMaterial({
    color: color,
    size: 1,
    blending: THREE.AdditiveBlending,
    transparent: true,
  });
  this.particles = new THREE.Geometry;
  }

   removeParticleSystem() {
    let pointLocation = scene.children
    for (let i = 0; i < pointLocation.length; i++) {
        if (pointLocation[i].type === "Points") {
        scene.remove(pointLocation[i]);
      }
    }
  }

  renderParticles() {
    for (let i = 0; i < this.particleCount; i++) {
        let pX = Math.random()*1000 - 500;
        let pY = Math.random()* window.innerHeight;
        let pZ = Math.random()*1000 - 700;
        this.particle = new THREE.Vector3(pX, pY, pZ);
        this.particle.velocity = {};
        this.particle.velocity.y = -0.1;
        this.particles.vertices.push(this.particle);
    }
    this.particleSystem = new THREE.Points(this.particles, this.pMaterial);
    this.particleSystem.position.y = 200;
    scene.add(this.particleSystem);
  }


  simulateSnow(){
    let pCount = this.particleCount;
    while (pCount--) {
      let flake = this.particles.vertices[pCount];
      if (flake < -300) {
        flake.y = 200;
        this.particle.velocity.y = -1;
      }
      this.particle.velocity.y -= Math.random() * .005;
      flake.y += this.particle.velocity.y;
    }
    this.particles.verticesNeedUpdate = true;
  }

  removeParticleSystem() {
   let pointLocation = scene.children
   for (let i = 0; i < pointLocation.length; i++) {
       if (pointLocation[i].type === "Points") {
       scene.remove(pointLocation[i]);
     }
   }
 }

  update() {
    this.renderParticles();
    this.simulateSnow();
  }
};


const snow = new Particle(2000, 0xffffff);
const leaf = new Particle(2000, 0xff7300);


function render(){
  if (intro) {
    endIntro();
  }
  TWEEN.update();
  if (winterSnow) {
    // leaf.removeParticleSystem();
    snow.update();
  } else if (fallFog) {
    snow.removeParticleSystem();
    // leaf.update();
    scene.fog = new THREE.Fog('lightgrey', 0.000025, 200);
  } else  {
    leaf.removeParticleSystem();
    snow.removeParticleSystem();
    // leaf.removeParticleSystem();
    scene.fog = false;
  }
  if (!animating) {
    controls.update();
    controls.dispose();
    // curve.getPoint(currPoint, camera.position);
    // camera.lookAt(scene.position);
  }
  // // NOTE: excepting requestAnimationFrame and renderer
  // // NOTE: everything below this line to be removed fro production
  if (!animating && !modelPlacementMode) {
    curve.getPoint(currPoint, camera.position);
    camera.lookAt(scene.position);
  } //else {
    // if (globalModel) {
    //   globalModel.position.copy(controls.target);
    //   globalModel.position.y = camera.position.y - 2;
    //   controls.update();
    // }
    //
    // if (modelPlacementMode) {
    //   document.getElementById("modelX").innerHTML = controls.target.x;
    //   document.getElementById("modelY").innerHTML = camera.position.y - 2;
    //   document.getElementById("modelZ").innerHTML = controls.target.z;
    //
    //   document.getElementById("cameraX").innerHTML = camera.position.x;
    //   document.getElementById("cameraY").innerHTML = camera.position.y;
    //   document.getElementById("cameraZ").innerHTML = camera.position.z;
    // }
  // }
  renderer.render( scene, camera );
  requestAnimationFrame( render );
}


render();
};
