var count = 0;
function trigger_animations(scene,objects,animating){
  scene.traverse( function( node ) {
    if ( node.selectable ) {
      // console.log(node);
      node.on('mouseover', function(ev) {
        // node.scale.set(1.2,1.2,1.2);
        bounce(node);
      });
      node.on('click', function(ev) {
        animating = true;
        // moveCamera(node);
        var titleBox = document.getElementById("objectTitleBox");
        var backButton = document.getElementById("backButton");
        var title = document.getElementById("objectTitle");
        var more = document.getElementById("more");
        title.innerHTML = node.name;
        more.innerHTML = "Find Out More"
        titleBox.hidden = false;
        backButton.hidden = false;

        //PRELOAD MODAL WITH INFORMATION
        var modalTitle = document.getElementById("modalTitle");
        modalTitle.innerHTML = node.name;

        var modalDescription = document.getElementById("modalDescription");
        modalDescription.innerHTML = node.description;

        // jquery for loading backgrounds
        // console.log(node.photo);
        $('#modalFullscreen').css('background', 'url('+ node.photo +')');
        $('#modalFullscreen').css('background-size', 'cover');
        var video = document.getElementById("mainVideo")
        video.src = node.video;
      });
    }
  });
}

function bounce(object){

  let obj = {
    x:object.scale.x,
    y:object.scale.y,
    z:object.scale.z
  }

  let cpy = JSON.parse(JSON.stringify(obj));

  if (!object.animating) {
    object.animating = true;
    new TWEEN.Tween( object.scale).to( {
      x: object.scale.x * 1.5,
      y: object.scale.y * 1.5,
      z: object.scale.z * 1.5}, 300)
      .easing( TWEEN.Easing.Cubic.Out).start();

    // new TWEEN.Tween( object.position).to( {
    //   x: object.position.x,
    //   y: object.position.y + (.25 * cpy.y),
    //   z: object.position.z}, 300)
    //   .easing( TWEEN.Easing.Cubic.Out).start();

    object.scale.set(object.scale.x * 1.5,object.scale.y * 1.5,object.scale.z * 1.5);
    // object.position.set(object.position.x,object.position.y +.25,object.position.z );

    // new TWEEN.Tween( object.position).to( {
    //   x: object.position.x,
    //   y: object.position.y - (.25 * cpy.y),
    //   z: object.position.z}, 1500).delay(250)
    //   .easing( TWEEN.Easing.Elastic.Out).start();
    new TWEEN.Tween( object.scale).to( {
      x: cpy.x,
      y: cpy.y,
      z: cpy.z}, 1500).delay(250)
      .easing( TWEEN.Easing.Elastic.Out).
      onComplete(function() {
        object.animating = false
      }).start();

  }

}


function moveCamera(object){
  moveCamera(object);

  new TWEEN.Tween( camera.position ).to( {
    x: object.cameraPosition.x,
    y: object.cameraPosition.y,
    z: object.cameraPosition.z}, 2400)
    .easing( TWEEN.Easing.Cubic.Out).start();

  new TWEEN.Tween( controls.target).to( {
    x: object.position.x,
    y: object.position.y,
    z: object.position.z}, 2400)
    .easing( TWEEN.Easing.Cubic.Out).onUpdate(function(){controls.update()}).start();
}

function resetCamera() {
  new TWEEN.Tween( camera.position ).to( {
    x: 0,
    y: 5,
    z: 9}, 2400)
    .easing( TWEEN.Easing.Cubic.Out).start();

  new TWEEN.Tween( controls.target).to( {
    x: 0,
    y: 0,
    z: 0}, 2400)
    .easing( TWEEN.Easing.Cubic.Out).onUpdate(function(){controls.update()}).start();
    var titleBox = document.getElementById("objectTitleBox");
    titleBox.hidden = true;
    var backButton = document.getElementById("backButton");
    backButton.hidden = true;
    var title = document.getElementById("objectTitle");
    title.innerHTML = "";
    var more = document.getElementById("more");
    more.innerHTML = "";
}
