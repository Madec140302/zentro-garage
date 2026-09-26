// ============================================================
// ZENTRO GARAGE
// main.js - Version complète
// ============================================================

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// ============================================================
// CONFIGURATION
// ============================================================

const CAR_MODEL_PATH = "./assets/cars/GolfR.glb";

// ============================================================
// VARIABLES
// ============================================================

let scene;
let camera;
let renderer;
let controls;

let car = null;
let carBodyMaterials = [];

let clock = new THREE.Clock();

let targetCarColor = 0x050505;

let garageLights = [];

const loadingScreen = document.getElementById("loadingScreen");
const customizationPanel = document.getElementById("customizationPanel");
const notification = document.getElementById("notification");

// ============================================================
// INITIALISATION
// ============================================================

init();
animate();

// ============================================================
// INIT
// ============================================================

function init() {
    // --------------------------------------------------------
    // SCÈNE
    // --------------------------------------------------------

    scene = new THREE.Scene();

    scene.background = new THREE.Color(0x050608);

    // --------------------------------------------------------
    // CAMÉRA
    // --------------------------------------------------------

    camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.set(6, 3.2, 7);

    // --------------------------------------------------------
    // RENDERER
    // --------------------------------------------------------

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance"
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    document.body.appendChild(renderer.domElement);

    // --------------------------------------------------------
    // CONTROLES
    // --------------------------------------------------------

    controls = new OrbitControls(
        camera,
        renderer.domElement
    );

    controls.enableDamping = true;
    controls.dampingFactor = 0.06;

    controls.target.set(
        0,
        1.1,
        0
    );

    controls.minDistance = 3.5;
    controls.maxDistance = 12;

    controls.maxPolarAngle = Math.PI / 2.05;
    controls.minPolarAngle = 0.35;

    controls.enablePan = false;

    // --------------------------------------------------------
    // LUMIÈRE
    // --------------------------------------------------------

    createLighting();

    // --------------------------------------------------------
    // GARAGE
    // --------------------------------------------------------

    createGarage();

    // --------------------------------------------------------
    // VOITURE
    // --------------------------------------------------------

    loadGolf();

    // --------------------------------------------------------
    // EVENEMENTS
    // --------------------------------------------------------

    setupUI();

    window.addEventListener(
        "resize",
        onWindowResize
    );
}

// ============================================================
// ÉCLAIRAGE
// ============================================================

function createLighting() {

    // Lumière générale
    const ambientLight = new THREE.AmbientLight(
        0xffffff,
        1.5
    );

    scene.add(ambientLight);

    // Lumière principale
    const mainLight = new THREE.DirectionalLight(
        0xffffff,
        3
    );

    mainLight.position.set(
        4,
        8,
        5
    );

    mainLight.castShadow = true;

    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;

    mainLight.shadow.camera.near = 0.1;
    mainLight.shadow.camera.far = 30;

    mainLight.shadow.camera.left = -10;
    mainLight.shadow.camera.right = 10;
    mainLight.shadow.camera.top = 10;
    mainLight.shadow.camera.bottom = -10;

    scene.add(mainLight);

    // Lumière arrière
    const backLight = new THREE.PointLight(
        0x6b8cff,
        18,
        15
    );

    backLight.position.set(
        -5,
        4,
        -5
    );

    scene.add(backLight);

    garageLights.push(backLight);

    // Lumières latérales
    const leftLight = new THREE.PointLight(
        0xffffff,
        10,
        12
    );

    leftLight.position.set(
        -6,
        4,
        2
    );

    scene.add(leftLight);

    garageLights.push(leftLight);

    const rightLight = new THREE.PointLight(
        0xffffff,
        10,
        12
    );

    rightLight.position.set(
        6,
        4,
        2
    );

    scene.add(rightLight);

    garageLights.push(rightLight);
}

// ============================================================
// GARAGE
// ============================================================

