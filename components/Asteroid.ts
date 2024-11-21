import * as THREE from "three";

interface AsteroidProps {
  position: [number, number, number];
  minRadius: number;
  maxRadius: number;
  texture: string;
}

class Asteroid {
  mesh: THREE.Mesh;
  radius: number; // Orbit radius
  angle: number;  // Current angle of orbit
  orbitSpeed: number; // Speed of orbit

  constructor({ position = [0, 0, 0], minRadius, maxRadius, texture }: AsteroidProps) {
    const randomRadius = Math.random() * (maxRadius - minRadius) + minRadius;

    const geometry = new THREE.IcosahedronGeometry(randomRadius, 0);

    const textureLoader = new THREE.TextureLoader();
    const asteroidTexture = textureLoader.load(texture);
    const AsteroidMaterial = new THREE.MeshStandardMaterial({
      map: asteroidTexture,
    });

    this.mesh = new THREE.Mesh(geometry, AsteroidMaterial);

    // Store orbit-specific properties
    this.radius = Math.sqrt(position[0] ** 2 + position[2] ** 2); // Distance from center
    this.angle = Math.atan2(position[2], position[0]); // Initial angle
    this.orbitSpeed = Math.random() * 0.002 + 0.001; // Random speed

    // Set initial position
    this.mesh.position.set(...position);
  }

  addToScene(scene: THREE.Scene): void {
    scene.add(this.mesh);
  }

  updatePosition(): void {
    this.angle += this.orbitSpeed; // Update angle
    this.mesh.position.set(
      this.radius * Math.cos(this.angle),
      this.mesh.position.y, // Keep the same Y position
      this.radius * Math.sin(this.angle)
    );
  }
}

export default Asteroid;
