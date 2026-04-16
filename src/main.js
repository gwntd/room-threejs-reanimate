import './style.scss'

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import gsap from 'gsap';

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

/*---------- ADD TEXTURES ----------*/

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

/*---------- ADD VIDEO ----------*/
// Video element
const videoElement = document.createElement("video");
videoElement.src = "/textures/videos/";
videoElement.loop = true;
videoElement.muted = true;
videoElement.playsInline = true;
videoElement.autoplay = true;
videoElement.play();

// Renderer Texture Video
const videoTexture = new THREE.VideoTexture(videoElement)
videoTexture.colorSpace = THREE.SRGBColorSpace;
videoTexture.flipY = false;

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

/*---------- ADD MATERIAL TEXTURE ----------*/

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

const waterMaterial = new THREE.MeshBasicMaterial({
            color: 0x558bc8,
            transparent: true,
            opacity: 0.3,
            depthWrite: false,
});

const videoMaterial = new THREE.MeshBasicMaterial({
            map: videoTexture,
});

// ---------- LINK STORAGE ---------- */

const socialLinks = {
  "Github": "https://github.com/gwntd",
  "X": "https://x.com/gwntodd",
  "Youtube": "https://www.youtube.com/@gwntod",
}

// ---------- HTML STORAGE ---------- */

const modal = {
  mywork: document.querySelector(".modal.mywork"),
  about: document.querySelector(".modal.about"),
  contact: document.querySelector(".modal.contact"),
};
// ---------- ADD OBJECT STORAGE ---------- */

const animatedIntroObject = {
  Boba_Cup : {
    hover : true,
    raycaster: true,
  },
  Box_Storage : {
    hover : true,
    raycaster: true,
  },
  Cactus_Pot : {
    hover : true,
    raycaster: true,
  },
  Calender : {
    hover : true,
    raycaster: true,
  },
  Carpet : {
    hover : true,
    raycaster: true,
  },
  Carrot : {
    hover : true,
    raycaster: true,
  },
  Egg : {
    hover : true,
    raycaster: true,
  },
  Stone : {
    hover : true,
    raycaster: true,
  },
  Yobel: {
    hover : true,
    raycaster: true,
  },
  Flower_Table : {
    hover : true,
    raycaster: true,
  },
  Frame : {
    hover : true,
    raycaster: true,
  },
  Grass : {
    hover : true,
    raycaster: true,
  },
  Hanging_Flower : {
    hover : true,
    raycaster: true,
  },
  Keyboard : {
    hover : true,
    raycaster: true,
  },
  Light_Bulb : {
    hover : true,
    raycaster: true,
  }, 
  Pikachu : {
    hover : true,
    raycaster: true,
  },
  Sandals : {
    hover : true,
    raycaster: true,
  },
  Mouse : {
    hover : true,
    raycaster: true,
  }, 
  Microphone : {
    hover : true,
    raycaster: true,
  },
  Pencil : {
    hover : true,
    raycaster: true,
  },
  Pizza_And_Coke : {
    hover : true,
    raycaster: true,
  },
  Light_Bulp : {
    hover : true,
    raycaster: true,
  },
  Speaker : {
    hover : true,
    raycaster: true,
  },
  Tea : {
    hover : true,
    raycaster: true,
  },
  Fish_Real : { 
    hover : true,
    raycaster: true,
  },
  Logo : {
    name : ["Logo_X","Logo_Youtube","Logo_Github"],
    hover : true,
    raycaster: true,
  },
  Mywork : {
    hover : true,
    raycaster: true,
    modal : "mywork",
  },
  About : {
    hover : true,
    raycaster: true,
    modal : "about",
  },
  Contact : {
    hover : true,
    raycaster: true,
    modal : "contact",
  },
}

// ---------- OBJECT ANIMATION STORAGE ---------- */

// fan axis
const xAxisFan = [];
const yAxisFan = [];

// raycaster
const raycaster = new THREE.Raycaster();
const raycasterObject = [];
let currentIntersects = [];
let currentHoverObject = null;

// pointer
const pointer = new THREE.Vector2();

window.addEventListener("pointermove", (event) => {
  pointer.x = (event.clientX / sizes.width) * 2 - 1;
  pointer.y = -(event.clientY / sizes.height) * 2 + 1;
})

// new hitbox
const hitboxToObjectMap = new Map();

// ---------- IDK ---------- */

