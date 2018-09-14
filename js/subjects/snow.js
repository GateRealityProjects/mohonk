//snow
export default class Snow {
  constructor() {
    this.particleCount = 3000;
    this.pMaterial = new THREE.PointsMaterial({
    color: 0xc1c0bd,
    size: 1,
    blending: THREE.AdditiveBlending,
    });
    this.this.particles = new THREE.Geometry;


    for (let i = 0; i < particleCount; i++) {
      let pX = Math.random()*1000 - 500;
      let pY = Math.random()* window.innerHeight;
      let pZ = Math.random()*1000 - 700;
      this.particle = new THREE.Vector3(pX, pY, pZ);
      this.particle.velocity = {};
      this.particle.velocity.y = -0.1;
      this.particles.vertices.push(this.particle);
    }

    let particleSystem = new THREE.Points(this.particles, pMaterial);
    particleSystem.position.y = 200;
    scene.add(particleSystem);
  }

  simulateSnow(particleCount, this.particles){
    let pCount = particleCount;
    while (pCount--) {
    let this.particle = this.particles.vertices[pCount];
    if (this.particle.y < -200) {
      this.particle.y = 200;
      this.particle.velocity.y = -1;
    }
    this.particle.velocity.y -= Math.random() * .005;
    this.particle.y += this.particle.velocity.y;
  }
  this.particles.verticesNeedUpdate = true;
}

  update() {
    this.simulateSnow();
  }

}
