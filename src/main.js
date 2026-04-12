import './style.scss'

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/*---------- ADD CANVAS AND ADJUST SCENE ----------*/
const canvas = document.querySelector('#experience-canvas')
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const scene = new THREE.Scene();



/*---------- ADD LOADER ----------*/

// add draco loader to compressing and decompressing 3D meshes and point clouds
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

// add gltf loader to load gltf models
const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

/* ADD TEXTURES */

// texture loader
const textureLoader = new THREE.TextureLoader();

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

// add nested object for texture
const textureMap = {
  First_Scene: {
    day: "/textures/room/day/first_scene_again.webp",
  },
  Second_Scene: {
    day: "/textures/room/day/second_scene_again.webp",
  },
  Third_Scene: {
    day: "/textures/room/day/third_scene_again.webp",
  },
  Fourth_Scene: {
    day: "/textures/room/day/fourth_scene_again.webp",
  },
  Fifth_Scene: {
  day: "/textures/room/day/fifth_scene_again.webp",
  },
};

const loadedTextures = {
  day: {},
}

// Object entries to load day texture
Object.entries(textureMap).forEach(([key, paths]) => {
  const dayTexture = textureLoader.load(paths.day);
  dayTexture.flipY = false;
  dayTexture.colorSpace = THREE.SRGBColorSpace;
  loadedTextures.day[key] = dayTexture;
});

/* LOADED GLB MODEL */

loader.load("/models/room_exported.glb", (glb) => {

  glb.scene.traverse(child => {
    if (child.isMesh) {

      // HERE FOR BAKED OBJECT
      Object.keys(textureMap).forEach(key => {
        if (child.name.includes(key)) {
          const material = new THREE.MeshBasicMaterial({
            map: loadedTextures.day[key],
          });

          child.material = material;
        };

        if (child.material.map) {
          child.material.map.minFilter = THREE.LinearFilter
        }

      });

    }
  });

  scene.add(glb.scene);
});

/* ADD RENDER */

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// add geometry
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

//  add cube
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

/* ADD EVENT LISTERNER */
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

/* ADD LIGHT IF NECESSARY */

// for highlight the object because i can't see it in a dark space
// renderer.setClearColor("#ffffff" , 1);

/* ADD REALTIME LIGHT */

// const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
// scene.add(ambientLight);
// const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
// directionalLight.position.set(20, 20, 20);
// scene.add(directionalLight);

/* ADD CAMERA */
const camera = new THREE.PerspectiveCamera(
  40, 
  sizes.width / sizes.height, 
  0.1, 
  1000);
camera.position.set(1, 1, 1);

/* ADD ORBIT CONTROLS */
const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.2;

controls.target.set(0, 0, 0);
controls.update();

console.log(controls.enabled);

// set starting camera position
if (window.innerWidth < 768){
  camera.position.set(
    25.778973682202604, 
    12.826662493142399, 
    22.791982153439797, 
  );
  controls.target.set(
    -1.3342050177061286,
    3.779013313658971, 
    -0.19880393233485097,
  );
} 
else {
  camera.position.set(
    60.49764275034944, 
    17.806753580831288, 
    49.649443576586705, 
  );
  controls.target.set(
    -1.3342050177061286,
    3.779013313658971, 
    -0.19880393233485097,
  );
}

/* RENDER ANIMATE FUNCTION */

const render = () => {

  //  cube.rotation.x += 0.01;
  //  cube.rotation.y += 0.01;

  // code to known and control camera postion 
  console.log(camera.position);
  console.log(controls.target);
  console.log("000000000")

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(render);
};

render();