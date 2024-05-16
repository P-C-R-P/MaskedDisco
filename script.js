const scene = new THREE.Scene();

const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();

navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then((stream) => {
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
  })
  .catch((err) => {
    console.error('Error accessing microphone:', err);
  });

function animate() {
  requestAnimationFrame(animate);

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);

  const sum = dataArray.reduce((acc, val) => acc + val, 0);
  const averageAmplitude = sum / bufferLength;

  const scale = averageAmplitude / 50;
  cube.scale.set(scale, scale, scale);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();