// hover
function hoverAnimation(object, isHovering){

  if (!object) return;

  gsap.killTweensOf(object.scale);
  gsap.killTweensOf(object.position);

  if (!object.userData.initialScale){
    object.userData.initialScale = object.scale.clone();
    object.userData.initialPosition = object.position.clone();
  }

  const baseScale = object.userData.initialScale;
  const scaleMultiplier = isHovering ? 1.5 : 1;

  gsap.to(object.scale, {
    x: object.userData.initialScale.x * scaleMultiplier,
    y: object.userData.initialScale.y * scaleMultiplier,
    z: object.userData.initialScale.z * scaleMultiplier,
    duration: 0.3,
    ease: "power2.out",
    overwrite: true,
  });

  // gsap.to(object.position, {
  //   y: object.userData.initialPosition.y + (isHovering ? 0.2 : 0), duration: 0.2
  // });
}

/*---------- LOADED GLB MODEL ----------*/

loader.load("/models/room_exported.glb", (glb) => {

  glb.scene.traverse(child => {
    if (child.isMesh) {

      // HERE FOR BAKED OBJECT
      Object.keys(textureMap).forEach(key => {
        
        function applyBakedMaterial(child, key) {
          const texture = loadedTextures.day[key];

          texture.minFilter = THREE.LinearFilter;

          child.material = new THREE.MeshBasicMaterial({
          map: texture,
          });
        }

        if (child.name.includes(key)) {
          applyBakedMaterial(child, key);
        }
      });

      // HERE UNBAKED OBJECT
      const Container = [
        {
          object: "Glass",
          material: glassMaterial
        },
        {
          object: "Water",
          material: waterMaterial
        },
        {
          object: "Bubble",
          material: whiteMaterial
        },
        {
          object: "Screen",
          material: videoMaterial
        },
        {
          object: ["Fan_Front", "Fan_Behind"],
          animate: xAxisFan,
        },
        {
          object: ["Fan_Mid"],
          animate: yAxisFan,
        },
        {
          object: ["Fish_Real", "Fish_Bubble"],
          animate: null,
        },
        {
          object: ["Gaming_Chair"],
          animate: null,
        },
        {
          object: ["Clock_Hour"],
          animate: null,
        },
        {
          object: ["Clock_Minute"],
          animate: null,
        },
        {
          object: ["Clock_Minute"],
          animate: null,
        },

      ];

      function applyContainer(child){
        for (const item of Container){

          const match = Array.isArray(item.object)
            ? item.object.some(name => child.name.includes(name))
            : child.name.includes(item.object);
          if (match){
            // material
            if (item.material){
              child.material = item.material;
            }
          
            // animation
            if (item.animate){
              if (!item.animate.includes(child)){
                item.animate.push(child)
              }
            }
            return;
          }
        }
      }
      
      // RAYCASTER

      const tagsName = getTags(child.name);

      let matchName = null;

      const configEntry = Object.entries(animatedIntroObject).find(([key, config]) => {
        const name = child.name.toLowerCase();
        
        //check multiples name
        if(config.name){
          const found = config.name.find(n => name.includes(n.toLowerCase()));

          if (found){
            matchName = found;
            return true;
          }
        }

        if (name.includes(key.toLowerCase())){
          matchName = key;
          return true;
        }

        // fallback to key
        return false;
      });

      child.userData.tags = child.userData.tags || [];
      
      if(configEntry) {
        const [, config] = configEntry;

        if (config.hover)child.userData.tags.push("Hover");
        if (config.raycaster)child.userData.tags.push("Raycaster");
      }
        if (tagsName.includes("Hover")){
          child.userData.tags.push("Hover");
        }
        if (tagsName.includes("Raycaster")){
          child.userData.tags.push("Raycaster");
        }

        // logo pointer event
        const logoLinks = {
          Logo_X: socialLinks.X,
          Logo_Youtube: socialLinks.Youtube,
          Logo_Github: socialLinks.Github,
        };

        if (matchName && logoLinks[matchName]) {
          child.userData.link = logoLinks[matchName];
          child.userData.tags.push("Pointer");
        }

        // modal pointer event
        const modalLinks = {
          Mywork: "mywork",
          About: "about",
          Contact: "contact",
        };

        if (matchName && modalLinks[matchName]) {
          child.userData.modal = modalLinks[matchName];
          child.userData.tags.push("Pointer");
        }

        // raycasted child push child 
        if(child.userData.tags.includes("Raycaster")){
          raycasterObject.push(child);

          // DEBUG
          // child.material = new THREE.MeshBasicMaterial({
          //   color: 0xff0000,
          //   wireframe: true
          // });
        }

        if (child.userData.tags.includes("Hover")){
          child.userData.initialScale = child.scale.clone();
          child.userData.initialPosition = child.position.clone();
        }

      applyContainer(child);
    }
    // console.log(child.name, child.type);
  });

  scene.add(glb.scene);
});

/*---------- ADD ANIMATION ----------*/



/*---------- ADD RENDER ----------*/

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// add geometry
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

//  add cube
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

/*---------- ADD EVENT LISTERNER ----------*/
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

