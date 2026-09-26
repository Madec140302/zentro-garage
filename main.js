import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";


/* =========================================================
   SCÈNE
========================================================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x07090c);

scene.fog = new THREE.Fog(
    0x07090c,
    25,
    90
);


/* =========================================================
   CAMÉRA
========================================================= */

const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    200
);

camera.position.set(
    10,
    5,
    12
);


/* =========================================================
   RENDERER
========================================================= */

const renderer =
    new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance"
    });

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        1.5
    )
);

renderer.shadowMap.enabled = true;

renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

renderer.toneMapping =
    THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure = 1.15;

document.body.appendChild(
    renderer.domElement
);


/* =========================================================
   CONTRÔLES CAMÉRA
========================================================= */

const controls =
    new OrbitControls(
        camera,
        renderer.domElement
    );

controls.enableDamping = true;

controls.dampingFactor = 0.06;

controls.minDistance = 5;

controls.maxDistance = 25;

controls.maxPolarAngle =
    Math.PI * 0.47;

controls.target.set(
    0,
    1,
    0
);


/* =========================================================
   LUMIÈRES
========================================================= */

const hemisphere =
    new THREE.HemisphereLight(
        0xffffff,
        0x10131a,
        2
    );

scene.add(hemisphere);


const mainLight =
    new THREE.DirectionalLight(
        0xffffff,
        3
    );

mainLight.position.set(
    5,
    12,
    7
);

mainLight.castShadow = true;

mainLight.shadow.mapSize.width = 2048;

mainLight.shadow.mapSize.height = 2048;

scene.add(mainLight);


/* Lumières du garage */

function addGarageLight(
    x,
    y,
    z
) {

    const light =
        new THREE.PointLight(
            0xffffff,
            18,
            16
        );

    light.position.set(
        x,
        y,
        z
    );

    scene.add(light);


    const lamp =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                3,
                0.04,
                0.12
            ),
            new THREE.MeshBasicMaterial({
                color: 0xffffff
            })
        );

    lamp.position.set(
        x,
        y,
        z
    );

    scene.add(lamp);
}

addGarageLight(-7, 7, -5);
addGarageLight(0, 7, -5);
addGarageLight(7, 7, -5);

addGarageLight(-7, 7, 4);
addGarageLight(0, 7, 4);
addGarageLight(7, 7, 4);


/* =========================================================
   GARAGE
========================================================= */

const garage =
    new THREE.Group();

scene.add(garage);


/* Sol */

const floor =
    new THREE.Mesh(
        new THREE.PlaneGeometry(
            50,
            50
        ),
        new THREE.MeshStandardMaterial({
            color: 0x15181d,
            roughness: 0.4,
            metalness: 0.35
        })
    );

floor.rotation.x =
    -Math.PI / 2;

floor.receiveShadow = true;

garage.add(floor);


/* Murs */

function createWall(
    x,
    y,
    z,
    width,
    height,
    depth
) {

    const mesh =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                width,
                height,
                depth
            ),
            new THREE.MeshStandardMaterial({
                color: 0x101318,
                roughness: 0.7,
                metalness: 0.2
            })
        );

    mesh.position.set(
        x,
        y,
        z
    );

    mesh.receiveShadow = true;

    garage.add(mesh);
}

createWall(
    -13,
    4,
    0,
    0.5,
    8,
    28
);

createWall(
    13,
    4,
    0,
    0.5,
    8,
    28
);

createWall(
    0,
    4,
    -13,
    26,
    8,
    0.5
);


/* Panneaux muraux */

for (
    let x = -10;
    x <= 10;
    x += 5
) {

    const panel =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                4.5,
                6,
                0.08
            ),
            new THREE.MeshStandardMaterial({
                color: 0x171b21,
                roughness: 0.4,
                metalness: 0.5
            })
        );

    panel.position.set(
        x,
        3.5,
        -12.7
    );

    garage.add(panel);
}


/* =========================================================
   LOGO ZENTRO
========================================================= */

const signCanvas =
    document.createElement("canvas");

signCanvas.width = 1024;

signCanvas.height = 256;

const signContext =
    signCanvas.getContext("2d");

signContext.fillStyle =
    "#0b0d11";

signContext.fillRect(
    0,
    0,
    1024,
    256
);

signContext.fillStyle =
    "#ffffff";

signContext.font =
    "900 120px Arial";

signContext.textAlign =
    "center";

signContext.textBaseline =
    "middle";

signContext.fillText(
    "ZENTRO",
    512,
    128
);

const signTexture =
    new THREE.CanvasTexture(
        signCanvas
    );

const sign =
    new THREE.Mesh(
        new THREE.PlaneGeometry(
            8,
            2
        ),
        new THREE.MeshBasicMaterial({
            map: signTexture
        })
    );

sign.position.set(
    0,
    5.5,
    -12.4
);

garage.add(sign);


/* =========================================================
   PLATEFORME
========================================================= */

