import './style.scss'

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// add canvas
const canvas = document.querySelector('#experience-canvas')
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// add scene
const scene = new THREE.Scene();

//camera
const camera = new THREE.PerspectiveCamera(40, sizes.width / sizes.height, 0.1, 1000);
// camera.position.z = 5;
camera.position.set(35, 10, 35);

// add draco loader to load models
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

// add gltf loader to load gltf models
const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

//cube texture loader
const environmentMap = new THREE.CubeTextureLoader()
  .setPath('/textures/env')
  .load([
    'px.webp',
    'nx.webp',
    'py.webp',
    'ny.webp',
    'pz.webp',
    'nz.webp',
  ]);

// add nested object
const textureMap = {
  first_scene: {
    day: "/textures/room/day/first_scene_again.webp",
  },
  second_scene: {
    day: "/textures/room/day/second_scene_again.webp",
  },
  third_scene: {
    day: "/textures/room/day/third_scene_again.webp",
  },
  fourth_scene: {
    day: "/textures/room/day/fourth_scene_again.webp",
  },
  fifth_scene: {
  day: "/textures/room/day/fifth_scene_again.webp",
  },
};

const loadedTextures = {
  day: {},
}

// texture loader
const textureLoader = new THREE.TextureLoader();

// Object entries
Object.entries(textureMap).forEach(([key, paths]) => {
  const dayTexture = textureLoader.load(paths.day);
  dayTexture.flipY = false;
  dayTexture.colorSpace = THREE.SRGBColorSpace;
  loadedTextures.day[key] = dayTexture;
});

// Material section
const glassMaterial = new THREE.MeshPhysicalMaterial({
  transmission: 1,
  opacity: 1,
  metalness: 0,
  roughness: 0,
  ior: 1,
  thickness: 0.01,
  specularIntensity: 1,
  envMap: environmentMap,
  envMapIntensity: 1,
  depthWrite: false,
});

const whiteMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
});

// Video element
const videoElement = document.createElement("video");
videoElement.src = "/textures/videos/milos.mp4";
videoElement.loop = true;
videoElement.muted = true;
videoElement.playsInline = true;
videoElement.autoplay = true;
videoElement.play();

// Video Renderer
const videoTexture = new THREE.VideoTexture(videoElement)
videoTexture.colorSpace = THREE.SRGBColorSpace;
videoTexture.flipY = false;

loader.load("/models/room_exported.glb", (glb) => {
  glb.scene.position.set(2, -3, 0)

  glb.scene.traverse(child => {
    if (child.isMesh) {

      Object.keys(textureMap).forEach(key => {
        if (child.name.includes(key)) {
          const material = new THREE.MeshBasicMaterial({
            map: loadedTextures.day[key],
          });

          child.material = material;
        }
        if (child.material.map) {
        child.material.map.minFilter = THREE.LinearFilter
      }
      });
       
      if (child.name.includes("glass")) {
        child.material = glassMaterial;
      }
      else if (child.name.includes("water")) {
        child.material = new THREE.MeshBasicMaterial({
          color: 0x558bc8,
          transparent: true,
          opacity: 0.3,
          depthWrite: false,
        });
      }
      else if (child.name.includes("bubble")) {
        child.material = whiteMaterial;
      }
      else if (child.name.includes("screen")) {
        child.material = new THREE.MeshBasicMaterial({
          map: videoTexture,
        });
      }
    }
  });

  scene.add(glb.scene);
});

// add render
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// add geometry
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

//  add cube
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

// add evenlistener
window.addEventListener("resize", () => {
  //declare sizes again
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // update camera projection
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// for highlight the object because i can't see it in a dark space
renderer.setClearColor("#ffffff" , 1);

// add light
// const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
// scene.add(ambientLight);
// const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
// directionalLight.position.set(20, 20, 20);
// scene.add(directionalLight);

// add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.2;
controls.target.set = (0, 0, 0);

// render animate function
const render = () => {

  //  cube.rotation.x += 0.01;
  //  cube.rotation.y += 0.01;

  controls.update();

  // code to known and control camera postion 
  // console.log(camera.position);
  // console.log(controls.target);
  // console.log("000000000")

  renderer.render(scene, camera);

  window.requestAnimationFrame(render);
};

render();