function createGarage() {

    // --------------------------------------------------------
    // SOL
    // --------------------------------------------------------

    const floorGeometry =
        new THREE.PlaneGeometry(
            30,
            30
        );

    const floorMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x111318,
            roughness: 0.35,
            metalness: 0.7
        });

    const floor =
        new THREE.Mesh(
            floorGeometry,
            floorMaterial
        );

    floor.rotation.x = -Math.PI / 2;

    floor.receiveShadow = true;

    scene.add(floor);

    // --------------------------------------------------------
    // MUR ARRIÈRE
    // --------------------------------------------------------

    const wallMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x090b0f,
            roughness: 0.8,
            metalness: 0.15
        });

    const backWall =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                30,
                10,
                0.5
            ),
            wallMaterial
        );

    backWall.position.set(
        0,
        5,
        -8
    );

    backWall.receiveShadow = true;

    scene.add(backWall);

    // --------------------------------------------------------
    // MUR GAUCHE
    // --------------------------------------------------------

    const leftWall =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.5,
                10,
                16
            ),
            wallMaterial
        );

    leftWall.position.set(
        -15,
        5,
        0
    );

    scene.add(leftWall);

    // --------------------------------------------------------
    // MUR DROIT
    // --------------------------------------------------------

    const rightWall =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.5,
                10,
                16
            ),
            wallMaterial
        );

    rightWall.position.set(
        15,
        5,
        0
    );

    scene.add(rightWall);

    // --------------------------------------------------------
    // PLATEFORME
    // --------------------------------------------------------

    const platformGeometry =
        new THREE.CylinderGeometry(
            4,
            4,
            0.25,
            64
        );

    const platformMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x181b21,
            roughness: 0.3,
            metalness: 0.8
        });

    const platform =
        new THREE.Mesh(
            platformGeometry,
            platformMaterial
        );

    platform.position.y = 0.13;

    platform.receiveShadow = true;
    platform.castShadow = true;

    scene.add(platform);

    // --------------------------------------------------------
    // ANNEAU LUMINEUX
    // --------------------------------------------------------

    const ringGeometry =
        new THREE.RingGeometry(
            3.5,
            3.7,
            64
        );

    const ringMaterial =
        new THREE.MeshBasicMaterial({
            color: 0x3b82ff,
            side: THREE.DoubleSide
        });

    const ring =
        new THREE.Mesh(
            ringGeometry,
            ringMaterial
        );

    ring.rotation.x = -Math.PI / 2;

    ring.position.y = 0.27;

    scene.add(ring);

    // --------------------------------------------------------
    // BANDES LUMINEUSES MURALES
    // --------------------------------------------------------

    createLightStrip(
        -6,
        3.5,
        -7.7,
        0x3b82ff
    );

    createLightStrip(
        0,
        3.5,
        -7.7,
        0xffffff
    );

    createLightStrip(
        6,
        3.5,
        -7.7,
        0x3b82ff
    );

    // --------------------------------------------------------
    // PANNEAUX DÉCORATIFS
    // --------------------------------------------------------

    createGaragePanel(
        -7,
        2.5,
        -7.65
    );

    createGaragePanel(
        7,
        2.5,
        -7.65
    );

    // --------------------------------------------------------
    // LOGO ZENTRO
    // --------------------------------------------------------

    createZentroLogo();
}

// ============================================================
// BANDES LUMINEUSES
// ============================================================

function createLightStrip(
    x,
    y,
    z,
    color
) {

    const geometry =
        new THREE.BoxGeometry(
            4,
            0.08,
            0.08
        );

    const material =
        new THREE.MeshBasicMaterial({
            color: color
        });

    const strip =
        new THREE.Mesh(
            geometry,
            material
        );

    strip.position.set(
        x,
        y,
        z
    );

    scene.add(strip);
}

// ============================================================
// PANNEAUX
// ============================================================

function createGaragePanel(
    x,
    y,
    z
) {

    const geometry =
        new THREE.BoxGeometry(
            3,
            4,
            0.12
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0x101319,
            metalness: 0.6,
            roughness: 0.4
        });

    const panel =
        new THREE.Mesh(
            geometry,
            material
        );

    panel.position.set(
        x,
        y,
        z
    );

    scene.add(panel);

    // lignes décoratives
    for (
        let i = -1;
        i <= 1;
        i++
    ) {

        const line =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    2.3,
                    0.025,
                    0.02
                ),
                new THREE.MeshBasicMaterial({
                    color: 0x303640
                })
            );

        line.position.set(
            x,
            y + i * 0.7,
            z - 0.08
        );

        scene.add(line);
    }
}