const platform =
    new THREE.Mesh(
        new THREE.CylinderGeometry(
            5.5,
            5.5,
            0.2,
            64
        ),
        new THREE.MeshStandardMaterial({
            color: 0x0b0d11,
            metalness: 0.7,
            roughness: 0.25
        })
    );

platform.position.y = 0.12;

platform.receiveShadow = true;

scene.add(platform);


const platformRing =
    new THREE.Mesh(
        new THREE.RingGeometry(
            5,
            5.08,
            64
        ),
        new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide
        })
    );

platformRing.rotation.x =
    -Math.PI / 2;

platformRing.position.y =
    0.23;

scene.add(platformRing);


/* =========================================================
   VOITURE
========================================================= */

let car;

const carGroup =
    new THREE.Group();

scene.add(carGroup);


/* =========================================================
   MODÈLE 3D
========================================================= */

const loader =
    new GLTFLoader();


/*
    Quand tu auras un vrai fichier GLB,
    place-le ici :

    Actifs/Voitures/GolfR.glb
*/

loader.load(
    "Actifs/Voitures/GolfR.glb",

    function (gltf) {

        car = gltf.scene;

        car.scale.set(
            2,
            2,
            2
        );

        car.position.set(
            0,
            0.2,
            0
        );

        car.traverse(
            function (object) {

                if (
                    object.isMesh
                ) {

                    object.castShadow =
                        true;

                    object.receiveShadow =
                        true;

                }

            }
        );

        carGroup.add(
            car
        );

        showNotification(
            "GOLF R 2025 CHARGÉE"
        );

    },

    undefined,

    function () {

        /*
            Si GolfR.glb n'existe pas encore,
            on utilise automatiquement
            notre modèle provisoire.
        */

        createTemporaryGolf();

        showNotification(
            "MODELE 3D PROVISOIRE"
        );

    }
);


/* =========================================================
   MODÈLE PROVISOIRE
========================================================= */

function createTemporaryGolf() {

    car =
        new THREE.Group();

    carGroup.add(
        car
    );


    const bodyMaterial =
        new THREE.MeshPhysicalMaterial({
            color: 0x08090b,
            metalness: 0.82,
            roughness: 0.18,
            clearcoat: 1,
            clearcoatRoughness: 0.08
        });


    /* Carrosserie */

    const body =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                4.4,
                0.85,
                8.4
            ),
            bodyMaterial
        );

    body.position.y =
        1.05;

    body.castShadow = true;

    car.add(body);


    /* Capot */

    const hood =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                4.1,
                0.2,
                2.4
            ),
            bodyMaterial
        );

    hood.position.set(
        0,
        1.5,
        -2.7
    );

    car.add(hood);


    /* Toit */

    const roof =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                3.5,
                0.3,
                3.6
            ),
            new THREE.MeshPhysicalMaterial({
                color: 0x030405,
                metalness: 0.6,
                roughness: 0.1
            })
        );

    roof.position.set(
        0,
        1.85,
        0.3
    );

    car.add(roof);


    /* Vitres */

    const glass =
        new THREE.MeshPhysicalMaterial({
            color: 0x0c1822,
            roughness: 0.08,
            metalness: 0.15,
            transparent: true,
            opacity: 0.75
        });


    const windshield =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                3.3,
                0.08,
                1.5
            ),
            glass
        );

    windshield.position.set(
        0,
        1.95,
        -1
    );

    windshield.rotation.x =
        -0.65;

    car.add(windshield);


    /* Roues */

    createTemporaryWheel(
        -2.25,
        -2.5
    );

    createTemporaryWheel(
        2.25,
        -2.5
    );

    createTemporaryWheel(
        -2.25,
        2.5
    );

    createTemporaryWheel(
        2.25,
        2.5
    );


    /* Phares */

    const headlight =
        new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 8
        });

    createLight(
        -1.3,
        -4.22,
        headlight
    );

    createLight(
        1.3,
        -4.22,
        headlight
    );


    /* Feux arrière */

    const rearLight =
        new THREE.MeshStandardMaterial({
            color: 0x300000,
            emissive: 0xff0000,
            emissiveIntensity: 5
        });

    createLight(
        -1.3,
        4.22,
        rearLight
    );

    createLight(
        1.3,
        4.22,
        rearLight
    );


    /* Spoiler */

    const spoiler =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                3.8,
                0.15,
                0.45
            ),
            bodyMaterial
        );

    spoiler.position.set(
        0,
        2.05,
        3.85
    );

    car.add(spoiler);


    /* 4 sorties d'échappement */

    const exhaustMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x25282d,
            metalness: 0.9,
            roughness: 0.22
        });

    [
        -1.35,
        -0.45,
        0.45,
        1.35
    ].forEach(
        x => {

            const exhaust =
                new THREE.Mesh(
                    new THREE.CylinderGeometry(
                        0.18,
                        0.18,
                        0.3,
                        20
                    ),
                    exhaustMaterial
                );

            exhaust.rotation.x =
                Math.PI / 2;

            exhaust.position.set(
                x,
                0.7,
                4.3
            );

            car.add(exhaust);

        }
    );
}


