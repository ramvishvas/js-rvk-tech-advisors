import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const geometry = () => {
    const wireFrameEnable = true;

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
    // const geometry = new THREE.BoxGeometry(1, 1, 1);

    // // Create an empty BufferGeometry
    // const geometry = new THREE.BufferGeometry();

    // // Create a Float32Array containing the vertices position (3 by 3)
    // const positionsArray = new Float32Array([
    //     0,
    //     0,
    //     1, // First vertex
    //     0,
    //     1,
    //     0, // Second vertex
    //     1,
    //     0,
    //     0, // Third vertex
    // ]);

    // // Create the attribute and name it 'position'
    // const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
    // geometry.setAttribute('position', positionsAttribute);

    // Create an empty BufferGeometry
    const geometry = new THREE.BufferGeometry();

    // Create 50 triangles (450 values)
    const count = 50;
    const positionsArray = new Float32Array(count * 3 * 3);
    for (let i = 0; i < count * 3 * 3; i++) {
        positionsArray[i] = (Math.random() - 0.5) * 4;
    }

    // Create the attribute and name it 'position'
    const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
    geometry.setAttribute('position', positionsAttribute);

    // Material (MeshBasicMaterial)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    if (wireFrameEnable) {
        material.wireframe = true;
    }
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

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

export default geometry;
