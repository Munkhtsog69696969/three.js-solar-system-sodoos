import * as THREE from "three";

interface SphereProps {
  radius: number;
  position?: [number, number, number];
  texturePath: string; // Path to texture for the sphere
  bumpMapPath: string; // Path to bump map texture
}

class Sphere {
  mesh: THREE.Mesh;
  radius:number

  constructor({
    radius,
    position = [0, 0, 0],
    texturePath,
    bumpMapPath,
  }: SphereProps) {
    this.radius=radius

    const geometry = new THREE.SphereGeometry(radius, 32, 32); // More segments for smoother sphere

    // Load texture for the sphere
    const textureLoader = new THREE.TextureLoader();
    const sphereTexture = textureLoader.load(texturePath);
    sphereTexture.wrapS = THREE.RepeatWrapping;
    sphereTexture.wrapT = THREE.RepeatWrapping;
    sphereTexture.repeat.set(1, 1); // Adjust tiling for better realism

    // Load bump map for small bumps and rough texture
    const bumpMap = textureLoader.load(bumpMapPath);

    // Apply the texture to a MeshStandardMaterial with bump map
    const material = new THREE.MeshStandardMaterial({
      map: sphereTexture, // Diffuse map for sphere surface
      roughness: 0.8, // High roughness for a natural look
      metalness: 0.1, // Minimal metallic appearance
      bumpMap: bumpMap, // Add bump map for surface texture
      bumpScale: 0.1, // Small bump scale to simulate rough surface
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true; // Enable shadow casting
    this.mesh.receiveShadow = true; // Enable shadow reception

    this.mesh.position.set(...position); // Set initial position
  }

  addToScene(scene: THREE.Scene): void {
    scene.add(this.mesh); // Add the sphere mesh to the scene
  }

  updatePosition(x: number, y: number, z: number): void {
    this.mesh.position.set(x, y, z); // Update the sphere's position
  }
}

export default Sphere;
