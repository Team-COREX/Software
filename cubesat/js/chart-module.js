// Módulo para crear y gestionar los gráficos
const ChartModule = (function() {
    // Crear gráfico de datos múltiples que muestra todas las mediciones
    function createMultiDataChart() {
        console.log('Iniciando createMultiDataChart...');
        
        try {
            // Verificar que el elemento canvas existe
            const canvas = document.getElementById('multiDataChart');
            if (!canvas) {
                console.error('Canvas multiDataChart no encontrado');
                return;
            }
            console.log('Canvas encontrado:', canvas);
            
            // Muestrear datos a intervalos regulares para evitar saturar el gráfico
            const totalPoints = DataGenerator.getTotalPoints();
            console.log('Total de puntos:', totalPoints);
            
            const sampleInterval = Math.ceil(totalPoints / 500); // Mostrar ~500 puntos
            
            const sampledLabels = [];
            const sampledTemperature = [];
            const sampledAcceleration = [];
            const sampledPressure = [];
            const sampledVoltage = [];
            const sampledGyroX = [];
            const sampledGyroY = [];
            const sampledGyroZ = [];
            
            const timeLabels = DataGenerator.getTimeLabels();
            const temperatureData = DataGenerator.getTemperatureData();
            const accelerationData = DataGenerator.getAccelerationData();
            const pressureData = DataGenerator.getPressureData();
            const voltageData = DataGenerator.getVoltageData();
            const gyroXData = DataGenerator.getGyroXData();
            const gyroYData = DataGenerator.getGyroYData();
            const gyroZData = DataGenerator.getGyroZData();
            
            for (let i = 0; i < totalPoints; i += sampleInterval) {
                sampledLabels.push(timeLabels[i] || '');
                sampledTemperature.push(temperatureData[i]);
                sampledAcceleration.push(accelerationData[i] * 1000); // Escalar para visibilidad
                sampledPressure.push(pressureData[i] - 100); // Desplazar para visibilidad
                sampledVoltage.push(voltageData[i]);
                sampledGyroX.push(gyroXData[i]);
                sampledGyroY.push(gyroYData[i]);
                sampledGyroZ.push(gyroZData[i]);
            }
            
            const ctx = document.getElementById('multiDataChart').getContext('2d');
            new Chart(ctx, {
            type: 'line',
            data: {
                labels: sampledLabels,
                datasets: [
                    {
                        label: 'Temperatura (°C)',
                        data: sampledTemperature,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.1)',
                        borderWidth: 1,
                        pointRadius: 0,
                        yAxisID: 'y1'
                    },
                    {
                        label: 'Aceleración (mG)',
                        data: sampledAcceleration,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.1)',
                        borderWidth: 1,
                        pointRadius: 0,
                        yAxisID: 'y2'
                    },
                    {
                        label: 'Presión (kPa+100)',
                        data: sampledPressure,
                        borderColor: 'rgba(255, 206, 86, 1)',
                        backgroundColor: 'rgba(255, 206, 86, 0.1)',
                        borderWidth: 1,
                        pointRadius: 0,
                        yAxisID: 'y1'
                    },
                    {
                        label: 'Voltaje (V)',
                        data: sampledVoltage,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.1)',
                        borderWidth: 1,
                        pointRadius: 0,
                        yAxisID: 'y1'
                    },
                    {
                        label: 'Giro X - Roll (°/s)',
                        data: sampledGyroX,
                        borderColor: 'rgba(255, 159, 64, 1)',
                        backgroundColor: 'rgba(255, 159, 64, 0.1)',
                        borderWidth: 1,
                        pointRadius: 0,
                        yAxisID: 'y3'
                    },
                    {
                        label: 'Giro Y - Pitch (°/s)',
                        data: sampledGyroY,
                        borderColor: 'rgba(153, 102, 255, 1)',
                        backgroundColor: 'rgba(153, 102, 255, 0.1)',
                        borderWidth: 1,
                        pointRadius: 0,
                        yAxisID: 'y3'
                    },
                    {
                        label: 'Giro Z - Yaw (°/s)',
                        data: sampledGyroZ,
                        borderColor: 'rgba(255, 99, 255, 1)',
                        backgroundColor: 'rgba(255, 99, 255, 0.1)',
                        borderWidth: 1,
                        pointRadius: 0,
                        yAxisID: 'y3'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Telemetría del CubeSat - Todos los sensores (4 horas)',
                        font: {
                            size: 16
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Tiempo (HH:MM:SS)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Valores principales'
                        }
                    },
                    y2: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Aceleración (mG)'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    },
                    y3: {
                        type: 'linear',
                        display: false,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Velocidad Angular (°/s)'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
        console.log('MultiDataChart creado exitosamente');
        } catch (error) {
            console.error('Error en createMultiDataChart:', error);
        }
    }
    
    // Función helper para crear gráficos individuales
    function createIndividualChart(canvasId, label, data, color, unit) {
        const totalPoints = DataGenerator.getTotalPoints();
        const timeLabels = DataGenerator.getTimeLabels();
        
        const sampleInterval = Math.ceil(totalPoints / 300);
        const sampledLabels = [];
        const sampledData = [];
        
        for (let i = 0; i < totalPoints; i += sampleInterval) {
            sampledLabels.push(timeLabels[i] || '');
            sampledData.push(data[i]);
        }
        
        const ctx = document.getElementById(canvasId).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: sampledLabels,
                datasets: [{
                    label: label,
                    data: sampledData,
                    borderColor: color,
                    backgroundColor: color.replace('1)', '0.1)'),
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: label + (unit ? ' (' + unit + ')' : ''),
                        font: {
                            size: 14
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            callback: function(value) {
                                return value + (unit ? ' ' + unit : '');
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Crear gráficos individuales
    function createAccelerationChart() {
        createIndividualChart('accelerationChart', 'Aceleración', DataGenerator.getAccelerationData(), 'rgba(54, 162, 235, 1)', 'G');
    }
    
    function createPressureChart() {
        createIndividualChart('pressureChart', 'Presión', DataGenerator.getPressureData(), 'rgba(255, 206, 86, 1)', 'kPa');
    }
    
    function createVoltageChart() {
        createIndividualChart('voltageChart', 'Voltaje', DataGenerator.getVoltageData(), 'rgba(75, 192, 192, 1)', 'V');
    }
    
    function createGyroscopeChart() {
        const totalPoints = DataGenerator.getTotalPoints();
        const timeLabels = DataGenerator.getTimeLabels();
        const gyroXData = DataGenerator.getGyroXData();
        const gyroYData = DataGenerator.getGyroYData();
        const gyroZData = DataGenerator.getGyroZData();
        
        const sampleInterval = Math.ceil(totalPoints / 300);
        const sampledLabels = [];
        const sampledGyroX = [];
        const sampledGyroY = [];
        const sampledGyroZ = [];
        
        for (let i = 0; i < totalPoints; i += sampleInterval) {
            sampledLabels.push(timeLabels[i] || '');
            sampledGyroX.push(gyroXData[i]);
            sampledGyroY.push(gyroYData[i]);
            sampledGyroZ.push(gyroZData[i]);
        }
        
        const ctx = document.getElementById('gyroscopeChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: sampledLabels,
                datasets: [
                    {
                        label: 'Giro X (Roll)',
                        data: sampledGyroX,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.1)',
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false
                    },
                    {
                        label: 'Giro Y (Pitch)',
                        data: sampledGyroY,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.1)',
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false
                    },
                    {
                        label: 'Giro Z (Yaw)',
                        data: sampledGyroZ,
                        borderColor: 'rgba(255, 206, 86, 1)',
                        backgroundColor: 'rgba(255, 206, 86, 0.1)',
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Velocidades Angulares (°/s)',
                        font: {
                            size: 14
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Velocidad Angular (°/s)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value.toFixed(1) + ' °/s';
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Tiempo'
                        }
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false
                }
            }
        });
    }
    
    function createTempMuestra1Chart() {
        createIndividualChart('tempMuestra1Chart', 'Temperatura Muestra 1', DataGenerator.getTemperatureData(), 'rgba(255, 99, 132, 1)', '°C');
    }
    
    function createTempMuestra2Chart() {
        createIndividualChart('tempMuestra2Chart', 'Temperatura Muestra 2', DataGenerator.getTemp2Data(), 'rgba(54, 162, 235, 1)', '°C');
    }
    
    function createTempMuestra3Chart() {
        createIndividualChart('tempMuestra3Chart', 'Temperatura Muestra 3', DataGenerator.getTemp3Data(), 'rgba(255, 206, 86, 1)', '°C');
    }
    
    function createTempcubesatChart() {
        createIndividualChart('tempcubesatChart', 'Temperatura cubesat', DataGenerator.getTempcubesatData(), 'rgba(75, 192, 192, 1)', '°C');
    }
    
    // Crear todos los gráficos
    function createAllCharts() {
        try {
            console.log('Creando gráficos...');
            console.log('Chart.js disponible:', typeof Chart !== 'undefined');
            
            createMultiDataChart();
            console.log('✓ MultiDataChart creado');
            
            createAccelerationChart();
            console.log('✓ AccelerationChart creado');
            
            createPressureChart();
            console.log('✓ PressureChart creado');
            
            createVoltageChart();
            console.log('✓ VoltageChart creado');
            
            createGyroscopeChart();
            console.log('✓ GyroscopeChart creado');
            
            createTempcubesatChart();
            console.log('✓ TempcubesatChart creado');
            
            createTempMuestra1Chart();
            console.log('✓ TempMuestra1Chart creado');
            
            createTempMuestra2Chart();
            console.log('✓ TempMuestra2Chart creado');
            
            createTempMuestra3Chart();
            console.log('✓ TempMuestra3Chart creado');
            
            console.log('Todos los gráficos creados exitosamente');
        } catch (error) {
            console.error('Error al crear gráficos:', error);
            console.error('Stack trace:', error.stack);
        }
    }
    
    // API pública del módulo
    return {
        createAllCharts: createAllCharts
    };
})();
