// Módulo para cálculo y visualización de estadísticas
const StatsModule = (function() {
    // Función para calcular estadísticas para un conjunto de datos
    function calculateStatistics(data, dataType) {
        let sum = 0;
        let min = Infinity;
        let max = -Infinity;
        
        for (let value of data) {
            sum += value;
            if (value < min) min = value;
            if (value > max) max = value;
        }
        
        const mean = sum / data.length;
        
        // Calcular desviación estándar
        let sumSquaredDiff = 0;
        for (let value of data) {
            sumSquaredDiff += Math.pow(value - mean, 2);
        }
        
        const variance = sumSquaredDiff / data.length;
        const stdDev = Math.sqrt(variance);
        
        // Calcular puntuación de estabilidad (menor stdDev relativa a la media es más estable)
        const stabilityScore = Math.min(100, Math.max(0, 100 - (stdDev / mean * 100)));
        
        // Calcular recuento de anomalías (valores más allá de 3 desviaciones estándar)
        let anomalyCount = 0;
        for (let value of data) {
            if (Math.abs(value - mean) > 3 * stdDev) {
                anomalyCount++;
            }
        }
        
        // Obtener unidades según el tipo de datos
        let units = '';
        switch(dataType) {
            case 'Temperatura': units = '°C'; break;
            case 'Aceleración': units = 'G'; break;
            case 'Presión': units = 'kPa'; break;
            case 'Voltaje': units = 'V'; break;
            case 'Giroscopio': units = '°/s'; break;
        }
        
        return {
            dataType: dataType,
            count: data.length,
            min: min.toFixed(4),
            max: max.toFixed(4),
            mean: mean.toFixed(4),
            stdDev: stdDev.toFixed(4),
            variance: variance.toFixed(6),
            units: units,
            stabilityScore: stabilityScore.toFixed(1),
            anomalyCount: anomalyCount,
            healthStatus: anomalyCount < 10 ? 'Óptimo' : 'Requiere Revisión'
        };
    }
    
    // Función para mostrar estadísticas
    function displayStatistics(statsObj, totalPoints) {
        const statsContainer = document.getElementById('statistics');
        statsContainer.innerHTML = ''; // Limpiar estadísticas existentes
        
        // Agregar estadísticas generales de la misión
        const missionStats = [
            { label: 'Fecha de datos', value: '23 de junio de 2025' },
            { label: 'Duración de muestreo', value: '4 horas' },
            { label: 'Tasa de muestreo', value: '5 Hz' },
            { label: 'Total de puntos', value: totalPoints.toLocaleString() },
            { label: 'Estado general', value: 'Nominal', color: '#27ae60' }
        ];
        
        missionStats.forEach(item => {
            const statBox = document.createElement('div');
            statBox.className = 'stat-box';
            statBox.innerHTML = `
                <strong>${item.label}:</strong>
                <div style="font-size: 1.2em; margin-top: 5px; color: ${item.color || 'inherit'}">${item.value}</div>
            `;
            statsContainer.appendChild(statBox);
        });
        
        // Agregar estadísticas específicas por tipo de datos
        for (const key in statsObj) {
            const stats = statsObj[key];
            
            // Crear caja de estadísticas para cada tipo de datos
            const statBox = document.createElement('div');
            statBox.className = 'stat-box';
            
            // Usar codificación de color para el estado de salud
            const healthColor = stats.healthStatus === 'Óptimo' ? '#27ae60' : '#e74c3c';
            
            statBox.innerHTML = `
                <strong>${stats.dataType} (${stats.units}):</strong>
                <div style="margin-top: 5px; font-size: 0.9em;">
                    <div>Rango: ${stats.min} - ${stats.max}</div>
                    <div>Media: ${stats.mean}</div>
                    <div>Estabilidad: ${stats.stabilityScore}%</div>
                    <div style="color: ${healthColor}">Estado: ${stats.healthStatus}</div>
                </div>
            `;
            statsContainer.appendChild(statBox);
        }
    }
    
    // Calcular todas las estadísticas
    function calculateAllStats() {
        return {
            temperature: calculateStatistics(DataGenerator.getTemperatureData(), "Temperatura"),
            acceleration: calculateStatistics(DataGenerator.getAccelerationData(), "Aceleración"),
            pressure: calculateStatistics(DataGenerator.getPressureData(), "Presión"),
            voltage: calculateStatistics(DataGenerator.getVoltageData(), "Voltaje"),
            gyroscope: calculateStatistics(DataGenerator.getGyroscopeData(), "Giroscopio")
        };
    }
    
    // API pública del módulo
    return {
        calculateStatistics: calculateStatistics,
        displayStatistics: displayStatistics,
        calculateAllStats: calculateAllStats
    };
})();
