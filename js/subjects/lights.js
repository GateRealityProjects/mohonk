function Lights(scene) {

  var light = new THREE.DirectionalLight( 0x404040 ); // soft white light
  light.intensity = 4.5;
  light.position.set(-20,30,10)
  scene.add( light );

  var light2 = new THREE.SpotLight( 0x404040 ); // soft white light
  light2.intensity = 3;
  light2.position.set(-3,-30,-10)
  scene.add( light2 );

  var light3 = new THREE.AmbientLight( 0x404040 ); // soft white light
  light3.intensity = 1;
  scene.add( light3 );

	this.update = function(time) {
		// light.intensity = (Math.sin(time)+1.5)/1.5;
		// light.color.setHSL( Math.sin(time), 0.5, 0.5 );
	}
}
