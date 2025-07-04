// Módulo para visualización 3D de la orientación del CubeSat
const Orientation3D = (function() {
    let scene, camera, renderer, cubesat;
    let isInitialized = false;
    let animationId;
    let isPlaying = false;
    let currentTimeIndex = 0;
    let playbackSpeed = 5;
    let quaternionData = [];
    let gyroData = [];
    
    // Inicializar la escena 3D
    function init() {
        console.log('Orientation3D.init() llamado');
        
        if (isInitialized) {
            console.log('Ya está inicializado, saltando...');
            return;
        }
        
        const container = document.getElementById('cubesat3d');
        if (!container) {
            console.error('Container cubesat3d no encontrado');
            return;
        }
        console.log('Container 3D encontrado:', container);
        
        // Verificar que Three.js esté disponible
        if (typeof THREE === 'undefined') {
            console.error('THREE.js no está disponible');
            return;
        }
        console.log('THREE.js disponible');
        
        // Verificar que OrbitControls esté disponible
        if (typeof OrbitControls === 'undefined') {
            console.error('OrbitControls no está disponible');
        } else {
            console.log('OrbitControls disponible');
        }
        
        // Crear escena
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0f0f23);
        
        // Crear cámara
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(3, 3, 3);
        camera.lookAt(0, 0, 0);
        
        // Crear renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);
        
        // Crear controles de cámara
        if (typeof OrbitControls !== 'undefined') {
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.1;
        }
        
        // Crear luces
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);
        
        // Crear el CubeSat
        createCubeSat();
        
        // Crear ejes de referencia
        const axesHelper = new THREE.AxesHelper(2);
        scene.add(axesHelper);
        
        // Crear grilla de referencia
        const gridHelper = new THREE.GridHelper(10, 10, 0x555555, 0x333333);
        scene.add(gridHelper);
        
        // Generar datos de cuaterniones a partir de los datos del giroscopio
        generateQuaternionData();
        console.log('Datos de cuaterniones generados');
        
        // Configurar event listeners
        setupEventListeners();
        console.log('Event listeners configurados');
        
        // Iniciar bucle de renderizado
        animate();
        console.log('Bucle de animación iniciado');
        
        isInitialized = true;
        console.log('Orientación 3D inicializada completamente');
    }
    
    // Crear el modelo 3D del CubeSat
    function createCubeSat() {
        const group = new THREE.Group();
        
        // Cuerpo principal del CubeSat (cubo)
        const bodyGeometry = new THREE.BoxGeometry(1, 1, 1);
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x2c3e50,
            shininess: 100
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        group.add(body);
        
        // Paneles solares
        const panelGeometry = new THREE.BoxGeometry(2.5, 0.05, 0.8);
        const panelMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x1a1a2e,
            shininess: 200
        });
        
        const panel1 = new THREE.Mesh(panelGeometry, panelMaterial);
        panel1.position.set(0, 0, 0.9);
        panel1.castShadow = true;
        group.add(panel1);
        
        const panel2 = new THREE.Mesh(panelGeometry, panelMaterial);
        panel2.position.set(0, 0, -0.9);
        panel2.castShadow = true;
        group.add(panel2);
        
        // Antena
        const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1);
        const antennaMaterial = new THREE.MeshPhongMaterial({ color: 0xe74c3c });
        const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
        antenna.position.set(0, 1, 0);
        antenna.castShadow = true;
        group.add(antenna);
        
        // Marcadores de orientación (para identificar ejes)
        const markerGeometry = new THREE.SphereGeometry(0.1);
        
        // Marcador X (rojo)
        const markerX = new THREE.Mesh(markerGeometry, new THREE.MeshPhongMaterial({ color: 0xff0000 }));
        markerX.position.set(0.6, 0, 0);
        group.add(markerX);
        
        // Marcador Y (verde)
        const markerY = new THREE.Mesh(markerGeometry, new THREE.MeshPhongMaterial({ color: 0x00ff00 }));
        markerY.position.set(0, 0.6, 0);
        group.add(markerY);
        
        // Marcador Z (azul)
        const markerZ = new THREE.Mesh(markerGeometry, new THREE.MeshPhongMaterial({ color: 0x0000ff }));
        markerZ.position.set(0, 0, 0.6);
        group.add(markerZ);
        
        cubesat = group;
        scene.add(cubesat);
    }
    
    // Generar datos de cuaterniones a partir del giroscopio
    function generateQuaternionData() {
        const gyroDataRaw = DataGenerator.getGyroscopeData();
        const timeData = DataGenerator.getTimeData();
        const totalPoints = DataGenerator.getTotalPoints();
        
        quaternionData = [];
        gyroData = [];
        
        // Cuaternión inicial (sin rotación)
        let q = new THREE.Quaternion(0, 0, 0, 1);
        
        for (let i = 0; i < totalPoints; i++) {
            // Simular velocidades angulares en los tres ejes
            const wx = gyroDataRaw[i] + (Math.random() - 0.5) * 0.5; // Roll
            const wy = (Math.random() - 0.5) * 0.3; // Pitch
            const wz = (Math.random() - 0.5) * 0.2; // Yaw
            
            gyroData.push({ wx, wy, wz });
            
            // Integrar velocidades angulares para obtener orientación
            // Δt = 0.2 segundos (5 Hz)
            const dt = 0.2;
            
            // Crear cuaternión de rotación incremental
            const angle = Math.sqrt(wx*wx + wy*wy + wz*wz) * dt;
            if (angle > 0) {
                const axis = new THREE.Vector3(wx, wy, wz).normalize();
                const deltaQ = new THREE.Quaternion().setFromAxisAngle(axis, angle);
                q.multiply(deltaQ);
            }
            
            quaternionData.push({
                time: timeData[i],
                quaternion: q.clone(),
                gyro: { wx, wy, wz }
            });
        }
    }
    
    // Configurar event listeners para los controles
    function setupEventListeners() {
        console.log('Configurando event listeners...');
        
        const timeSlider = document.getElementById('timeSlider');
        const playButton = document.getElementById('playButton');
        const pauseButton = document.getElementById('pauseButton');
        const resetButton = document.getElementById('resetButton');
        const speedSlider = document.getElementById('speedSlider');
        
        console.log('Elementos encontrados:', {
            timeSlider: !!timeSlider,
            playButton: !!playButton,
            pauseButton: !!pauseButton,
            resetButton: !!resetButton,
            speedSlider: !!speedSlider
        });
        
        if (timeSlider) {
            timeSlider.max = quaternionData.length - 1;
            timeSlider.addEventListener('input', (e) => {
                currentTimeIndex = parseInt(e.target.value);
                updateVisualization();
            });
        }
        
        if (playButton) {
            playButton.addEventListener('click', () => {
                console.log('Play button clicked, starting animation');
                isPlaying = true;
                playAnimation();
            });
            console.log('PlayButton listener añadido');
        } else {
            console.error('PlayButton no encontrado');
        }
        
        if (pauseButton) {
            pauseButton.addEventListener('click', () => {
                isPlaying = false;
            });
        }
        
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                isPlaying = false;
                currentTimeIndex = 0;
                updateVisualization();
            });
        }
        
        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                playbackSpeed = parseInt(e.target.value);
                document.getElementById('speedDisplay').textContent = playbackSpeed + 'x';
            });
        }
    }
    
    // Reproducir animación
    function playAnimation() {
        console.log('playAnimation called, isPlaying:', isPlaying, 'currentTimeIndex:', currentTimeIndex);
        
        if (!isPlaying) {
            console.log('Animation stopped');
            return;
        }
        
        currentTimeIndex += playbackSpeed;
        if (currentTimeIndex >= quaternionData.length) {
            currentTimeIndex = quaternionData.length - 1;
            isPlaying = false;
            console.log('Animation reached end');
        }
        
        updateVisualization();
        
        if (isPlaying) {
            setTimeout(playAnimation, 50); // 20 FPS
        }
    }
    
    // Actualizar visualización con datos actuales
    function updateVisualization() {
        if (!cubesat || !quaternionData[currentTimeIndex]) return;
        
        const data = quaternionData[currentTimeIndex];
        
        // Aplicar rotación al CubeSat
        cubesat.setRotationFromQuaternion(data.quaternion);
        
        // Actualizar controles
        const timeSlider = document.getElementById('timeSlider');
        if (timeSlider) timeSlider.value = currentTimeIndex;
        
        // Actualizar displays de información
        updateDisplays(data);
    }
    
    // Actualizar displays de información
    function updateDisplays(data) {
        const currentIndex = currentTimeIndex;
        
        // Display de tiempo
        const timeDisplay = document.getElementById('timeDisplay');
        const missionTimeDisplay = document.getElementById('missionTimeDisplay');
        if (timeDisplay && missionTimeDisplay) {
            timeDisplay.textContent = data.time;
            missionTimeDisplay.textContent = data.time;
        }
        
        // Display de cuaternión
        const quaternionDisplay = document.getElementById('quaternionDisplay');
        if (quaternionDisplay) {
            const q = data.quaternion;
            quaternionDisplay.textContent = `q: (${q.x.toFixed(3)}, ${q.y.toFixed(3)}, ${q.z.toFixed(3)}, ${q.w.toFixed(3)})`;
        }
        
        // Display de ángulos de Euler
        const eulerDisplay = document.getElementById('eulerDisplay');
        if (eulerDisplay) {
            const euler = new THREE.Euler().setFromQuaternion(data.quaternion, 'XYZ');
            const roll = (euler.x * 180 / Math.PI).toFixed(1);
            const pitch = (euler.y * 180 / Math.PI).toFixed(1);
            const yaw = (euler.z * 180 / Math.PI).toFixed(1);
            eulerDisplay.textContent = `Roll: ${roll}°, Pitch: ${pitch}°, Yaw: ${yaw}°`;
        }
        
        // Display de velocidad angular
        const angularVelocityDisplay = document.getElementById('angularVelocityDisplay');
        if (angularVelocityDisplay) {
            const gyro = data.gyro;
            angularVelocityDisplay.textContent = `ωx: ${gyro.wx.toFixed(2)}°/s, ωy: ${gyro.wy.toFixed(2)}°/s, ωz: ${gyro.wz.toFixed(2)}°/s`;
        }
        
        // Actualizar datos de telemetría en tiempo real
        updateTelemetryDisplays(currentIndex);
    }
    
    // Actualizar displays de telemetría en tiempo real
    function updateTelemetryDisplays(index) {
        // Obtener datos de todos los sensores para el índice actual
        const tempcubesatData = DataGenerator.getTempcubesatData();
        const temp1Data = DataGenerator.getTemperatureData();
        const temp2Data = DataGenerator.getTemp2Data();
        const temp3Data = DataGenerator.getTemp3Data();
        const accelData = DataGenerator.getAccelerationData();
        const pressureData = DataGenerator.getPressureData();
        
        // Actualizar temperaturas
        const tempcubesatDisplay = document.getElementById('tempcubesatDisplay');
        if (tempcubesatDisplay && tempcubesatData[index] !== undefined) {
            tempcubesatDisplay.textContent = `${tempcubesatData[index].toFixed(1)}°C`;
        }
        
        const tempMuestra1Display = document.getElementById('tempMuestra1Display');
        if (tempMuestra1Display && temp1Data[index] !== undefined) {
            tempMuestra1Display.textContent = `${temp1Data[index].toFixed(1)}°C`;
        }
        
        const tempMuestra2Display = document.getElementById('tempMuestra2Display');
        if (tempMuestra2Display && temp2Data[index] !== undefined) {
            tempMuestra2Display.textContent = `${temp2Data[index].toFixed(1)}°C`;
        }
        
        const tempMuestra3Display = document.getElementById('tempMuestra3Display');
        if (tempMuestra3Display && temp3Data[index] !== undefined) {
            tempMuestra3Display.textContent = `${temp3Data[index].toFixed(1)}°C`;
        }
        
        // Actualizar aceleración
        const accelerationDisplay = document.getElementById('accelerationDisplay');
        if (accelerationDisplay && accelData[index] !== undefined) {
            accelerationDisplay.textContent = `${(accelData[index] * 1000).toFixed(1)}mG`;
        }
        
        // Actualizar presión
        const pressureDisplay = document.getElementById('pressureDisplay');
        if (pressureDisplay && pressureData[index] !== undefined) {
            pressureDisplay.textContent = `${pressureData[index].toFixed(2)}kPa`;
        }
        
        // Actualizar estado de la misión
        const missionStatusDisplay = document.getElementById('missionStatusDisplay');
        if (missionStatusDisplay) {
            const progress = index / quaternionData.length;
            let status = 'Nominal';
            let statusClass = 'status-nominal';
            
            if (progress > 0.8) {
                status = 'Fase Final';
                statusClass = 'status-warning';
            } else if (progress > 0.5) {
                status = 'Descenso';
                statusClass = 'status-warning';
            }
            
            missionStatusDisplay.textContent = status;
            missionStatusDisplay.className = `value ${statusClass}`;
        }
    }
    
    // Bucle de animación principal
    function animate() {
        animationId = requestAnimationFrame(animate);
        
        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    }
    
    // Redimensionar cuando cambie el tamaño de la ventana
    function onWindowResize() {
        const container = document.getElementById('cubesat3d');
        if (!container || !camera || !renderer) return;
        
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    // API pública del módulo
    return {
        init: init,
        onWindowResize: onWindowResize
    };
})();

// Configurar redimensionamiento
window.addEventListener('resize', Orientation3D.onWindowResize);
