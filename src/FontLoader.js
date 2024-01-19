import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import ThreeGUIUtils from './ThreeGUIUtils.js';

const texturePath = './static/textures/matcaps/9.png';
const debugObject = {};
let textFolder = null;

const fontDefaultOption = {
    size: 0.75,
    height: 0.3,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
    lineHeight: 0.5, // Set the desired vertical spacing between lines
};

const getTextGeometry = (text, font, option = {}) => {
    const textGeometry = new TextGeometry(text, {
        font: font,
        ...fontDefaultOption,
        ...option,
    });
    textGeometry.text = text; // Add text so we can access it later
    textGeometry.center(); // Center the text
    return textGeometry;
};

const addDonuts = (scene, torusGeometry, boxGeometry, material) => {
    const donut = new THREE.Mesh(torusGeometry, material);
    const cube = new THREE.Mesh(boxGeometry, material);

    [donut.position.x, donut.position.y, donut.position.z] = Array(3)
        .fill()
        .map(() => THREE.MathUtils.randFloatSpread(120));

    [cube.position.x, cube.position.y, cube.position.z] = Array(3)
        .fill()
        .map(() => THREE.MathUtils.randFloatSpread(120));

    [donut.rotation.x, donut.rotation.y, donut.rotation.z] = Array(3)
        .fill()
        .map(() => THREE.MathUtils.degToRad(THREE.MathUtils.randFloatSpread(720)));

    [cube.rotation.x, cube.rotation.y, cube.rotation.z] = Array(3)
        .fill()
        .map(() => THREE.MathUtils.degToRad(THREE.MathUtils.randFloatSpread(720)));

    scene.add(donut, cube);
};

const addTextDebug = (textGroup, font) => {
    if (window.location.hash === '#debug') {
        debugObject.textSetting = { ...fontDefaultOption };

        const addTextGUI = (setting, propertyName, min, max, step) => {
            textFolder
                .add(setting, propertyName)
                .min(min)
                .max(max)
                .step(step)
                .name(propertyName)
                .onChange((value) => {
                    textGroup.children.forEach((child) => {
                        const newGeometry = getTextGeometry(child.geometry.text, font, {
                            ...child.geometry.parameters.options,
                            [propertyName]: value,
                        });
                        child.geometry.dispose();
                        child.geometry = newGeometry;
                    });
                });
        };

        addTextGUI(debugObject.textSetting, 'size', 0.1, 1, 0.01);
        addTextGUI(debugObject.textSetting, 'height', 0.1, 1, 0.01);
        addTextGUI(debugObject.textSetting, 'curveSegments', 1, 50, 1);
        addTextGUI(debugObject.textSetting, 'bevelEnabled');
        addTextGUI(debugObject.textSetting, 'bevelThickness', 0.01, 0.5, 0.01);
        addTextGUI(debugObject.textSetting, 'bevelSize', 0.01, 0.5, 0.01);
        addTextGUI(debugObject.textSetting, 'bevelOffset', -0.5, 0.5, 0.01);
        addTextGUI(debugObject.textSetting, 'bevelSegments', 1, 10, 1);
        addTextGUI(debugObject.textSetting, 'lineHeight', 0.1, 1, 0.01);
    }
};

const addAxesHelperDebug = (debugGui) => {
    if (window.location.hash === '#debug') {
        debugObject.showAxesHelper = true;

        const toggleAxesHelper = () => {
            axesHelper.visible = debugObject.showAxesHelper;
        };

        debugGui.addCheckbox(debugObject, 'showAxesHelper').name('Show Axes Helper').onChange(toggleAxesHelper);

        // Initially set visibility of axes helper
        toggleAxesHelper();
    }
};

const onFontLoad = (font) => {
    const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
    const textGroup = new THREE.Group();
    addTextDebug(textGroup, font);

    const createTextMesh = (text, position) => {
        const geometry = getTextGeometry(text, font, debugObject.textSetting);
        const mesh = new THREE.Mesh(geometry, textMaterial);
        mesh.position.copy(position);
        return mesh;
    };

    const rvkMesh = createTextMesh('RVK', new THREE.Vector3(0, 1, 0));
    const techMesh = createTextMesh('TECH', new THREE.Vector3(0, 0, 0));
    const advisorMesh = createTextMesh('ADVISORS', new THREE.Vector3(0, -1, 0));

    textGroup.add(rvkMesh, techMesh, advisorMesh);
    scene.add(textGroup);

    // Add mouse move event listener
    window.addEventListener('mousemove', onMouseMove);

    const torusGeometry = new THREE.TorusGeometry(0.6, 0.4, 13, 40);
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

    for (let i = 0; i < 500; i++) {
        addDonuts(scene, torusGeometry, boxGeometry, textMaterial);
    }
};

const canvas = document.getElementById('app');
const dimensions = { width: window.innerWidth, height: window.innerHeight };
const scene = new THREE.Scene();

const loadingManager = new THREE.LoadingManager();

const textureLoader = new THREE.TextureLoader(loadingManager);
const matcapTexture = textureLoader.load(texturePath);
matcapTexture.colorSpace = THREE.SRGBColorSpace;

const camera = new THREE.PerspectiveCamera(75, dimensions.width / dimensions.height, 0.1, 1000);
camera.position.setZ(3);

const renderer = new THREE.WebGLRenderer({ alpha: true, canvas: canvas });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(dimensions.width, dimensions.height);

const axesHelper = new THREE.AxesHelper(3);
axesHelper.visible = false;
scene.add(axesHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Calculate the rotation values
const startRotation = {
    z: Math.PI / 4,
    y: Math.PI / 4,
    x: Math.PI / 4,
};

const endRotation = {
    z: -Math.PI / 4,
    y: -Math.PI / 4,
    x: -Math.PI / 4,
};

// Modify the GSAP animation to animate rotationObject instead of scene.rotation
gsap.fromTo(
    scene.rotation,
    { z: startRotation.z, y: startRotation.y, x: startRotation.x },
    {
        z: endRotation.z,
        y: endRotation.y,
        x: endRotation.x,
        duration: 10,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
    },
);

// Define a function to handle mouse move events
const onMouseMove = (event) => {
    console.log('onMouseMove', event.clientX, event.clientY);
    // Normalize mouse coordinates to range [-1, 1]
    const mouseX = (event.clientX / dimensions.width) * 2 - 1;
    const mouseY = -(event.clientY / dimensions.height) * 2 + 1;

    // Adjust rotation based on mouse movement
    scene.rotation.x = mouseY * 0.5; // Adjust rotation around x-axis
    scene.rotation.y = mouseX * 1; // Adjust rotation around y-axis
};

const animate = () => {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

if (WebGL.isWebGLAvailable()) {
    animate();
} else {
    const warning = WebGL.getWebGLErrorMessage();
    canvas.appendChild(warning);
}

window.addEventListener('resize', () => {
    dimensions.width = window.innerWidth;
    dimensions.height = window.innerHeight;
    camera.aspect = dimensions.width / dimensions.height;
    camera.updateProjectionMatrix();
    renderer.setSize(dimensions.width, dimensions.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (!fullscreenElement) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
});

const fontLoader = () => {
    if (window.location.hash === '#debug') {
        const gui = new ThreeGUIUtils('Setting');
        addAxesHelperDebug(gui);
        textFolder = gui.addFolder('Text');
        textFolder.open();
    }
    const fontLoader = new FontLoader();
    fontLoader.load(
        'fonts/helvetiker_regular.typeface.json',
        onFontLoad,
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (err) => {
            console.log('An error happened', err);
        },
    );
};

export default fontLoader;