// ============================================================
// LOGO ZENTRO
// ============================================================

function createZentroLogo() {

    const canvas =
        document.createElement("canvas");

    canvas.width = 1024;
    canvas.height = 256;

    const ctx =
        canvas.getContext("2d");

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.font =
        "bold 150px Arial";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "#ffffff";

    ctx.fillText(
        "ZENTRO",
        512,
        128
    );

    const texture =
        new THREE.CanvasTexture(
            canvas
        );

    texture.colorSpace =
        THREE.SRGBColorSpace;

    const material =
        new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        });

    const logo =
        new THREE.Mesh(
            new THREE.PlaneGeometry(
                6,
                1.5
            ),
            material
        );

    logo.position.set(
        0,
        6,
        -7.65
    );

    scene.add(logo);
}

// ============================================================
// CHARGEMENT DE LA GOLF
// ============================================================

function loadGolf() {

    const loader =
        new GLTFLoader();

    console.log(
        "ZENTRO : chargement de",
        CAR_MODEL_PATH
    );

    loader.load(

        CAR_MODEL_PATH,

        function(gltf) {

            console.log(
                "ZENTRO : Golf chargée avec succès !",
                gltf
            );

            car = gltf.scene;

            // ------------------------------------------------
            // POSITION
            // ------------------------------------------------

            car.position.set(
                0,
                0.35,
                0
            );

            // ------------------------------------------------
            // TAILLE
            // ------------------------------------------------

            const box =
                new THREE.Box3().setFromObject(
                    car
                );

            const size =
                new THREE.Vector3();

            box.getSize(size);

            console.log(
                "Dimensions du modèle :",
                size
            );

            // Taille cible approximative
            const targetLength = 4.5;

            const currentLength =
                Math.max(
                    size.x,
                    size.z
                );

            if (
                currentLength > 0
            ) {

                const scale =
                    targetLength /
                    currentLength;

                car.scale.setScalar(
                    scale
                );
            }

            // ------------------------------------------------
            // RECALCUL DE LA POSITION
            // ------------------------------------------------

            const newBox =
                new THREE.Box3().setFromObject(
                    car
                );

            const center =
                new THREE.Vector3();

            newBox.getCenter(center);

            car.position.x -= center.x;
            car.position.z -= center.z;

            // placer les roues au niveau du sol
            const finalBox =
                new THREE.Box3().setFromObject(
                    car
                );

            car.position.y -=
                finalBox.min.y;

            car.position.y += 0.35;

            // ------------------------------------------------
            // MATÉRIAUX
            // ------------------------------------------------

            car.traverse(
                function(object) {

                    if (
                        object.isMesh
                    ) {

                        object.castShadow = true;
                        object.receiveShadow = true;

                        if (
                            object.material
                        ) {

                            // gérer plusieurs matériaux
                            if (
                                Array.isArray(
                                    object.material
                                )
                            ) {

                                object.material =
                                    object.material.map(
                                        material =>
                                            prepareMaterial(
                                                material
                                            )
                                    );

                            } else {

                                object.material =
                                    prepareMaterial(
                                        object.material
                                    );
                            }
                        }
                    }
                }
            );

            // ------------------------------------------------
            // AJOUT À LA SCÈNE
            // ------------------------------------------------

            scene.add(car);

            // ------------------------------------------------
            // RÉCUPÉRATION DES MATÉRIAUX DE CARROSSERIE
            // ------------------------------------------------

            collectCarMaterials();

            // ------------------------------------------------
            // MASQUER CHARGEMENT
            // ------------------------------------------------

            hideLoading();

            showNotification(
                "GOLF R CHARGÉE 🚗"
            );

            // ------------------------------------------------
            // POSITION CAMÉRA
            // ------------------------------------------------

            controls.target.set(
                0,
                1,
                0
            );

            camera.position.set(
                5.8,
                3,
                6.5
            );

        },

        function(progress) {

            if (
                progress.total > 0
            ) {

                const percent =
                    Math.round(
                        (
                            progress.loaded /
                            progress.total
                        ) * 100
                    );

                console.log(
                    "Golf :",
                    percent + "%"
                );
            }
        },

        function(error) {

            console.error(
                "Impossible de charger GolfR.glb",
                error
            );

            console.warn(
                "ZENTRO utilise le modèle temporaire."
            );

            createTemporaryGolf();

            hideLoading();

            showNotification(
                "Modèle temporaire chargé"
            );
        }
    );
}

