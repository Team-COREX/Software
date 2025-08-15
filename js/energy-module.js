// Módulo de gestión de datos de energía desde CSV
const EnergyModule = (function(){
    let loaded = false;
    let latest = { voltage: null, current: null, power: null, rails: { voltages: [] } };
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

    function validateArray(name, arr, minLen=10) {
        if (!Array.isArray(arr) || arr.length < minLen) {
            console.error('Validación fallida para', name, 'len=', arr && arr.length);
            return false;
        }
        return true;
    }

    function addCriticalBadge(containerId, ok) {
        const el = document.getElementById(containerId);
        if (!el) return;
        let badge = el.querySelector('.critical-badge');
        if (!badge) {
            badge = document.createElement('div');
            badge.className = 'critical-badge';
            badge.style.cssText = 'position:absolute;top:4px;right:8px;font-size:0.65em;padding:2px 6px;border-radius:4px;background:'+ (ok?'#27ae60':'#c0392b') +';color:#fff;letter-spacing:0.5px;';
            badge.textContent = ok ? 'OK' : 'ALERTA';
            el.style.position='relative';
            el.appendChild(badge);
        } else {
            badge.style.background = ok? '#27ae60':'#c0392b';
            badge.textContent = ok? 'OK':'ALERTA';
        }
    }

    async function loadAndRender() {
        const base = 'csv_data/';
        // Cargar CSVs principales
        const loaders = [
            fetchCSV(base + 'voltaje_bus.csv'),
            fetchCSV(base + 'corriente_bus.csv'),
            fetchCSV(base + 'potencia_bus.csv'),
            fetchCSV(base + 'celdas_voltajes.csv'),
            fetchCSV(base + 'celdas_corriente.csv')
        ];
        // Intentar railes de forma individual para no abortar si faltan
        async function optional(path){ try { return await fetchCSV(path); } catch(e){ console.warn('Opcional faltante:', path); return null; } }
        loaders.push(optional(base + 'rails_voltajes.csv'));
    // Ya no cargamos corrientes ni potencias de railes
    const [voltCSV, currCSV, powCSV, cellsVCSV, cellsCCSV, railsVCSV] = await Promise.all(loaders);
        const volt = parseCSV(voltCSV);
        const curr = parseCSV(currCSV);
        const pow = parseCSV(powCSV);
        const cellsV = parseCSV(cellsVCSV);
        const cellsC = parseCSV(cellsCCSV);
    const railsV = railsVCSV ? parseCSV(railsVCSV) : {header:[], rows:[]};
    // Ya no se procesan corrientes ni potencias de railes

        // Validaciones críticas básicas (longitud y rango plausible)
        const okVoltage = validateArray('voltaje_bus', volt.rows) && volt.rows.every(r => r.length>1 && !isNaN(r[1]) && r[1] > 3 && r[1] < 5.5);
        const okCurrent = validateArray('corriente_bus', curr.rows) && curr.rows.every(r => r.length>1 && !isNaN(r[1]) && r[1] >= 0 && r[1] < 5);
        const okPower = validateArray('potencia_bus', pow.rows) && pow.rows.every(r => r.length>1 && !isNaN(r[1]) && r[1] >= 0 && r[1] < 30);
        // Celdas rango 3.5-4.3
        const okCells = validateArray('celdas_voltajes', cellsV.rows) && cellsV.rows.every(r => r.slice(1).every(v=>!isNaN(v) && v>3.4 && v<4.35));
        // Railes: Rail1 4.5-5.5, Rail2 3.0-3.6, Rail3 11-12.5
    const okRailsV = railsV.rows.length && validateArray('rails_voltajes', railsV.rows) && railsV.rows.every(r => {
            const [v1,v2,v3] = r.slice(1).map(parseFloat);
            return v1>4.5&&v1<5.5 && v2>3.0&&v2<3.6 && v3>11&&v3<12.5;
        });

        // Crear badges (usar contenedores de gráficos existentes)
        addCriticalBadge('busVoltageChart', okVoltage);
        addCriticalBadge('busCurrentChart', okCurrent);
        addCriticalBadge('busPowerChart', okPower);
        addCriticalBadge('cellVoltagesChart', okCells);

        // Crear gráficos específicos de railes
        if (railsV.rows.length) createMultiLineChart('railsVoltagesChart', railsV.rows, 1, ['#16a085','#8e44ad','#2c3e50'], 'Rail V');
        if (!railsV.rows.length) {
            console.warn('Diagnóstico railes -> Voltajes faltantes');
        }

        // Crear gráficos
    createLineChart('busVoltageChart', 'Voltaje Bateria', volt.rows, 1, 'rgba(75,192,192,1)', 'V');
        createLineChart('busCurrentChart', 'Corriente', curr.rows, 1, 'rgba(255,159,64,1)', 'A');
        createLineChart('busPowerChart', 'Potencia', pow.rows, 1, 'rgba(153,102,255,1)', 'W');
        createMultiLineChart('cellVoltagesChart', cellsV.rows, 1, ['#e74c3c','#e67e22','#f1c40f','#27ae60','#2980b9'],'Celda');
        createLineChart('cellCurrentsChart', 'Corriente Serie', cellsC.rows, 1, 'rgba(231,76,60,1)', 'A');

        // Últimos valores
        if (volt.rows.length) latest.voltage = parseFloat(volt.rows[volt.rows.length-1][1]);
        if (curr.rows.length) latest.current = parseFloat(curr.rows[curr.rows.length-1][1]);
        if (pow.rows.length) latest.power = parseFloat(pow.rows[pow.rows.length-1][1]);
    latest.rails.voltages = railsV.rows.length ? railsV.rows[railsV.rows.length-1].slice(1).map(parseFloat):[];
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
