# 🛰️ Dashboard de Telemetría CubeSat

Un dashboard interactivo y completo para monitoreo de telemetría de CubeSat con visualización 3D del vuelo y análisis de datos en tiempo real.

## ✨ Características

- **📊 Gráficos de Telemetría**: Visualización de temperatura, aceleración, presión, voltaje y giroscopio
- **📈 Gráfico Multi-datos**: Vista consolidada de todas las variables en un solo gráfico
- **📋 Estadísticas**: Cálculo automático de min, max, promedio y desviación estándar
- **💾 Exportación CSV**: Descarga de datos individuales por sensor
- **🎮 Visualización 3D**: Simulación del vuelo del CubeSat con orientación en tiempo real
- **📱 Interfaz Responsive**: Navegación por pestañas entre telemetría y vista 3D
- **🔄 Funcionamiento Offline**: No requiere conexión a internet una vez configurado

## 🚀 Configuración Rápida

### Opción 1: Configuración Automática (Recomendada)
```bash
# Ejecutar script de configuración
./setup-offline.sh

# Iniciar servidor
./start-server.sh
```

### Opción 2: Configuración Manual
```bash
# Crear directorios
mkdir -p libs/chart libs/three

# Descargar Chart.js
curl -o libs/chart/chart.min.js "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.min.js"

# Descargar Three.js
curl -o libs/three/three.min.js "https://unpkg.com/three@0.158.0/build/three.min.js"

# Iniciar servidor local
python3 -m http.server 8080
```

## 📂 Estructura del Proyecto

```
cubesat/
├── index.html              # Página principal con navegación por pestañas
├── css/
│   └── styles.css          # Estilos del dashboard y vista 3D
├── js/
│   ├── app.js             # Inicializador principal
│   ├── data-generator.js   # Generador de datos simulados
│   ├── chart-module.js     # Gráficos individuales y multi-datos
│   ├── stats-module.js     # Cálculo de estadísticas
│   ├── csv-module.js       # Exportación de datos CSV
│   └── orientation3d-module.js # Visualización 3D del vuelo
├── libs/
│   ├── chart/
│   │   └── chart.min.js    # Chart.js local
│   └── three/
│       ├── three.min.js    # Three.js local
│       └── OrbitControls.js # Controles de cámara 3D
├── setup-offline.sh        # Script de configuración automática
└── start-server.sh         # Script para iniciar servidor
```

## 🎯 Uso del Dashboard

### Pestaña "Telemetría"
- **Gráfico Principal**: Vista consolidada de todas las variables de telemetría
- **Estadísticas**: Análisis estadístico en tiempo real de cada sensor
- **Gráficos Individuales**: Vista detallada por sensor:
  - Temperatura cubesat
  - Aceleración (G)
  - Presión (kPa)
  - Voltaje (V)
  - Giroscopio X, Y, Z (°/s)
  - Temperaturas de muestras 1, 2, 3 (°C)
- **Exportación CSV**: Botones para descargar datos de cada sensor

### Pestaña "Vuelo 3D"
- **Visualización 3D**: Representación del CubeSat con orientación basada en giroscopio
- **Controles de Cámara**: Orbitar, zoom y paneo con mouse/touch
- **Línea de Tiempo**: Controles de reproducción con slider de tiempo
- **Panel de Telemetría**: Datos en tiempo real:
  - Orientación (cuaterniones, ángulos Euler, velocidad angular)
  - Temperaturas (cubesat y muestras)
  - Sensores físicos (aceleración, presión)
  - Estado de la misión

## 🔧 Controles 3D

- **Clic izquierdo + arrastrar**: Orbitar alrededor del CubeSat
- **Rueda del mouse**: Zoom in/out
- **Clic derecho + arrastrar**: Paneo de la cámara
- **Botones de control**: Reproducir, pausar, reiniciar simulación
- **Slider de velocidad**: Ajustar velocidad de reproducción (1x-10x)

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6)
- **Gráficos**: Chart.js v4.4.0
- **3D**: Three.js v0.158.0 con OrbitControls
- **Servidor**: Python HTTP Server (integrado)
- **Arquitectura**: Modular con separación de responsabilidades

## 🌐 Funcionamiento Offline

Una vez configurado con `./setup-offline.sh`, el dashboard funciona completamente sin conexión a internet:

- ✅ Todas las librerías están descargadas localmente
- ✅ No hay dependencias de CDN externos
- ✅ Funciona en cualquier red local o sin internet
- ✅ Ideal para demostraciones o entornos aislados

## 📊 Datos Simulados

El dashboard incluye un generador de datos realistas que simula:

- **Periodo**: 4 horas de telemetría
- **Frecuencia**: Datos cada 30 segundos (480 puntos)
- **Variables**:
  - Temperatura cubesat: -10°C a 50°C
  - Aceleración: 0.8G a 1.2G  
  - Presión: 95-105 kPa
  - Voltaje: 3.0-4.2V
  - Giroscopio: ±50°/s en cada eje
  - Temperaturas de muestras: 15-35°C

## 🚨 Requisitos

- **Python 3**: Para el servidor HTTP local
- **Navegador Moderno**: Chrome, Firefox, Safari, Edge (últimas versiones)
- **Resolución**: 1024x768 o superior recomendada

## 📝 Notas de Desarrollo

- El dashboard debe ejecutarse desde un servidor HTTP (no abrir directamente el HTML)
- Los datos son simulados y se generan aleatoriamente en cada carga
- La visualización 3D se optimiza automáticamente según el rendimiento del dispositivo
- Compatible con dispositivos táctiles para la navegación 3D

---

**Desarrollado para simulación y análisis de telemetría de CubeSat** 🛰️
