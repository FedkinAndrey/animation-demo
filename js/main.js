import "../scss/style.scss";
import './cards.js'
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {EffectComposer, RenderPass, UnrealBloomPass} from "three/addons";

const heroSection = document.getElementById('hero');
const w = window.innerWidth;
const h = heroSection.clientHeight;
const scene = new THREE.Scene();
//change scene fog color or comment it
scene.background = new THREE.Color( 0x190033 );
//change scene bg color
scene.fog = new THREE.FogExp2(0xEE3131, 0.035);
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 50;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(w, h);

heroSection.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;

// post-processing
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 100);
bloomPass.threshold = .1;
bloomPass.strength = 2.5;
bloomPass.radius = 0.2;
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

function getRandomSpherePoint({radius = 10}) {
  const minRadius = radius * 0.25;
  const maxRadius = radius - minRadius;
  const range = Math.random() * maxRadius + minRadius;
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  return {
    x: range * Math.sin(phi) * Math.cos(theta),
    y: range * Math.sin(phi) * Math.sin(theta),
    z: range * Math.cos(phi),
  };
}

const geo = new THREE.BoxGeometry(1, 1, 1);
//box color
const mat = new THREE.MeshBasicMaterial({
  color: 0xff007f,
});
const edges = new THREE.EdgesGeometry(geo);

function getBox() {
  return new THREE.LineSegments(edges, mat);
}

const boxGroup = new THREE.Group();
boxGroup.userData.update = (timeStamp) => {
  boxGroup.rotation.x = timeStamp * 0.0001;
  boxGroup.rotation.y = timeStamp * 0.0001;
};
scene.add(boxGroup);

const numBoxes = 1000;
const radius = 95;
for (let i = 0; i < numBoxes; i++) {
  const box = getBox();
  const {x, y, z} = getRandomSpherePoint({radius});
  box.position.set(x, y, z);
  box.rotation.set(x, y, z);
  boxGroup.add(box);
}


const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
scene.add(hemiLight);

function animate(timeStamp = 0) {
  requestAnimationFrame(animate);
  boxGroup.userData.update(timeStamp);
  composer.render(scene, camera);
  controls.update();
}

animate();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", handleWindowResize, false);