// ============================================================
// PRÉPARATION DES MATÉRIAUX
// ============================================================

function prepareMaterial(material) {

    if (
        material &&
        material.isMeshStandardMaterial
    ) {

        material.metalness =
            Math.max(
                material.metalness,
                0.25
            );

        material.roughness =
            Math.min(
                material.roughness,
                0.55
            );
    }

    return material;
}

// ============================================================
// RÉCUPÉRER LES MATÉRIAUX DE CARROSSERIE
// ============================================================

function collectCarMaterials() {

    carBodyMaterials = [];

    if (!car) {
        return;
    }

    car.traverse(
        function(object) {

            if (
                !object.isMesh ||
                !object.material
            ) {
                return;
            }

            const materials =
                Array.isArray(
                    object.material
                )
                    ? object.material
                    : [object.material];

            materials.forEach(
                function(material) {

                    if (
                        !material.color
                    ) {
                        return;
                    }

                    const name =
                        (
                            object.name +
                            " " +
                            material.name
                        ).toLowerCase();

                    // éviter les roues / vitres / pneus
                    const forbidden =
                        [
                            "wheel",
                            "tire",
                            "tyre",
                            "glass",
                            "window",
                            "brake",
                            "disc",
                            "light",
                            "lamp"
                        ];

                    const isForbidden =
                        forbidden.some(
                            word =>
                                name.includes(
                                    word
                                )
                        );

                    if (
                        !isForbidden
                    ) {

                        carBodyMaterials.push(
                            material
                        );
                    }
                }
            );
        }
    );

    // éviter les doublons
    carBodyMaterials =
        [...new Set(
            carBodyMaterials
        )];

    console.log(
        "Matériaux carrosserie :",
        carBodyMaterials.length
    );

    applyCarColor(
        targetCarColor
    );
}

// ============================================================
// CHANGER LA COULEUR DE LA CARROSSERIE
// ============================================================

function applyCarColor(color) {

    targetCarColor = color;

    if (
        carBodyMaterials.length === 0
    ) {
        return;
    }

    carBodyMaterials.forEach(
        function(material) {

            if (
                material.color
            ) {

                material.color.setHex(
                    color
                );

                material.metalness = 0.65;
                material.roughness = 0.2;
            }
        }
    );
}

// ============================================================
// MODÈLE TEMPORAIRE
// ============================================================

