import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a black hole (sphere with event horizon effect)
const blackHoleGeometry = new THREE.SphereGeometry(2, 64, 64);
const blackHoleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
scene.add(blackHole);

// Accretion disk (rotating torus with glowing effect)
const accretionDiskGeometry = new THREE.TorusGeometry(3, 0.5, 16, 100);
const accretionDiskMaterial = new THREE.MeshBasicMaterial({ color: 0xff6600, wireframe: false });
const accretionDisk = new THREE.Mesh(accretionDiskGeometry, accretionDiskMaterial);
accretionDisk.rotation.x = Math.PI / 2;
scene.add(accretionDisk);

// Hidden order effect: Subtle glowing ring around black hole
const hiddenRingGeometry = new THREE.RingGeometry(2.2, 2.5, 64);
const hiddenRingMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
const hiddenOrderRing = new THREE.Mesh(hiddenRingGeometry, hiddenRingMaterial);
hiddenOrderRing.rotation.x = Math.PI / 2;
scene.add(hiddenOrderRing);

// Lighting setup
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(5, 5, 5);
scene.add(light);

// Camera position
camera.position.z = 8;

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    accretionDisk.rotation.z += 0.01; // Simulate rotation
    renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
