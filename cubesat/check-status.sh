#!/bin/bash

# Script de verificación del estado offline del Dashboard CubeSat

echo "🔍 Verificando configuración offline del Dashboard CubeSat..."
echo ""

# Función para verificar archivos
check_file() {
    if [ -f "$1" ]; then
        size=$(du -h "$1" | cut -f1)
        echo "✅ $1 ($size)"
        return 0
    else
        echo "❌ $1 - FALTANTE"
        return 1
    fi
}

# Verificar estructura básica
echo "📁 Verificando estructura del proyecto:"
check_file "index.html"
check_file "css/styles.css"
check_file "js/app.js"
check_file "js/data-generator.js"
check_file "js/chart-module.js"
check_file "js/stats-module.js"
check_file "js/csv-module.js"
check_file "js/orientation3d-module.js"

echo ""
echo "📦 Verificando librerías offline:"
missing=0

if ! check_file "libs/chart/chart.min.js"; then
    missing=$((missing + 1))
fi

if ! check_file "libs/three/three.min.js"; then
    missing=$((missing + 1))
fi

if ! check_file "libs/three/OrbitControls.js"; then
    missing=$((missing + 1))
fi

echo ""

if [ $missing -eq 0 ]; then
    echo "🎉 ¡CONFIGURACIÓN OFFLINE COMPLETA!"
    echo ""
    echo "📋 Para usar el dashboard:"
    echo "   1. Ejecuta: ./start-server.sh"
    echo "   2. Abre: http://localhost:8080"
    echo "   3. ¡Funciona sin internet! 🌐❌"
    echo ""
    echo "💡 Tamaño total de librerías: $(du -sh libs/ | cut -f1)"
else
    echo "⚠️  Faltan $missing archivo(s). Ejecuta: ./setup-offline.sh"
fi

echo ""
echo "🚀 Estado del servidor:"
if pgrep -f "python3 -m http.server" > /dev/null; then
    echo "✅ Servidor HTTP ejecutándose"
    echo "🌐 Disponible en: http://localhost:8080"
else
    echo "⚠️  Servidor HTTP no está ejecutándose"
    echo "💡 Ejecuta: ./start-server.sh"
fi