function createTemporaryGolf() {

    car =
        new THREE.Group();

    car.position.y = 0.35;

    // --------------------------------------------------------
    // CARROSSERIE
    // --------------------------------------------------------

    const bodyMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x050505,
            metalness: 0.7,
            roughness: 0.2
        });

    const body =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                4.2,
                0.8,
                1.8
            ),
            bodyMaterial
        );

    body.position.y = 0.85;

    body.castShadow = true;

    car.add(body);

    carBodyMaterials.push(
        bodyMaterial
    );

    // --------------------------------------------------------
    // TOIT
    // --------------------------------------------------------

    const roof =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.5,
                0.65,
                1.55
            ),
            bodyMaterial
        );

    roof.position.set(
        -0.15,
        1.45,
        0
    );

    roof.castShadow = true;

    car.add(roof);

    // --------------------------------------------------------
    // VITRES
    // --------------------------------------------------------

    const glassMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x080d14,
            metalness: 0.2,
            roughness: 0.05,
            transparent: true,
            opacity: 0.72
        });

    const windshield =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.1,
                0.5,
                1.58
            ),
            glassMaterial
        );

    windshield.position.set(
        0.7,
        1.46,
        0
    );

    windshield.rotation.z =
        -0.18;

    car.add(windshield);

    // --------------------------------------------------------
    // ROUES
    // --------------------------------------------------------

    const wheelMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x090909,
            metalness: 0.85,
            roughness: 0.2
        });

    const tireMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x020202,
            roughness: 0.9
        });

    const wheelPositions = [
        [-1.45, 0.55, 0.92],
        [-1.45, 0.55, -0.92],
        [1.45, 0.55, 0.92],
        [1.45, 0.55, -0.92]
    ];

    wheelPositions.forEach(
        function(position) {

            const tire =
                new THREE.Mesh(
                    new THREE.CylinderGeometry(
                        0.42,
                        0.42,
                        0.28,
                        32
                    ),
                    tireMaterial
                );

            tire.rotation.x =
                Math.PI / 2;

            tire.position.set(
                position[0],
                position[1],
                position[2]
            );

            tire.castShadow = true;

            car.add(tire);

            const rim =
                new THREE.Mesh(
                    new THREE.CylinderGeometry(
                        0.24,
                        0.24,
                        0.3,
                        24
                    ),
                    wheelMaterial
                );

            rim.rotation.x =
                Math.PI / 2;

            rim.position.set(
                position[0],
                position[1],
                position[2]
            );

            car.add(rim);
        }
    );

    // --------------------------------------------------------
    // PHARES
    // --------------------------------------------------------

    const headlightMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        });

    const headlightGeometry =
        new THREE.BoxGeometry(
            0.25,
            0.18,
            0.65
        );

    const leftHeadlight =
        new THREE.Mesh(
            headlightGeometry,
            headlightMaterial
        );

    leftHeadlight.position.set(
        2.08,
        0.95,
        0.55
    );

    car.add(leftHeadlight);

    const rightHeadlight =
        leftHeadlight.clone();

    rightHeadlight.position.z =
        -0.55;

    car.add(rightHeadlight);

    // --------------------------------------------------------
    // ÉCHAPPEMENTS
    // --------------------------------------------------------

    const exhaustMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x303030,
            metalness: 0.95,
            roughness: 0.15
        });

    for (
        let i = -1;
        i <= 1;
        i += 2
    ) {

        for (
            let j = -1;
            j <= 1;
            j += 2
        ) {

            const exhaust =
                new THREE.Mesh(
                    new THREE.CylinderGeometry(
                        0.09,
                        0.09,
                        0.25,
                        16
                    ),
                    exhaustMaterial
                );

            exhaust.rotation.z =
                Math.PI / 2;

            exhaust.position.set(
                -2.18,
                0.65,
                i * 0.28 + j * 0.08
            );

            car.add(exhaust);
        }
    }

    scene.add(car);
}

// ============================================================
// INTERFACE
// ============================================================

function setupUI() {

    // --------------------------------------------------------
    // BOUTON PRENDRE LE VOLANT
    // --------------------------------------------------------

    const driveButton =
        findElementByText(
            [
                "PRENDRE LE VOLANT",
                "PRENDRE LE VOLANT 🚗"
            ]
        );

    if (driveButton) {

        driveButton.addEventListener(
            "click",
            function() {

                showNotification(
                    "Mode conduite bientôt disponible 🚗💨"
                );

                camera.position.set(
                    4.5,
                    2.2,
                    5.5
                );
            }
        );
    }

    // --------------------------------------------------------
    // BOUTON PERSONNALISER
    // --------------------------------------------------------

    const customizeButton =
        findElementByText(
            [
                "PERSONNALISER",
                "PERSONNALISER 🎨"
            ]
        );

    if (customizeButton) {

        customizeButton.addEventListener(
            "click",
            function() {

                openCustomization();
            }
        );
    }

    // --------------------------------------------------------
    // BOUTONS DE COULEUR
    // --------------------------------------------------------

    setupColorButtons();

    // --------------------------------------------------------
    // ESC
    // --------------------------------------------------------

    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Escape"
            ) {

                closeCustomization();
            }
        }
    );
}

