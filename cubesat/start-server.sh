#!/bin/bash

echo "🚀 Iniciando servidor para Dashboard CubeSat..."
echo "📍 Directorio: $(pwd)"

# Verificar si las librerías están presentes
if [ ! -f "libs/chart/chart.min.js" ] || [ ! -f "libs/three/three.min.js" ]; then
    echo "⚠️  Librerías offline no encontradas."
    echo "🔧 Ejecutando configuración automática..."
    ./setup-offline.sh
fi

echo "🌐 URL: http://localhost:8080"
echo "⏹️  Para detener: Ctrl+C"
echo ""

# Verificar si el puerto está en uso
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Puerto 8080 ya está en uso. Intentando puerto alternativo..."
    PORT=8081
    echo "🌐 URL alternativa: http://localhost:$PORT"
else
    PORT=8080
fi

# Abrir el navegador automáticamente
if command -v open &> /dev/null; then
    echo "🔄 Abriendo navegador en 3 segundos..."
    sleep 3 && open http://localhost:$PORT &
fi

# Iniciar servidor HTTP
python3 -m http.server $PORT
