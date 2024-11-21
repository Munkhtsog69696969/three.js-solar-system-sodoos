import * as THREE from "three";

interface CubeProps {
  width: number;
  height: number;
  depth: number;
  position?: [number, number, number];
  texturePath: string; // Path to rock texture
  bumpMapPath: string; // Path to bump map texture
}

class Cube {
  mesh: THREE.Mesh;

  constructor({
    width,
    height,
    depth,
    position = [0, 0, 0],
    texturePath,
    bumpMapPath,
  }: CubeProps) {
    const geometry = new THREE.BoxGeometry(width, height, depth);

    // Load rock texture
    const textureLoader = new THREE.TextureLoader();
    const rockTexture = textureLoader.load(texturePath);
    rockTexture.wrapS = THREE.RepeatWrapping;
    rockTexture.wrapT = THREE.RepeatWrapping;
    rockTexture.repeat.set(1, 1); // Adjust tiling for better realism

    // Load bump map for small bumps and rough texture
    const bumpMap = textureLoader.load(bumpMapPath);

    // Apply the texture to a MeshStandardMaterial with bump map
    const material = new THREE.MeshStandardMaterial({
      map: rockTexture, // Diffuse map for rock surface
      roughness: 2, // High roughness for a natural look
      metalness: 0.1, // Minimal metallic appearance
      bumpMap: bumpMap, // Add bump map for surface texture
      bumpScale: 0.1, // Small bump scale to simulate rough surface
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.mesh.position.set(...position);
  }

  addToScene(scene: THREE.Scene): void {
    scene.add(this.mesh);
  }

  updatePosition(x: number, y: number, z: number): void {
    this.mesh.position.set(x, y, z);
  }
}

export default Cube;
