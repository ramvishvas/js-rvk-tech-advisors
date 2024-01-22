import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';

import ThreeGUIUtils from './ThreeGUIUtils.js';

const debugUI = () => {
    const wireFrameEnable = true;
    const gui = new ThreeGUIUtils();
    const debugObject = {};
    const cubeFolder = gui.addFolder('Advance Cube');
    cubeFolder.close();

    console.log(gui);

    const canvas = document.getElementById('app');

    const dimensions = {
        width: window.innerWidth,
        height: window.innerHeight,
    };

    /**
     * Scene
     */
    const scene = new THREE.Scene();

    /**
     * PerspectiveCamera(fov : Number, aspect : Number, near : Number, far : Number)
     */
    const camera = new THREE.PerspectiveCamera(75, dimensions.width / dimensions.height, 0.1, 1000);
    camera.position.setZ(5);

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({ alpha: true, canvas: canvas });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(dimensions.width, dimensions.height);

    /**
     * Axes Helper
     */
    const axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);

    /**
     * Cube
     */
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    // Material (MeshBasicMaterial)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    if (wireFrameEnable) {
        material.wireframe = true;
    }
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // GUI position
    cubeFolder.add(cube, 'visible');
    cubeFolder.add(cube.material, 'wireframe');
    cubeFolder.add(cube.position, 'x').min(-3).max(3).step(0.01).name('positionX');
    cubeFolder.add(cube.position, 'y').min(-3).max(3).step(0.01).name('positionY');
    cubeFolder.add(cube.position, 'z').min(-3).max(3).step(0.01).name('positionZ');

    // GUI rotation
    cubeFolder.add(cube.rotation, 'x').min(-3).max(3).step(0.01).name('rotationX');
    cubeFolder.add(cube.rotation, 'y').min(-3).max(3).step(0.01).name('rotationY');
    cubeFolder.add(cube.rotation, 'z').min(-3).max(3).step(0.01).name('rotationZ');

    // GUI scale
    cubeFolder.add(cube.scale, 'x').min(0).max(3).step(0.01).name('scaleX');
    cubeFolder.add(cube.scale, 'y').min(0).max(3).step(0.01).name('scaleY');
    cubeFolder.add(cube.scale, 'z').min(0).max(3).step(0.01).name('scaleZ');

    // GUI color
    debugObject.color = '#00ff00';
    cubeFolder
        .addColor(debugObject, 'color')
        .onChange((value) => {
            console.log(material.color);
            console.log(value);
            cube.material.color.set(debugObject.color);
        })
        .name('color');

    // GUI spin
    debugObject.spin = () => {
        gsap.to(cube.rotation, { duration: 1, y: cube.rotation.y + Math.PI * 2 });
    };
    cubeFolder.add(debugObject, 'spin');

    // GUI subdivision
    debugObject.subdivision = 2;
    cubeFolder
        .add(debugObject, 'subdivision')
        .min(1)
        .max(20)
        .step(1)
        .onFinishChange(() => {
            cube.geometry.dispose();
            cube.geometry = new THREE.BoxGeometry(
                1,
                1,
                1,
                debugObject.subdivision,
                debugObject.subdivision,
                debugObject.subdivision,
            );
        });

    // GUI reset
    gui.addButton('Reset', () => {
        cube.position.set(0, 0, 0);
        cube.rotation.set(0, 0, 0);
        cube.scale.set(1, 1, 1);
    });

    // Controls (OrbitControls)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const animate = () => {
        // Update controls
        controls.update();

        // Render
        renderer.render(scene, camera);

        // Call tick again on the next frame
        requestAnimationFrame(animate);
    };

    /**
     * WebGL.isWebGLAvailable()
     */
    if (WebGL.isWebGLAvailable()) {
        // Initiate function or other initializations here
        animate();
    } else {
        const warning = WebGL.getWebGLErrorMessage();
        canvas.appendChild(warning);
    }

    window.addEventListener('resize', () => {
        // Update sizes
        dimensions.width = window.innerWidth;
        dimensions.height = window.innerHeight;

        // Update camera
        camera.aspect = dimensions.width / dimensions.height;
        camera.updateProjectionMatrix();

        // Update renderer
        renderer.setSize(dimensions.width, dimensions.height);
        // To handle multiple monitors
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
};

export default debugUI;