// ============================================================
// TROUVER UN ÉLÉMENT PAR SON TEXTE
// ============================================================

function findElementByText(
    texts
) {

    const elements =
        document.querySelectorAll(
            "button, a"
        );

    for (
        const element of elements
    ) {

        const text =
            element.textContent
                .trim()
                .toUpperCase();

        for (
            const wanted of texts
        ) {

            if (
                text.includes(
                    wanted.toUpperCase()
                )
            ) {

                return element;
            }
        }
    }

    return null;
}

// ============================================================
// BOUTONS COULEURS
// ============================================================

function setupColorButtons() {

    const selectors = [
        "[data-color]",
        "[data-car-color]",
        ".color-option",
        ".color-btn"
    ];

    let buttons = [];

    selectors.forEach(
        function(selector) {

            document
                .querySelectorAll(selector)
                .forEach(
                    element =>
                        buttons.push(element)
                );
        }
    );

    buttons =
        [...new Set(buttons)];

    buttons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    let color =
                        button.dataset.color ||
                        button.dataset.carColor;

                    if (
                        !color
                    ) {
                        return;
                    }

                    if (
                        typeof color === "string"
                    ) {

                        color =
                            color.replace(
                                "#",
                                ""
                            );
                    }

                    const numericColor =
                        parseInt(
                            color,
                            16
                        );

                    if (
                        !Number.isNaN(
                            numericColor
                        )
                    ) {

                        applyCarColor(
                            numericColor
                        );

                        showNotification(
                            "Couleur modifiée ✨"
                        );
                    }
                }
            );
        }
    );
}

// ============================================================
// OUVRIR PERSONNALISATION
// ============================================================

function openCustomization() {

    if (
        !customizationPanel
    ) {
        return;
    }

    customizationPanel.classList.add(
        "active"
    );

    customizationPanel.style.display =
        "block";
}

// ============================================================
// FERMER PERSONNALISATION
// ============================================================

function closeCustomization() {

    if (
        !customizationPanel
    ) {
        return;
    }

    customizationPanel.classList.remove(
        "active"
    );

    customizationPanel.style.display =
        "";
}

// ============================================================
// NOTIFICATION
// ============================================================

function showNotification(
    message
) {

    if (
        !notification
    ) {

        console.log(
            "ZENTRO:",
            message
        );

        return;
    }

    notification.textContent =
        message;

    notification.classList.add(
        "show"
    );

    clearTimeout(
        notification._timeout
    );

    notification._timeout =
        setTimeout(
            function() {

                notification.classList.remove(
                    "show"
                );

            },
            2500
        );
}

// ============================================================
// ÉCRAN DE CHARGEMENT
// ============================================================

function hideLoading() {

    if (
        !loadingScreen
    ) {
        return;
    }

    loadingScreen.classList.add(
        "hidden"
    );

    setTimeout(
        function() {

            loadingScreen.style.display =
                "none";

        },
        600
    );
}

// ============================================================
// RESIZE
// ============================================================

function onWindowResize() {

    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );
}

// ============================================================
// ANIMATION
// ============================================================

function animate() {

    requestAnimationFrame(
        animate
    );

    const elapsed =
        clock.getElapsedTime();

    // rotation très légère de la plateforme lumineuse
    // pour donner de la vie au garage
    scene.traverse(
        function(object) {

            if (
                object.userData &&
                object.userData.rotateGarage
            ) {

                object.rotation.y =
                    elapsed * 0.2;
            }
        }
    );

    controls.update();

    renderer.render(
        scene,
        camera
    );
}

// ============================================================
// FIN
// ============================================================

console.log(
    "===================================="
);

console.log(
    "        ZENTRO GARAGE"
);

console.log(
    "        Three.js chargé"
);

console.log(
    "        Modèle : " +
    CAR_MODEL_PATH
);

console.log(
    "===================================="
);