/* Roue provisoire */

function createTemporaryWheel(
    x,
    z
) {

    const wheel =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.78,
                0.78,
                0.48,
                32
            ),
            new THREE.MeshStandardMaterial({
                color: 0x030303,
                roughness: 0.8
            })
        );

    wheel.rotation.z =
        Math.PI / 2;

    wheel.position.set(
        x,
        0.7,
        z
    );

    wheel.castShadow = true;

    car.add(wheel);


    const rim =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.45,
                0.45,
                0.5,
                24
            ),
            new THREE.MeshStandardMaterial({
                color: 0x17191d,
                metalness: 0.9,
                roughness: 0.2
            })
        );

    rim.rotation.z =
        Math.PI / 2;

    rim.position.set(
        x,
        0.7,
        z
    );

    car.add(rim);
}


/* Phares / feux */

function createLight(
    x,
    z,
    material
) {

    const light =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.2,
                0.18,
                0.06
            ),
            material
        );

    light.position.set(
        x,
        1.25,
        z
    );

    car.add(light);
}


/* =========================================================
   PERSONNALISATION
========================================================= */

function changeCarColor(
    color
) {

    if (!car) {
        return;
    }

    car.traverse(
        object => {

            if (
                object.isMesh &&
                object.material &&
                object.material.color
            ) {

                /*
                    On évite de modifier
                    les vitres et pneus.
                */

                const current =
                    object.material.color;

                if (
                    current.r > 0.01 ||
                    current.g > 0.01 ||
                    current.b > 0.01
                ) {

                    object.material.color.set(
                        color
                    );

                }

            }

        }
    );

    showNotification(
        "CARROSSERIE MODIFIÉE"
    );
}


document
    .querySelectorAll(".color")
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".color"
                        )
                        .forEach(
                            b =>
                                b.classList.remove(
                                    "active"
                                )
                        );

                    button.classList.add(
                        "active"
                    );

                    changeCarColor(
                        button.dataset.color
                    );

                }
            );

        }
    );


/* =========================================================
   MENU PERSONNALISATION
========================================================= */

const customPanel =
    document.getElementById(
        "customPanel"
    );

document
    .getElementById("customButton")
    .addEventListener(
        "click",
        () => {

            customPanel.classList.add(
                "open"
            );

        }
    );


document
    .getElementById("closeCustom")
    .addEventListener(
        "click",
        () => {

            customPanel.classList.remove(
                "open"
            );

        }
    );


/* =========================================================
   CONDUITE
========================================================= */

document
    .getElementById("driveButton")
    .addEventListener(
        "click",
        () => {

            showNotification(
                "MODE CONDUITE — BIENTÔT DISPONIBLE"
            );

            camera.position.set(
                0,
                3,
                11
            );

            controls.target.set(
                0,
                1,
                0
            );

        }
    );


/* =========================================================
   NOTIFICATION
========================================================= */

let notificationTimeout;

function showNotification(
    message
) {

    const notification =
        document.getElementById(
            "notification"
        );

    notification.textContent =
        message;

    notification.classList.add(
        "show"
    );

    clearTimeout(
        notificationTimeout
    );

    notificationTimeout =
        setTimeout(
            () => {

                notification.classList.remove(
                    "show"
                );

            },
            2000
        );
}


/* =========================================================
   ESC
========================================================= */

window.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            customPanel.classList.remove(
                "open"
            );

        }

    }
);


/* =========================================================
   CHARGEMENT
========================================================= */

const loading =
    document.getElementById(
        "loading"
    );

const progress =
    document.getElementById(
        "loading-progress"
    );

const loadingText =
    document.getElementById(
        "loading-text"
    );

let loadingValue = 0;

const loadingInterval =
    setInterval(
        () => {

            loadingValue +=
                Math.random() * 12;

            if (
                loadingValue >= 100
            ) {

                loadingValue = 100;

                clearInterval(
                    loadingInterval
                );

                loadingText.textContent =
                    "GARAGE PRÊT";

                setTimeout(
                    () => {

                        loading.style.opacity =
                            "0";

                        setTimeout(
                            () => {

                                loading.remove();

                            },
                            700
                        );

                    },
                    350
                );

            }

            progress.style.width =
                `${loadingValue}%`;

        },
        100
    );


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);


/* =========================================================
   ANIMATION
========================================================= */

const clock =
    new THREE.Clock();

function animate() {

    requestAnimationFrame(
        animate
    );

    const elapsed =
        clock.getElapsedTime();


    controls.update();


    if (carGroup) {

        carGroup.position.y =
            Math.sin(
                elapsed * 1.2
            ) * 0.012;

    }


    renderer.render(
        scene,
        camera
    );
}

animate();
