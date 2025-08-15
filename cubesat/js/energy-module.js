// Módulo de gestión de datos de energía desde CSV
const EnergyModule = (function(){
    let loaded = false;
    let latest = { voltage: null, current: null, power: null };
    const charts = {};

    async function fetchCSV(path) {
        const res = await fetch(path);
        if (!res.ok) throw new Error('No se pudo cargar ' + path);
        const text = await res.text();
        return text.trim();
    }

    function parseCSV(text) {
        const lines = text.split(/\r?\n/);
        const header = lines.shift().split(',').map(h=>h.trim());
        const rows = lines.map(line => line.split(',').map(v=>v.trim()));
        return { header, rows };
    }

    function sampleRows(rows, maxPoints=500) {
        if (rows.length <= maxPoints) return rows;
        const interval = Math.ceil(rows.length / maxPoints);
        const sampled = [];
        for (let i=0;i<rows.length;i+=interval) sampled.push(rows[i]);
        if (sampled[sampled.length-1] !== rows[rows.length-1]) sampled.push(rows[rows.length-1]);
        return sampled;
    }

    function createLineChart(canvasId, label, rows, valueIndex, color, unit) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const sampled = sampleRows(rows);
        const labels = sampled.map(r=>r[0]);
        const data = sampled.map(r=>parseFloat(r[valueIndex]));
        const ctx = canvas.getContext('2d');
        if (charts[canvasId]) charts[canvasId].destroy();
        charts[canvasId] = new Chart(ctx, {
            type:'line',
            data:{ labels, datasets:[{ label: label + (unit?` (${unit})`:''), data, borderColor: color, backgroundColor: color.replace('1)', '0.1)'), pointRadius:0, borderWidth:1.5, fill:true }]},
            options:{ responsive:true, maintainAspectRatio:false, scales:{ y:{ ticks:{ callback:(v)=> v + (unit? ' '+unit:'') } } } }
        });
    }

    function createMultiLineChart(canvasId, rows, startIndex, colors, baseLabel) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const sampled = sampleRows(rows);
        const labels = sampled.map(r=>r[0]);
        const datasetCount = sampled[0].length - startIndex;
        const datasets = [];
        for (let i=0;i<datasetCount;i++) {
            const data = sampled.map(r=>parseFloat(r[startIndex + i]));
            datasets.push({ label: baseLabel + ' ' + (i+1), data, borderColor: colors[i % colors.length], backgroundColor: 'rgba(0,0,0,0)', pointRadius:0, borderWidth:1.2, fill:false });
        }
        const ctx = canvas.getContext('2d');
        if (charts[canvasId]) charts[canvasId].destroy();
        charts[canvasId] = new Chart(ctx, { type:'line', data:{ labels, datasets }, options:{ responsive:true, maintainAspectRatio:false } });
    }

    async function loadAndRender() {
        const base = 'csv_data/';
        // Cargar CSVs
        const [voltCSV, currCSV, powCSV, cellsVCSV, cellsCCSV] = await Promise.all([
            fetchCSV(base + 'voltaje_bus.csv'),
            fetchCSV(base + 'corriente_bus.csv'),
            fetchCSV(base + 'potencia_bus.csv'),
            fetchCSV(base + 'celdas_voltajes.csv'),
            fetchCSV(base + 'celdas_corriente.csv')
        ]);
        const volt = parseCSV(voltCSV); // header: Tiempo, Voltaje (V)
        const curr = parseCSV(currCSV); // Tiempo, Corriente (A)
        const pow = parseCSV(powCSV);   // Tiempo, Potencia (W)
        const cellsV = parseCSV(cellsVCSV); // Tiempo, Celda1..5
        const cellsC = parseCSV(cellsCCSV); // Tiempo, Corriente Serie (A)

        // Crear gráficos
        createLineChart('busVoltageChart', 'Voltaje', volt.rows, 1, 'rgba(75,192,192,1)', 'V');
        createLineChart('busCurrentChart', 'Corriente Bus', curr.rows, 1, 'rgba(255,159,64,1)', 'A');
        createLineChart('busPowerChart', 'Potencia Bus', pow.rows, 1, 'rgba(153,102,255,1)', 'W');
        createMultiLineChart('cellVoltagesChart', cellsV.rows, 1, ['#e74c3c','#e67e22','#f1c40f','#27ae60','#2980b9'],'Celda');
        createLineChart('cellCurrentsChart', 'Corriente Serie', cellsC.rows, 1, 'rgba(231,76,60,1)', 'A');

        // Últimos valores
        if (volt.rows.length) latest.voltage = parseFloat(volt.rows[volt.rows.length-1][1]);
        if (curr.rows.length) latest.current = parseFloat(curr.rows[curr.rows.length-1][1]);
        if (pow.rows.length) latest.power = parseFloat(pow.rows[pow.rows.length-1][1]);
        updateSummary();
        loaded = true;
        console.log('Datos de energía cargados');
    }

    function updateSummary() {
        const vEl = document.getElementById('busVoltageValue');
        const cEl = document.getElementById('busCurrentValue');
        const pEl = document.getElementById('busPowerValue');
        if (vEl && latest.voltage!=null) vEl.textContent = latest.voltage.toFixed(2)+' V';
        if (cEl && latest.current!=null) cEl.textContent = latest.current.toFixed(2)+' A';
        if (pEl && latest.power!=null) pEl.textContent = latest.power.toFixed(2)+' W';
    }

    async function ensureLoaded(){
        try {
            if (!loaded) await loadAndRender(); else updateSummary();
        } catch(e){ console.error('Error cargando datos de energía:', e); }
    }

    return { ensureLoaded };
})();