/*---------- ADD LIGHT IF NECESSARY ----------*/

// for highlight the object because i can't see it in a dark space
// renderer.setClearColor("#ffffff" , 1);

/*---------- ADD REALTIME LIGHT ----------*/

// const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
// scene.add(ambientLight);
// const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
// directionalLight.position.set(20, 20, 20);
// scene.add(directionalLight);

/*---------- ADD CAMERA ----------*/
const camera = new THREE.PerspectiveCamera(
  40, 
  sizes.width / sizes.height, 
  0.1, 
  1000);

/*---------- ADD ORBIT CONTROLS ----------*/
const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.2;

controls.target.set(0, 0, 0);
controls.update();

console.log(controls.enabled);

/*---------- ADD CAMERA CONTROLS ----------*/

if (window.innerWidth < 768){
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
else {
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

/*---------- IDK ----------*/

function getTags(name){
  const parts = name.split("__");

  if (parts.length < 2) return [];

  return parts[1].split("_");
}

// CLICK EVENT OPEN LINK

let isModalOpen = false;
let pointerMoved = false;
let pointerDownPosition = { x:0, y:0 };

window.addEventListener("pointerdown", (e) => {
  pointerMoved = false;
  pointerDownPosition = { x: e.clientX, y: e.clientY }
});

window.addEventListener("pointermove", (e) => {
  const dx = e.clientX - pointerDownPosition.x;
  const dy = e.clientY - pointerDownPosition.y;
  if (Math.sqrt(dx * dx + dy* dy) > 5){
    pointerMoved = true;
  }
});

window.addEventListener("pointerup", () => {
  if (pointerMoved) return;
  if (isModalOpen) return;
  if (!currentHoverObject) return;

  const clickable = getClickObject(currentHoverObject)
  if (clickable) {
    window.open(clickable.userData.link, "_blank");
    return;
  }

  const modalKey = currentHoverObject.userData.modal;
  if (modalKey && modal[modalKey]){
    Object.values(modal).forEach(m => m?.classList.remove("active"));
    modal[modalKey].classList.add("active");
    isModalOpen = true;
    controls.enabled = false;
  }

  console.log("clicked");
  console.log("currentHoverObject:", currentHoverObject);
  console.log("modal key:", currentHoverObject?.userData?.modal);
});

document.querySelectorAll(".modal-exit-button").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.closest(".modal").classList.remove("active");
    isModalOpen = false;
    controls.enabled = true;
  });
});

Object.values(modal).forEach(m => {
  m?.addEventListener("click", (e) => {
    if (e.target === m) m.classList.remove("active");
    isModalOpen = false;
    controls.enabled = true;
  });
});

document.querySelectorAll(".modal").forEach(m => {
  m.addEventListener("click", (e) => {
    if (e.target === m) m.classList.remove("active");
  });
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    Object.values(modal).forEach(m => m?.classList.remove("active"));
    isModalOpen = false;
    controls.enabled = true;
  }
});

/*---------- IDK ----------*/

function getHoverObject(object){
  while(object){
    if(object.userData.tags?.includes("Hover")){
      return object;
    }
    object = object.parent;
  }
  return null;
}

function getClickObject(object){
  while (object) {
    if (object.userData.link) return object;
    object = object.parent;
  }
  return null;
}

/*---------- RENDER ANIMATE FUNCTION ----------*/

const render = () => {

  //  cube.rotation.x += 0.01;
  //  cube.rotation.y += 0.01;

  // code to known and control camera postion 
  // console.log(camera.position);
  // console.log(controls.target);
  // console.log("000000000")

  // ANIMATE FANS
  xAxisFan.forEach(fan => {
    fan.rotation.x += 0.01;
  })
  yAxisFan.forEach(fan => {
    fan.rotation.y += 0.01;
  })

  // RAYCASTER
  if (!isModalOpen){
    raycaster.setFromCamera( pointer, camera);

    currentIntersects = raycaster.intersectObjects( raycasterObject, true );

    const rawHit = currentIntersects.length > 0 ? currentIntersects[0].object: null;

    const hit = getHoverObject(rawHit);

    if (hit !== currentHoverObject) {

          if (currentHoverObject) {
            hoverAnimation(currentHoverObject, false);
            currentHoverObject = null;
          }
        
          if (hit && hit.userData.tags?.includes("Hover")) {
            hoverAnimation(hit, true);
            currentHoverObject = hit;
          }
        }
        
        document.body.style.cursor = currentHoverObject?.userData.tags?.includes("Pointer") ? "pointer" : "default";
    }
    else {
      // nothing hit → reset
      if (currentHoverObject) {
        hoverAnimation(currentHoverObject, false);
        currentHoverObject = null;
      }

    document.body.style.cursor = "default";
  }

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
};

render();