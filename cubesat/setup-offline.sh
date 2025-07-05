#!/bin/bash

# Script de configuración para Dashboard CubeSat Offline
# Este script descarga todas las dependencias necesarias para funcionar sin internet

echo "🚀 Configurando Dashboard CubeSat para funcionamiento offline..."

# Crear directorios
mkdir -p libs/chart
mkdir -p libs/three

echo "📦 Descargando Chart.js..."
curl -o libs/chart/chart.min.js "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js"

echo "📦 Descargando Three.js..."
curl -o libs/three/three.min.js "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"

echo "📦 Descargando OrbitControls.js..."
curl -o libs/three/OrbitControls.js "https://raw.githubusercontent.com/mrdoob/three.js/r128/examples/js/controls/OrbitControls.js"

echo "✅ ¡Configuración completada!"
echo ""
echo "📋 Instrucciones para usar offline:"
echo "1. Ejecuta: ./start-server.sh"
echo "2. Abre tu navegador en: http://localhost:8080"
echo "3. ¡Disfruta del dashboard sin necesidad de internet!"
echo ""
echo "📁 Archivos descargados:"
echo "   - libs/chart/chart.min.js ($(du -h libs/chart/chart.min.js | cut -f1))"
echo "   - libs/three/three.min.js ($(du -h libs/three/three.min.js | cut -f1))" 
echo "   - libs/three/OrbitControls.js ($(du -h libs/three/OrbitControls.js | cut -f1))"
echo ""
echo "💡 Tip: Este dashboard funcionará completamente offline una vez configurado."
