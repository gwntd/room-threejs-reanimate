import './style.scss'

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';

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

// texture loader
const textureLoader = new THREE.TextureLoader();

// Object entries
Object.entries(textureMap).forEach(([key, paths]) => {
  const dayTexture = textureLoader.load(paths.day);
  dayTexture.flipY = false;
  dayTexture.colorSpace = THREE.SRGBColorSpace;
  loadedTextures.day[key] = dayTexture;
});

// animation object
const xAxisFan = [];
const yAxisFan = [];

// raycaster
const raycaster = new THREE.Raycaster();
const raycasterObject = [];
let currentIntersects = [];

// pointer
const pointer = new THREE.Vector2();

// Add Object Classification
const socialLinks = {
  "Github": "https://github.com/gwntd",
  "X": "https://x.com/gwntodd",
  "Youtube": "https://www.youtube.com/@gwntod",
};

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

// Renderer Texture Video
const videoTexture = new THREE.VideoTexture(videoElement)
videoTexture.colorSpace = THREE.SRGBColorSpace;
videoTexture.flipY = false;

// Add Pointer Move Event Listener
window.addEventListener("pointermove", (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
});

// add HTML Element
const modals = {
  mywork: document.querySelector(".modal.mywork"),
  about: document.querySelector(".modal.about"),
  contact: document.querySelector(".modal.contact"),
};

const showModal = (modal) => {
  modal.style.display = "block"

  gsap.set(modal, {opacity: 0});

  gsap.to(modal, {
    opacity: 1,
    duration: 0.5,
  });
};

const hideModal = (modal) => {
  gsap.to(modal, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      modal.style.display = "none"
    },
  });
};

// select exit button
document.querySelectorAll(".modal-exit-button").forEach((button) => {
  let touchHappened = true;
  button.addEventListener("click", (event) => {
    touchHappened
    const closedButton = event.currentTarget.closest(".modal");
    hideModal(closedButton);
  },
  { passive : false }
  );

  button.addEventListener("touchend", (event) => {
    if(touchHappened) return;
    event.preventDefault();
    const modal = event.currentTarget.closest(".modal");
    hideModal(modal);
  },
  { passive : false }
  );
});

// Add Click Event Listener (MOBILE)
window.addEventListener ("touchstart", (event) => {
  event.preventDefault();
  pointer.x = (event.touches[0].clientX / sizes.width) * 2 - 1;
  pointer.y = - (event.touches[0].clientY / sizes.height) * 2 + 1;
},
{ passive: false }
);

window.addEventListener ("touchend", (event) => {
  event.preventDefault();
  handleRaycasterInteraction();
},
{ passive: false }
);

function handleRaycasterInteraction (){

  if (currentIntersects.length > 0){
    const object = currentIntersects[0].object;

    Object.entries(socialLinks).forEach(([key, url]) => {
      if (object.name.includes(key)){
        window.open(url, "_blank", "noopener,noreferrer");
      }
    });

    if (object.name.includes("Mywork")){
      showModal(modals.mywork)
    }
    else if (object.name.includes("About")){
      showModal(modals.about)
    }
    else if (object.name.includes("Contact")){
      showModal(modals.contact)
    }
  }
  
}

// Add Click Event Listener (PC)
window.addEventListener("click", handleRaycasterInteraction);


loader.load("/models/room_exported.glb", (glb) => {
  glb.scene.position.set(2, -3, 0)

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
      
      // HERE FOR UNBAKED OBJECT
      if (child.name.includes("Glass")) {
        child.material = glassMaterial;
      }
      else if (child.name.includes("Water")) {
        child.material = new THREE.MeshBasicMaterial({
          color: 0x558bc8,
          transparent: true,
          opacity: 0.3,
          depthWrite: false,
        });
      }
      else if (child.name.includes("Bubble")) {
        child.material = whiteMaterial;
      }
      else if (child.name.includes("Screen")) {
        child.material = new THREE.MeshBasicMaterial({
          map: videoTexture,
        });
      };

      if (child.name.includes("Fan")){

        if (child.name.includes("Fan_Front") || child.name.includes("Fan_Behind")) {
          xAxisFan.push(child);
        }
        else if (child.name.includes("Fan_Mid")){
          yAxisFan.push(child);
        }
      }

      if (child.name.includes("Raycaster")){
        raycasterObject.push(child);
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
controls.target.set(0, 0, 0);

// render animate function
const render = () => {

  //  cube.rotation.x += 0.01;
  //  cube.rotation.y += 0.01;

  controls.update();

  // code to known and control camera postion 
  // console.log(camera.position);
  // console.log(controls.target);
  // console.log("000000000")

  // animate fans
  xAxisFan.forEach(fan => {
    fan.rotation.x += 0.01;
  })
  yAxisFan.forEach(fan => {
    fan.rotation.y += 0.01;
  })

  // raycaster
  // update the picking ray with camera and pointer position
  raycaster.setFromCamera( pointer, camera);

  //calculate object intersecting the picking ray
  currentIntersects = raycaster.intersectObjects( raycasterObject, true );

  for ( let i = 0; i < currentIntersects.length; i ++ ){
    // currentIntersects[ i ].object.material.color.set( 0xff0000 );
  };

  if ( currentIntersects.length > 0 ){
    const currentIntersectObject = currentIntersects[0].object;

    document.body.style.cursor = currentIntersectObject.name.includes("Pointer") ? "pointer" : "default";
  }
  else {
    document.body.style.cursor = "default";
  };

  renderer.render(scene, camera);

  window.requestAnimationFrame(render);
};

render();