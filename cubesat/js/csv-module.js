// Módulo para la generación y descarga de archivos CSV
const CSVModule = (function() {
    // Función para generar y descargar un archivo CSV
    function downloadCSV(data, filename) {
        const csvContent = "data:text/csv;charset=utf-8," + data;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Genera datos CSV para temperaturas
    function generateTemperatureCSV(tempData, label) {
        let csvRows = ["Tiempo,Temperatura (" + label + ")"];
        const timeData = DataGenerator.getTimeData();
        
        for (let i = 0; i < tempData.length; i++) {
            csvRows.push(timeData[i] + "," + tempData[i]);
        }
        return csvRows.join("\n");
    }
    
    // Genera datos CSV para aceleración
    function generateAccelerationCSV() {
        let csvRows = ["Tiempo,Aceleración X,Aceleración Y,Aceleración Z"];
        const timeData = DataGenerator.getTimeData();
        const accelXData = DataGenerator.getAccelXData();
        const accelYData = DataGenerator.getAccelYData();
        const accelZData = DataGenerator.getAccelZData();
        
        for (let i = 0; i < accelXData.length; i++) {
            csvRows.push(timeData[i] + "," + accelXData[i] + "," + accelYData[i] + "," + accelZData[i]);
        }
        return csvRows.join("\n");
    }
    
    // Genera datos CSV para presión
    function generatePressureCSV() {
        let csvRows = ["Tiempo,Presión"];
        const timeData = DataGenerator.getTimeData();
        const pressureData = DataGenerator.getPressureData();
        
        for (let i = 0; i < pressureData.length; i++) {
            csvRows.push(timeData[i] + "," + pressureData[i]);
        }
        return csvRows.join("\n");
    }
    
    // Genera datos CSV para giroscopio
    function generateGyroscopeCSV() {
        let csvRows = ["Tiempo,Giro X (Roll),Giro Y (Pitch),Giro Z (Yaw)"];
        const timeData = DataGenerator.getTimeData();
        const gyroXData = DataGenerator.getGyroXData();
        const gyroYData = DataGenerator.getGyroYData();
        const gyroZData = DataGenerator.getGyroZData();
        
        for (let i = 0; i < gyroXData.length; i++) {
            csvRows.push(timeData[i] + "," + gyroXData[i] + "," + gyroYData[i] + "," + gyroZData[i]);
        }
        return csvRows.join("\n");
    }
    
    // Configurar event listeners para los botones de descarga CSV
    function setupEventListeners() {
        // Temperatura Muestra 1
        document.getElementById('csvTempMuestra1').addEventListener('click', function() {
            const csvData = generateTemperatureCSV(DataGenerator.getTemperatureData(), "Muestra 1");
            downloadCSV(csvData, "temperatura_muestra1.csv");
        });
        
        // Temperatura Muestra 2
        document.getElementById('csvTempMuestra2').addEventListener('click', function() {
            const csvData = generateTemperatureCSV(DataGenerator.getTemp2Data(), "Muestra 2");
            downloadCSV(csvData, "temperatura_muestra2.csv");
        });
        
        // Temperatura Muestra 3
        document.getElementById('csvTempMuestra3').addEventListener('click', function() {
            const csvData = generateTemperatureCSV(DataGenerator.getTemp3Data(), "Muestra 3");
            downloadCSV(csvData, "temperatura_muestra3.csv");
        });
        
        // Temperatura cubesat
        document.getElementById('csvTempcubesat').addEventListener('click', function() {
            const csvData = generateTemperatureCSV(DataGenerator.getTempcubesatData(), "cubesat");
            downloadCSV(csvData, "temperatura_cubesat.csv");
        });
        
        // Aceleración
        document.getElementById('csvAcceleration').addEventListener('click', function() {
            const csvData = generateAccelerationCSV();
            downloadCSV(csvData, "aceleracion.csv");
        });
        
        // Presión
        document.getElementById('csvPressure').addEventListener('click', function() {
            const csvData = generatePressureCSV();
            downloadCSV(csvData, "presion.csv");
        });
        
        // Giroscopio
        document.getElementById('csvGyroscope').addEventListener('click', function() {
            const csvData = generateGyroscopeCSV();
            downloadCSV(csvData, "giroscopio_xyz.csv");
        });
        
        // Eventos de estilo para los botones
        const buttons = document.querySelectorAll('.csv-button');
        buttons.forEach(button => {
            const originalColor = button.style.backgroundColor;
            button.addEventListener('mouseover', function() {
                button.style.backgroundColor = '#2980b9';
                if (button.id === 'csvAcceleration') button.style.backgroundColor = '#c0392b';
                if (button.id === 'csvPressure') button.style.backgroundColor = '#d35400';
                if (button.id === 'csvGyroscope') button.style.backgroundColor = '#8e44ad';
            });
            button.addEventListener('mouseout', function() {
                button.style.backgroundColor = originalColor;
            });
        });
    }
    
    // API pública del módulo
    return {
        setupEventListeners: setupEventListeners
    };
})();
