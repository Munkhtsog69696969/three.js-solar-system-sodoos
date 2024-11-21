import * as THREE from "three";

interface RingedSphereProps {
  radius: number;
  ringInnerRadius: number;
  ringOuterRadius: number;
  ringOpacity: number;
  sphereTexturePath: string; // Path to sphere texture
  ringColor: string; // Ring color
  position?: [number, number, number];
  ringTexturePath?: string; // Optional texture for the ring
  ringRotation?:number
}

class RingedSphere {
  sphereMesh: THREE.Mesh;
  ringMesh: THREE.Mesh;

  constructor({
    radius,
    ringInnerRadius,
    ringOuterRadius,
    ringOpacity,
    sphereTexturePath,
    ringColor,
    position = [0, 0, 0],
    ringTexturePath,
    ringRotation=Math.PI/2
  }: RingedSphereProps) {
    // Create the Sphere with texture
    const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
    const textureLoader = new THREE.TextureLoader();
    const sphereTexture = textureLoader.load(sphereTexturePath); // Load sphere texture
    const sphereMaterial = new THREE.MeshStandardMaterial({
      map: sphereTexture, // Apply texture map to the sphere
    });
    this.sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    this.sphereMesh.position.set(...position);

    // Create the Ring
    const ringGeometry = new THREE.RingGeometry(ringInnerRadius, ringOuterRadius, 64);
    const ringMaterial = ringTexturePath
      ? new THREE.MeshBasicMaterial({
          map: new THREE.TextureLoader().load(ringTexturePath),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: ringOpacity,
        })
      : new THREE.MeshBasicMaterial({
          color: ringColor,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: ringOpacity,
        });

    this.ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    this.ringMesh.rotation.x = ringRotation; 
    this.ringMesh.position.set(...position);

    // Add the sphere and ring to the scene
    this.sphereMesh.castShadow = true;
    this.sphereMesh.receiveShadow = true;
    this.ringMesh.castShadow = true;
    this.ringMesh.receiveShadow = true;
  }

  addToScene(scene: THREE.Scene): void {
    scene.add(this.sphereMesh);
    scene.add(this.ringMesh);
  }

  updatePosition(x: number, y: number, z: number): void {
    this.sphereMesh.position.set(x, y, z);
    this.ringMesh.position.set(x, y, z);
  }
}

export default RingedSphere;
