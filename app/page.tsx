"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Sphere from "@/components/Sphere";
import RingedSphere from "@/components/SphereRinged";
import Asteroid from "@/components/Asteroid";
import BlackHole from "@/components/BlackHole";

import PlanetInfo from "@/components/Planet_infos_html/PlanetInfo";

export default function Home() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // let cameraFollow:any=null
  const cameraFollow = useRef<string | null>(null);
  const [planetInfoShow,setPlanetInfoShow]=useState<string | null>(null)

  const [showLabel,setShowLabel]=useState(true);
  const [showCreator,setShowCreator]=useState(false)

  const clock = new THREE.Clock();

  useEffect(() => {
    setTimeout(() => {
      setShowLabel(false);
      setShowCreator(true); // Show "Created by Munkhtsog"
    }, 7000); // Wait 7 seconds

    setTimeout(() => {
      setShowCreator(false); // Hide creator label after 7 more seconds
    }, 14000); // Total 14 seconds
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(8, 10, 20);
    camera.lookAt(0, 0, 0);

    const cameraOffset = new THREE.Vector3(0, 1, 2);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    scene.background = new THREE.Color("#060a22");

    // Light source
    const light = new THREE.PointLight(0xffffe0, 2, 100);
    light.position.set(0, 0, 0);
    light.castShadow = true;
    scene.add(light);

    // Load the sun texture
    const textureLoader = new THREE.TextureLoader();
    const sunTexture = textureLoader.load("/sun.jpg");
    const normalMap = textureLoader.load("/sun.jpg");

    const sunGlowGeometry = new THREE.SphereGeometry(1.5, 32, 32);

    const sunGlowMaterial = new THREE.MeshStandardMaterial({
      map: sunTexture,           // Apply texture
      normalMap:normalMap,
      emissive: 0xff4500,        // Add emissive glow
      emissiveIntensity: 0.5,    // Reduce intensity to make texture visible
      roughness: 0.8,            // Increase roughness for less shiny surface
      metalness: 0,              // Ensure it's non-metallic
    });


    // Create the sun mesh
    const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
    sunGlow.position.copy(light.position);
    scene.add(sunGlow);


    // Planets
    const mercury = new Sphere({
      radius: 0.2,
      position: [3, 0, 0],
      texturePath: "/mercury.jpg",
      bumpMapPath: "/mercury.jpg",
    });

    const venus = new Sphere({
      radius: 0.3,
      position: [4, 0, 0],
      texturePath: "/venus.jpg",
      bumpMapPath: "/venus.jpg",
    });

    const earth = new Sphere({
      radius: 0.4,
      position: [5, 0, 0],
      texturePath: "/earth.jpg",
      bumpMapPath: "/earth.jpg",
    });

    const moon = new Sphere({
      radius: 0.1,
      position: [5, 0, 0],
      texturePath: "/moon.jpg",
      bumpMapPath: "/moon.jpg",
    });

    const mars = new Sphere({
      radius: 0.35,
      position: [6, 0, 0],
      texturePath: "/mars.jpg",
      bumpMapPath: "/mars.jpg",
    });

    const jupiter = new Sphere({
      radius: 0.8,
      position: [8, 0, 0],
      texturePath: "/jupiter.jpg",
      bumpMapPath: "/",
    });

    const saturn = new RingedSphere({
      radius: 0.7,
      ringInnerRadius: 0.8,
      ringOuterRadius: 1.5,
      ringOpacity: 0.7,
      sphereTexturePath: "/saturn.jpg",
      ringColor: "grey",
      position: [10, 0, 0],
      ringTexturePath: "/ring.png",
      ringRotation: Math.PI / 4,
    });

    const uranus = new RingedSphere({
      radius: 0.5,
      ringInnerRadius: 0.8,
      ringOuterRadius: 1,
      ringOpacity: 0.7,
      sphereTexturePath: "/uranus.jpg",
      ringColor: "grey",
      position: [13, 0, 0],
      ringTexturePath: "/ring.png",
      ringRotation: -Math.PI / 3,
    });

    const neptune = new Sphere({
      radius: 0.55,
      position: [15, 0, 0],
      texturePath: "/neptune.jpg",
      bumpMapPath: "/",
    });

    const asteroids:Asteroid[] = [];
    const asteroidCount = 100;

    for (let i = 0; i < asteroidCount; i++) {
      const radius = Math.random() * (23 - 17) + 17; // Random radius between 17 and 23
      const angle = Math.random() * Math.PI * 2;     // Random initial angle

      const asteroid = new Asteroid({
        minRadius: 0.1,
        maxRadius: 0.2,
        texture: "/asteroid.jpg",
        position: [radius * Math.cos(angle), 0, radius * Math.sin(angle)],
      });

      asteroid.angle = angle; // Store the initial angle
      asteroid.radius = radius; // Store the orbit radius
      asteroid.addToScene(scene);
      asteroids.push(asteroid);
    }

    const blackHole = new BlackHole({
      radius: 1,
      diskInnerRadius: 1.2,
      diskOuterRadius: 1.3,
      diskColor: "#110b03",
      diskOpacity: 0.7,
      glowIntensity: 2,
      glowColor: "#1b140a",
      position: [40, 0, 0],
    });

    // Add planets to the scene
    mercury.addToScene(scene);
    venus.addToScene(scene);
    earth.addToScene(scene);
    moon.addToScene(scene)
    mars.addToScene(scene);
    jupiter.addToScene(scene);
    saturn.addToScene(scene);
    uranus.addToScene(scene)
    neptune.addToScene(scene)
    blackHole.addToScene(scene)

    // Orbit paths
    const createOrbitPath = (radius: number, color: number) => {
      const geometry = new THREE.RingGeometry(radius, radius+0.05, 64);
      const material = new THREE.MeshBasicMaterial({
        color,
        opacity: 0.5,
        transparent: true,
        side: THREE.DoubleSide,
      });
      const orbitPath = new THREE.Mesh(geometry, material);
      orbitPath.rotation.x = Math.PI / 2;
      return orbitPath;
    };

    const mercuryOrbit = createOrbitPath(3, 0xaaaaaa);
    const venusOrbit = createOrbitPath(4, 0xdddddd);
    const earthOrbit = createOrbitPath(5, 0x00ff00);
    const marsOrbit = createOrbitPath(6, 0xff0000);
    const jupiterOrbit = createOrbitPath(8, 0x0000ff);
    const saturnOrbit = createOrbitPath(10, 0x888888);
    const uranusOrbit=createOrbitPath(13, 0xdddddd)
    const neptuneOrbit=createOrbitPath(15,0x0000ff)

    scene.add(mercuryOrbit);
    scene.add(venusOrbit);
    scene.add(earthOrbit);
    scene.add(marsOrbit);
    scene.add(jupiterOrbit);
    scene.add(saturnOrbit);
    scene.add(uranusOrbit)
    scene.add(neptuneOrbit)

    let mercuryAngle = 0;
    let venusAngle = 0;
    let earthAngle = 0;
    let moonAngle = 0;
    let marsAngle = 0;
    let jupiterAngle = 0;
    let saturnAngle = 0;
    let uranusAngle=0
    let neptuneAngle=0

    const moonOrbitRadius = 0.7

    const animate = () => {
      requestAnimationFrame(animate);

      mercury.mesh.position.set(3 * Math.cos(mercuryAngle), 0, 3 * Math.sin(mercuryAngle));
      mercuryAngle += 0.01;

      venus.mesh.position.set(4 * Math.cos(venusAngle), 0, 4 * Math.sin(venusAngle));
      venusAngle += 0.008;

      earth.mesh.position.set(5 * Math.cos(earthAngle), 0, 5 * Math.sin(earthAngle));
      earthAngle += 0.005;

      moon.mesh.position.set(
        earth.mesh.position.x + moonOrbitRadius * Math.cos(moonAngle), 
        earth.mesh.position.y, // Moon stays at the same Y position
        earth.mesh.position.z + moonOrbitRadius * Math.sin(moonAngle) 
      );
      moonAngle += 0.08; 

      mars.mesh.position.set(6 * Math.cos(marsAngle), 0, 6 * Math.sin(marsAngle));
      marsAngle += 0.004;

      jupiter.mesh.position.set(8 * Math.cos(jupiterAngle), 0, 8 * Math.sin(jupiterAngle));
      jupiterAngle += 0.002;

      saturn.sphereMesh.position.set(10 * Math.cos(saturnAngle), 0, 10 * Math.sin(saturnAngle));
      saturn.ringMesh.position.set(10 * Math.cos(saturnAngle), 0, 10 * Math.sin(saturnAngle));
      saturnAngle += 0.001;

      uranus.sphereMesh.position.set(13 * Math.cos(uranusAngle), 0, 13 * Math.sin(uranusAngle));
      uranus.ringMesh.position.set(13 * Math.cos(uranusAngle), 0, 13 * Math.sin(uranusAngle));
      uranusAngle += 0.003;

      neptune.mesh.position.set(15 * Math.cos(neptuneAngle), 0, 15 * Math.sin(neptuneAngle));
      neptuneAngle += 0.0005;

      for (const asteroid of asteroids) {
        asteroid.updatePosition(); // Update orbital position
      }

      controls.update();

      if(cameraFollow.current=="asteroid"){
        // const desiredCameraPos:any = asteroids[0].mesh?.position.clone().add(cameraOffset);

        // camera.position.lerp(desiredCameraPos, 0.1);
        // camera.lookAt(asteroids[0].mesh?.position);
        const targetPosition = new THREE.Vector3(20, 13, 0);

        // Use lerp to interpolate the camera's position
        camera.position.lerp(targetPosition, 0.1);

        camera.lookAt(17,0,0);
      }else if(cameraFollow.current=="sun"){
        const targetPosition = new THREE.Vector3(3, 1, 0);

        camera.position.lerp(targetPosition, 0.1);

        camera.lookAt(0,0,0);
      }else if(cameraFollow.current!=null && cameraFollow.current!="sun"){
        const planetMeshMap = new Map([
          ["mercury", mercury.mesh],
          ["venus", venus.mesh],
          ["earth", earth.mesh],
          ["moon", moon.mesh],
          ["mars", mars.mesh],
          ["jupiter", jupiter.mesh],
          ["saturn", saturn.sphereMesh],
          ["uranus", uranus.sphereMesh],
          ["neptune", neptune.mesh],
          ["blackhole",blackHole.blackHoleMesh]
        ]);        

        const selectedPlanetMesh:THREE.Mesh = planetMeshMap.get(cameraFollow.current)

        const desiredCameraPos:THREE.Vector3 | undefined = selectedPlanetMesh?.position.clone().add(cameraOffset);

        camera.position.lerp(desiredCameraPos, 0.1);
        camera.lookAt(selectedPlanetMesh?.position);
      }

      const delta = clock.getElapsedTime();
      blackHole.animate(delta);

      earth.mesh.rotation.y += 0.0001;
  
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
      <div ref={mountRef} className="relative flex justify-center items-center overflow-x-hidden overflow-y-hidden">
        {showLabel && (
          <div className="absolute font-bold text-[120px] text-white animate-fadeInOut">
            Solar System
          </div>
        )}
        {showCreator && (
          <div className="absolute font-bold text-[120px] text-white animate-fadeInOut">
            Created by Munkhtsog
          </div>
        )}
        <div className="absolute top-0 flex flex-row gap-6">
          {/* solar system */}
          <div className="flex items-center flex-col"
            onClick={()=>{
              setPlanetInfoShow(null)
              cameraFollow.current=null
            }}
          >
            <Image
              src="/mercury-round.png"
              width={50}
              height={50}
              className="rounded-full object-cover"
              alt="solar system"
            />
            <p>Solar system</p>
          </div>
          {/* sun */}
          <div className="flex items-center flex-col"
            onClick={()=>{
              cameraFollow.current="sun"
              setPlanetInfoShow("sun")
              cameraFollow.current="sun"
            }}
          >
            <Image
              src="/sun-round.png"
              width={50}
              height={50}
              className="rounded-full object-cover"
              alt="sun"
            />
            <p>Sun</p>
          </div>
          {/* mercury */}
          <div className="flex items-center flex-col"
            onClick={()=>{
              cameraFollow.current="mercury"
              setPlanetInfoShow("mercury")
              cameraFollow.current="mercury"
            }}
          >
            <Image
              src="/mercury-round.png"
              width={50}
              height={50}
              className="rounded-full object-cover"
              alt="mercury"
            />
            <p>Mercury</p>
          </div>
          {/* venus */}
          <div className="flex items-center flex-col"
            onClick={()=>{
              cameraFollow.current="venus"
              setPlanetInfoShow("venus")
              cameraFollow.current="venus"
            }}
          >
            <Image
              src="/venus-round.png"
              width={50}
              height={50}
              className="rounded-full object-cover"
              alt="venus"
            />
            <p>Venus</p>
          </div>
          {/* earth */}
          <div className="flex items-center flex-col"
            onClick={()=>{
              cameraFollow.current="earth"
              setPlanetInfoShow("earth")
              cameraFollow.current="earth"
            }}
          >
            <Image
              src="/earth-round.png"
              width={50}
              height={50}
              className="rounded-full object-cover"
              alt="earth"
            />
            <p>Earth</p>
          </div>
          {/* moon */}
          <div className="flex items-center flex-col"
            onClick={()=>{
              cameraFollow.current="moon"
              setPlanetInfoShow("moon")
              cameraFollow.current="moon"
            }}
          >
            <Image
              src="/moon-round.png"
              width={50}
              height={50}
              className="rounded-full object-cover"
              alt="moon"
            />
            <p>Moon</p>
          </div>
          {/* mars */}
          <div className="flex items-center flex-col"
            onClick={()=>{
              cameraFollow.current="mars"
              setPlanetInfoShow("mars")
              cameraFollow.current="mars"
            }}
          >
            <Image
              src="/mars-round.jpg"
              width={50}
              height={50}
              className="rounded-full object-cover"
              alt="mars"
            />
            <p>Mars</p>
          </div>
          {/* jupiter */}
          <div className="flex items-center flex-col"
            onClick={()=>{
              cameraFollow.current="jupiter"
              setPlanetInfoShow("jupiter")
              cameraFollow.current="jupiter"
            }}
          >
            <Image
              src="/jupiter-round.png"
              width={50}
              height={50}
              className="rounded-full object-cover"
              alt="jupiter"
            />
            <p>Jupiter</p>
          </div>
          {/* saturn */}
          <div className="flex items-center flex-col"
            onClick={()=>{
              cameraFollow.current="saturn"
              setPlanetInfoShow("saturn")
              cameraFollow.current="saturn"
            }}
          >
            <Image
              src="/saturn-round.webp"
              width={50}
              height={50}
              className="rounded-full object-cover"
              alt="saturn"
            />
            <p>Saturn</p>
          </div>
          {/* uranus */}
          <div className="flex items-center flex-col"
            onClick={()=>{
              cameraFollow.current="uranus"
              setPlanetInfoShow("uranus")
              cameraFollow.current="uranus"
            }}
          >
            <Image
              src="/uranus-round.png"
              width={50}
              height={50}
              className="rounded-full object-cover"
              alt="uranus"
            />
            <p>Uranus</p>
          </div>
          {/* neptune */}
          <div className="flex items-center flex-col"
            onClick={()=>{
              cameraFollow.current="neptune"
              setPlanetInfoShow("neptune")
              cameraFollow.current="neptune"
            }}
          >
            <Image
              src="/neptune-round.png"
              width={50}
              height={50}
              className="rounded-full object-cover"
              alt="neptune"
            />
            <p>Neptune</p>
          </div>
          {/* Asteroid */}
          <div className="flex items-center justify-center flex-col"
            onClick={()=>{
              cameraFollow.current="asteroid"
              setPlanetInfoShow("asteroid")
              cameraFollow.current="asteroid"
            }}
          >
            <Image
              src="/asteroid-round.png"
              width={50}
              height={50}
              className="rounded-full object-cover"
              alt="neptune"
            />
            <p>Asteroid belt</p>
          </div>
          {/* BlackHole  */}
          <div className="flex items-center justify-center flex-col"
            onClick={()=>{
              cameraFollow.current="blackhole"
              setPlanetInfoShow("blackhole")
              cameraFollow.current="blackhole"
            }}
          >
            <Image
              src="/black-hole-round.png"
              width={50}
              height={50}
              className="rounded-full object-cover"
              alt="neptune"
            />
            <p>Black hole</p>
          </div>
        </div>
        {
          planetInfoShow && (
            <div className="absolute w-[40%] h-[50%] left-0 bottom-0 z-100 bg-blue-400 bg-opacity-30 rounded-xl">
              <PlanetInfo planet={planetInfoShow} />
            </div>
          )
        }
      </div>
  );
}
