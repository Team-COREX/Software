// Archivo principal para inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, verificando dependencias...');
    
    // Verificar que Chart.js esté disponible
    if (typeof Chart === 'undefined') {
        console.error('Chart.js no está disponible');
        return;
    }
    
    // Verificar que Three.js esté disponible para la pestaña 3D
    if (typeof THREE === 'undefined') {
        console.error('Three.js no está disponible');
    }
    
    console.log('Dependencias verificadas, iniciando aplicación...');
    
    // Generar todos los datos
    DataGenerator.generateAllData();
    console.log('Datos generados');
    
    // Calcular y mostrar estadísticas
    const stats = StatsModule.calculateAllStats();
    StatsModule.displayStatistics(stats, DataGenerator.getTotalPoints());
    console.log('Estadísticas calculadas');
    
    // Crear todos los gráficos
    ChartModule.createAllCharts();
    console.log('Gráficos creados');
    
    // Configurar los listeners para los botones de descarga CSV
    CSVModule.setupEventListeners();
    console.log('Event listeners configurados');
    
    console.log('Aplicación inicializada completamente');
});
