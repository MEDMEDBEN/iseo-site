/* ============================================================
   ISEO Premium — 3D model showcase (Three.js + GLTFLoader)
   Charge un modèle .glb (exporté depuis Tripo3D ou Blender) et
   crée une animation : rotation, réaction souris, et "exploded
   view" pilotée au scroll. Si le modèle est absent → état de
   secours élégant (photo), aucun crash.
   ------------------------------------------------------------
   ➜ Dépose ton modèle ici :  assets/models/product.glb
   ============================================================ */
const MODEL_URL = 'product.glb';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('glb-canvas');
  if (!canvas || !window.THREE || !THREE.GLTFLoader) { showFallback(); return; }
  init3D(canvas);
});

function showFallback() {
  const fb = document.getElementById('glb-fallback');
  const cv = document.getElementById('glb-canvas');
  if (fb) fb.style.display = 'grid';
  if (cv) cv.style.display = 'none';
}

function init3D(canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 6);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  if ('outputEncoding' in renderer) renderer.outputEncoding = THREE.sRGBEncoding;

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  };

  // Lighting — studio look for metallic materials
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const d1 = new THREE.DirectionalLight(0xffffff, 2.4); d1.position.set(5, 6, 6); scene.add(d1);
  const d2 = new THREE.DirectionalLight(0xC6A15B, 1.5); d2.position.set(-6, 2, 3); scene.add(d2);
  const p1 = new THREE.PointLight(0xB01E28, 2.0, 40); p1.position.set(-4, -3, 5); scene.add(p1);

  const group = new THREE.Group();
  scene.add(group);

  let explodeData = [];   // { mesh, base:Vector3, dir:Vector3 }
  let loaded = false;

  const loader = new THREE.GLTFLoader();
  loader.load(MODEL_URL, (gltf) => {
    const model = gltf.scene;

    // Center & normalise scale
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    model.scale.setScalar(3.2 / maxDim);

    // Prepare exploded-view data (each mesh pushed outward from center)
    model.traverse((o) => {
      if (o.isMesh) {
        const wc = new THREE.Vector3();
        o.getWorldPosition(wc);
        const dir = wc.clone().sub(center).normalize();
        if (dir.lengthSq() === 0) dir.set(0, 1, 0);
        explodeData.push({ mesh: o, base: o.position.clone(), dir });
        if (o.material) { o.material.needsUpdate = true; }
      }
    });

    group.add(model);
    loaded = true;
  }, undefined, (err) => { console.warn('[3D] modèle introuvable →', err); showFallback(); });

  // Interaction
  let mx = 0, my = 0, scrollP = 0;
  window.addEventListener('pointermove', (e) => {
    mx = (e.clientX / window.innerWidth - 0.5);
    my = (e.clientY / window.innerHeight - 0.5);
  });
  const section = document.getElementById('showcase');
  const updateScroll = () => {
    if (!section) return;
    const r = section.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    scrollP = Math.min(1, Math.max(0, -r.top / (total || 1)));
  };
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  let running = true;
  document.addEventListener('visibilitychange', () => running = !document.hidden);
  const clock = new THREE.Clock();
  const tick = () => {
    requestAnimationFrame(tick);
    if (!running) return;
    const t = clock.getElapsedTime();
    // Continuous spin + scroll adds extra rotation + gentle mouse steer
    group.rotation.y += 0.004 + mx * 0.02;
    group.rotation.x += ((my * 0.35) - group.rotation.x) * 0.05;
    group.position.y = Math.sin(t * 0.8) * 0.12;

    // Exploded view driven by scroll progress
    if (loaded) {
      const amt = scrollP * 0.9;
      explodeData.forEach(({ mesh, base, dir }) => {
        mesh.position.set(base.x + dir.x * amt, base.y + dir.y * amt, base.z + dir.z * amt);
      });
    }

    renderer.render(scene, camera);
  };
  resize(); window.addEventListener('resize', resize); tick();
}
