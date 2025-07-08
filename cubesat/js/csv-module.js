// Módulo para la descarga de archivos CSV desde el backend
const CSVModule = (function() {
    // Función para descargar un archivo CSV desde el backend
    function downloadCSVFromBackend(filename) {
        const link = document.createElement("a");
        link.setAttribute("href", `csv_data/${filename}`);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Configurar event listeners para los botones de descarga CSV
    function setupEventListeners() {
        // Temperatura Muestra 1
        document.getElementById('csvTempMuestra1').addEventListener('click', function() {
            downloadCSVFromBackend("temperatura_muestra1.csv");
        });
        
        // Temperatura Muestra 2
        document.getElementById('csvTempMuestra2').addEventListener('click', function() {
            downloadCSVFromBackend("temperatura_muestra2.csv");
        });
        
        // Temperatura Muestra 3
        document.getElementById('csvTempMuestra3').addEventListener('click', function() {
            downloadCSVFromBackend("temperatura_muestra3.csv");
        });
        
        // Temperatura cubesat
        document.getElementById('csvTempcubesat').addEventListener('click', function() {
            downloadCSVFromBackend("temperatura_cubesat.csv");
        });
        
        // Aceleración
        document.getElementById('csvAcceleration').addEventListener('click', function() {
            downloadCSVFromBackend("aceleracion.csv");
        });
        
        // Presión
        document.getElementById('csvPressure').addEventListener('click', function() {
            downloadCSVFromBackend("presion.csv");
        });
        
        // Giroscopio
        document.getElementById('csvGyroscope').addEventListener('click', function() {
            downloadCSVFromBackend("giroscopio_xyz.csv");
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
