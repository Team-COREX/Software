// Módulo para mostrar datos dinámicos de batería en el dashboard
const BatteryModule = (function() {
    let initialized = false;
    let intervalId = null;

    function init() {
        if (initialized) return;
        const cellsContainer = document.getElementById('batteryCells');
        if (!cellsContainer) return;
        const cellVoltages = DataGenerator.getBatteryCellVoltages();
        const cellCurrents = DataGenerator.getBatteryCellCurrents();
        const totalPoints = DataGenerator.getTotalPoints();
        const packCurr = DataGenerator.getPackCurrentData();

        // Crear cajas por celda
        for (let i = 0; i < cellVoltages.length; i++) {
            const div = document.createElement('div');
            div.className = 'battery-cell-box';
            div.id = `batteryCell${i}`;
            div.innerHTML = `<strong>Celda ${i+1}</strong>
                <div>V ahora: <span id="cell${i}Vnow">--</span></div>
                <div>V media: <span id="cell${i}Vmean">--</span></div>
                <div>I ahora: <span id="cell${i}Inow">--</span></div>
                <div>I media: <span id="cell${i}Imean">--</span></div>`;
            cellsContainer.appendChild(div);
        }

        // Precalcular medias
        const vMeans = cellVoltages.map(arr => arr.reduce((a,b)=>a+b,0)/arr.length);
        const iMeans = cellCurrents.map(arr => arr.reduce((a,b)=>a+b,0)/arr.length);
        const packCurrentMean = packCurr.reduce((a,b)=>a+b,0)/packCurr.length;
        const packVoltageMean = vMeans.reduce((a,b)=>a+b,0)/vMeans.length;

        // Colocar medias estáticas
        for (let i=0;i<cellVoltages.length;i++) {
            document.getElementById(`cell${i}Vmean`).textContent = vMeans[i].toFixed(3);
            document.getElementById(`cell${i}Imean`).textContent = iMeans[i].toFixed(3);
        }
        document.getElementById('packCurrentMean').textContent = packCurrentMean.toFixed(3) + ' A';
        document.getElementById('packVoltageMean').textContent = packVoltageMean.toFixed(3) + ' V';

        let idx = 0;
        function tick() {
            if (idx >= totalPoints) idx = 0;
            for (let i=0;i<cellVoltages.length;i++) {
                document.getElementById(`cell${i}Vnow`).textContent = cellVoltages[i][idx].toFixed(3);
                document.getElementById(`cell${i}Inow`).textContent = cellCurrents[i][idx].toFixed(3);
            }
            document.getElementById('packCurrentNow').textContent = packCurr[idx].toFixed(3) + ' A';
            idx += 50; // saltar 10 segundos (5 Hz * 10)
        }
        tick();
        intervalId = setInterval(tick, 1000);
        initialized = true;
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
    BatteryModule.init();
});
