import * as THREE from "three";

interface BlackHoleProps {
  radius: number;
  diskInnerRadius: number;
  diskOuterRadius: number;
  diskColor: string;
  diskOpacity: number;
  glowIntensity: number; // Intensity of the glow
  glowColor: string; // Glow color
  position?: [number, number, number];
  shakeIntensity?: number; // Intensity of the shake effect
}

class BlackHole {
  blackHoleMesh: THREE.Mesh;
  accretionDiskMesh: THREE.Mesh;
  glowMesh: THREE.Mesh;
  basePosition: THREE.Vector3;
  shakeIntensity: number;

  constructor({
    radius,
    diskInnerRadius,
    diskOuterRadius,
    diskColor,
    diskOpacity,
    glowIntensity,
    glowColor,
    position = [0, 0, 0],
    shakeIntensity = 0.1,
  }: BlackHoleProps) {
    // Event Horizon (Black Hole Sphere)
    const blackHoleGeometry = new THREE.SphereGeometry(radius, 32, 32);
    const blackHoleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Black hole sphere
    this.blackHoleMesh = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
    this.blackHoleMesh.position.set(...position);

    // Accretion Disk (Ring)
    const diskGeometry = new THREE.RingGeometry(diskInnerRadius, diskOuterRadius, 64);
    const diskMaterial = new THREE.MeshBasicMaterial({
      color: diskColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: diskOpacity,
    });
    this.accretionDiskMesh = new THREE.Mesh(diskGeometry, diskMaterial);
    this.accretionDiskMesh.rotation.x = Math.PI / 2; // Align disk horizontally
    this.accretionDiskMesh.position.set(...position);

    // Glow Effect (around the Black Hole)
    const glowGeometry = new THREE.SphereGeometry(radius * 1.2, 32, 32);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(glowColor) },
        intensity: { value: glowIntensity },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float intensity;
        varying vec3 vNormal;
        void main() {
          float glow = intensity * (1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)));
          gl_FragColor = vec4(glowColor * glow, 1.0);
        }
      `,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    this.glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    this.glowMesh.position.set(...position);

    // Base position and shake intensity
    this.basePosition = new THREE.Vector3(...position);
    this.shakeIntensity = shakeIntensity;
  }

  addToScene(scene: THREE.Scene): void {
    scene.add(this.blackHoleMesh);
    scene.add(this.accretionDiskMesh);
    scene.add(this.glowMesh);
  }

  updatePosition(x: number, y: number, z: number): void {
    this.basePosition.set(x, y, z);
  }

  animate(delta: number): void {
    const frequencyMultiplier = 100; // Increase frequency for faster oscillations
    const amplitudeMultiplier = 0.1 * this.shakeIntensity; // Amplify the intensity
  
    const shakeX = Math.sin(delta * frequencyMultiplier) * amplitudeMultiplier;
    const shakeY = Math.cos(delta * frequencyMultiplier * 1.2) * amplitudeMultiplier;
    const shakeZ = Math.sin(delta * frequencyMultiplier * 0.8) * amplitudeMultiplier;
  
    const currentPosition = new THREE.Vector3(
      this.basePosition.x + shakeX,
      this.basePosition.y + shakeY,
      this.basePosition.z + shakeZ
    );
  
    this.blackHoleMesh.position.copy(currentPosition);
    this.accretionDiskMesh.position.copy(currentPosition);
    this.glowMesh.position.copy(currentPosition);
  }
  
}

export default BlackHole;
