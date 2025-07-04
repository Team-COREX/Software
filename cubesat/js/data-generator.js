// Módulo para la generación de datos de telemetría
const DataGenerator = (function() {
    // Constantes para la simulación
    const HOURS = 4;
    const MINUTES_PER_HOUR = 60;
    const SECONDS_PER_MINUTE = 60;
    const READINGS_PER_SECOND = 5; // 5 lecturas por segundo
    
    // Puntos de datos totales (4 horas de datos a 5 lecturas por segundo)
    const totalPoints = HOURS * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * READINGS_PER_SECOND;
    
    // Arrays para almacenar los datos generados
    let timeLabels = [];
    let timeData = [];
    let temperatureData = [];
    let temp2Data = [];
    let temp3Data = [];
    let tempcubesatData = [];
    let accelerationData = [];
    let accelXData = [];
    let accelYData = [];
    let accelZData = [];
    let pressureData = [];
    let voltageData = [];
    let gyroscopeData = [];
    let gyroXData = [];
    let gyroYData = [];
    let gyroZData = [];
    
    // Función para generar etiquetas de tiempo (en formato HH:MM:SS)
    function generateTimeLabels() {
        timeLabels = [];
        timeData = [];
        
        for (let i = 0; i < totalPoints; i++) {
            const totalSeconds = i / READINGS_PER_SECOND;
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = Math.floor(totalSeconds % 60);
            
            // Crear timestamp completo
            const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Solo agregar etiqueta visible cada 60 segundos para no saturar el gráfico
            if (i % (60 * READINGS_PER_SECOND) === 0) {
                timeLabels.push(timeString);
            } else {
                timeLabels.push('');
            }
            
            // Almacenar timestamp completo para los datos CSV
            timeData.push(timeString);
        }
    }
    
    // Función para generar datos de temperatura (rango normal con patrón cíclico)
    function generateTemperatureData() {
        temperatureData = [];
        const baseTemp = 22; // Temperatura base en Celsius
        
        for (let i = 0; i < totalPoints; i++) {
            const timeProgress = i / totalPoints;
            
            // La temperatura sigue un patrón de onda sinusoidal con ruido
            // La temperatura aumenta durante el día y disminuye por la noche
            const hourCycle = Math.sin(timeProgress * Math.PI * 2) * 3;
            
            // Agregar ruido aleatorio y picos ocasionales (al pasar por diferentes regiones de órbita)
            const noise = Math.random() * 0.5 - 0.25;
            const spike = (Math.random() > 0.995) ? Math.random() * 5 * (Math.random() > 0.5 ? 1 : -1) : 0;
            
            temperatureData.push(baseTemp + hourCycle + noise + spike);
        }
        
        // Generar variaciones para muestras adicionales
        temp2Data = temperatureData.map(temp => temp + (Math.random() * 2 - 1)); // Muestra 2: variación ligera
        temp3Data = temperatureData.map(temp => temp + (Math.random() * 3 - 1.5)); // Muestra 3: variación mayor
        tempcubesatData = temperatureData.map(temp => temp - 2 + (Math.random() * 4)); // Temperatura cubesat
    }
    
    // Función para generar datos de aceleración (picos ocasionales con microgravedad)
    function generateAccelerationData() {
        accelerationData = [];
        accelXData = [];
        accelYData = [];
        accelZData = [];
        
        const baseAccel = 0.001; // Entorno de microgravedad (cercano a 0)
        
        for (let i = 0; i < totalPoints; i++) {
            const timeProgress = i / totalPoints;
            
            // Microgravedad base con algo de jitter
            const jitter = Math.random() * 0.0005;
            
            // Agregar eventos ocasionales de disparo de propulsores o acoplamiento
            const thrusterEvent = (Math.random() > 0.999) ? Math.random() * 0.05 : 0;
            
            // Agregar algo de vibración periódica (de los sistemas a bordo)
            const vibration = Math.sin(timeProgress * Math.PI * 200) * 0.0002;
            
            const accelValue = baseAccel + jitter + thrusterEvent + vibration;
            accelerationData.push(accelValue);
            
            // Generar componentes X, Y, Z con variaciones aleatorias
            accelXData.push(accelValue * (1 + (Math.random() * 0.4 - 0.2)));
            accelYData.push(accelValue * (1 + (Math.random() * 0.4 - 0.2)));
            accelZData.push(accelValue * (1 + (Math.random() * 0.4 - 0.2)));
        }
    }
    
    // Función para generar datos de presión (mayormente estable con cambios ocasionales)
    function generatePressureData() {
        pressureData = [];
        const basePressure = 101.3; // Presión estándar en kPa
        let currentPressure = basePressure;
        
        for (let i = 0; i < totalPoints; i++) {
            // Pequeña deriva aleatoria
            const drift = (Math.random() - 0.5) * 0.01;
            
            // Eventos ocasionales de ajuste de presión (ventilación o actividad experimental)
            if (Math.random() > 0.9995) {
                currentPressure += (Math.random() - 0.5) * 0.5;
            }
            
            // Agregar la deriva a la presión actual y asegurar que se mantenga dentro de límites realistas
            currentPressure += drift;
            currentPressure = Math.max(100.8, Math.min(101.8, currentPressure));
            
            pressureData.push(currentPressure);
        }
    }
    
    // Función para generar datos de voltaje (con ciclos de descarga y recarga de batería)
    function generateVoltageData() {
        voltageData = [];
        const maxVoltage = 5.0; // Voltaje máximo en voltios
        const minVoltage = 3.7; // Voltaje mínimo antes de recarga
        let currentVoltage = maxVoltage;
        let charging = false;
        
        for (let i = 0; i < totalPoints; i++) {
            const timeProgress = i / totalPoints;
            
            // Agregar pequeño ruido
            const noise = (Math.random() - 0.5) * 0.02;
            
            // Simular descarga o recarga de batería
            if (charging) {
                currentVoltage += 0.0003; // Tasa de carga
                if (currentVoltage >= maxVoltage) {
                    currentVoltage = maxVoltage;
                    charging = false;
                }
            } else {
                currentVoltage -= 0.0001; // Tasa de descarga
                if (currentVoltage <= minVoltage) {
                    charging = true;
                }
            }
            
            // Agregar caída de voltaje leve durante períodos de alta actividad
            const activityDrop = Math.sin(timeProgress * Math.PI * 8) > 0.7 ? 0.1 : 0;
            
            voltageData.push(currentVoltage + noise - activityDrop);
        }
    }
    
    // Función para generar datos de giroscopio (rotación en grados/segundo)
    function generateGyroscopeData() {
        gyroscopeData = [];
        gyroXData = [];
        gyroYData = [];
        gyroZData = [];
        
        const baseRotation = 0; // Orientación estable a 0 grados/segundo
        let currentRotationX = 0;
        let currentRotationY = 0;
        let currentRotationZ = 0;
        
        for (let i = 0; i < totalPoints; i++) {
            const timeProgress = i / totalPoints;
            
            // Simular caída libre con rotación realista
            // Durante la caída, el CubeSat puede tener rotación en múltiples ejes
            
            // Rotación principal (tumbling durante la caída)
            const tumblingRate = Math.sin(timeProgress * Math.PI * 4) * 15; // Rotación tipo tumbling
            
            // Pequeña deriva aleatoria en cada eje
            const driftX = (Math.random() - 0.5) * 0.1;
            const driftY = (Math.random() - 0.5) * 0.1;
            const driftZ = (Math.random() - 0.5) * 0.1;
            
            // Eventos ocasionales de estabilización o perturbación
            if (Math.random() > 0.995) {
                currentRotationX += (Math.random() - 0.5) * 10;
                currentRotationY += (Math.random() - 0.5) * 10;
                currentRotationZ += (Math.random() - 0.5) * 10;
            }
            
            // Aplicar amortiguación gradual (estabilización)
            currentRotationX *= 0.999;
            currentRotationY *= 0.999;
            currentRotationZ *= 0.999;
            
            // Agregar deriva y tumbling
            currentRotationX += driftX;
            currentRotationY += driftY + tumblingRate * 0.3;
            currentRotationZ += driftZ + tumblingRate * 0.7;
            
            // Almacenar datos
            gyroscopeData.push(Math.sqrt(currentRotationX*currentRotationX + currentRotationY*currentRotationY + currentRotationZ*currentRotationZ));
            gyroXData.push(currentRotationX);
            gyroYData.push(currentRotationY);
            gyroZData.push(currentRotationZ);
        }
    }
    
    // Función para generar todos los datos
    function generateAllData() {
        generateTimeLabels();
        generateTemperatureData();
        generateAccelerationData();
        generatePressureData();
        generateVoltageData();
        generateGyroscopeData();
    }
    
    // API pública del módulo
    return {
        generateAllData: generateAllData,
        getTimeLabels: function() { return timeLabels; },
        getTimeData: function() { return timeData; },
        getTemperatureData: function() { return temperatureData; },
        getTemp2Data: function() { return temp2Data; },
        getTemp3Data: function() { return temp3Data; },
        getTempcubesatData: function() { return tempcubesatData; },
        getAccelerationData: function() { return accelerationData; },
        getAccelXData: function() { return accelXData; },
        getAccelYData: function() { return accelYData; },
        getAccelZData: function() { return accelZData; },
        getPressureData: function() { return pressureData; },
        getVoltageData: function() { return voltageData; },
        getGyroscopeData: function() { return gyroscopeData; },
        getGyroXData: function() { return gyroXData; },
        getGyroYData: function() { return gyroYData; },
        getGyroZData: function() { return gyroZData; },
        getTotalPoints: function() { return totalPoints; }
    };
})();
