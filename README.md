# 🛰️ Dashboard de CubeSat

Un dashboard interactivo y completo para monitoreo de CubeSat con visualización 3D del vuelo y análisis de datos en tiempo real.

## ✨ Características

- **📊 Gráficos**: Visualización de temperatura, aceleración, presión, voltaje y giroscopio
- **📈 Gráfico Multi-datos**: Vista consolidada de todas las variables en un solo gráfico
- **📋 Estadísticas**: Cálculo automático de min, max, promedio y desviación estándar
- **💾 Exportación CSV**: Descarga de archivos CSV pre-generados por sensor o los generados por el archivo generate_csv para las pruebas de funcionamiento
- **🎮 Visualización 3D**: Simulación del vuelo del CubeSat con orientación en tiempo real
- **📱 Interfaz Responsive**: Navegación por pestañas entre Datos y vista 3D
- **🔄 Funcionamiento Offline**: No requiere conexión a internet una vez configurado

## 🚀 Configuración Rápida

### Opción 1: Configuración Automática (Recomendada)
```bash
# Ejecutar script de configuración
./setup-offline.sh

# Generar archivos CSV
python3 generate_csv.py

# Iniciar servidor
./start-server.sh
```

### Opción 2: Configuración Manual
```bash
# Crear directorios
mkdir -p libs/chart libs/three

# Descargar Chart.js
curl -o libs/chart/chart.umd.js "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.min.js"

# Descargar Three.js
curl -o libs/three/three.min.js "https://unpkg.com/three@0.158.0/build/three.min.js"

# Generar archivos CSV
python3 generate_csv.py

# Iniciar servidor local
python3 -m http.server 8080
```

## 📂 Estructura del Proyecto

```
cubesat/
├── index.html              # Página principal con navegación por pestañas
├── generate_csv.py         # Script Python para generar archivos CSV
├── CSV_README.md           # Documentación del sistema de CSV
├── csv_data/               # Directorio de archivos CSV generados
│   ├── temperatura_muestra1.csv
│   ├── temperatura_muestra2.csv
│   ├── temperatura_muestra3.csv
│   ├── temperatura_cubesat.csv
│   ├── aceleracion.csv
│   ├── presion.csv
│   └── giroscopio_xyz.csv
├── css/
│   └── styles.css          # Estilos del dashboard y vista 3D
├── js/
│   ├── app.js             # Inicializador principal
│   ├── data-generator.js   # Generador de datos simulados
│   ├── chart-module.js     # Gráficos individuales y multi-datos
│   ├── stats-module.js     # Cálculo de estadísticas
│   ├── csv-module.js       # Módulo de descarga de archivos CSV
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

### Pestaña
- **Gráfico Principal**: Vista consolidada de todas las variables.
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
- **Panel de Datos**: Datos en tiempo real:
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
- **Generación de datos**: Python 3 (script independiente)
- **Servidor**: Python HTTP Server (integrado)
- **Arquitectura**: Modular con separación de responsabilidades

## 🌐 Funcionamiento Offline

Una vez configurado con `./setup-offline.sh`, el dashboard funciona completamente sin conexión a internet:

- ✅ Todas las librerías están descargadas localmente
- ✅ No hay dependencias de CDN externos
- ✅ Funciona en cualquier red local o sin internet
- ✅ Ideal para demostraciones o entornos aislados

## 📊 Datos

### Sistema de Generación de CSV

El proyecto utiliza un script Python (`generate_csv.py`) para generar archivos CSV con datos:

- **Periodo**: 4 horas
- **Frecuencia**: 5 lecturas por segundo (72,000 puntos totales)
- **Archivos generados**:
  - `temperatura_muestra1.csv` - Temperatura de muestra 1
  - `temperatura_muestra2.csv` - Temperatura de muestra 2  
  - `temperatura_muestra3.csv` - Temperatura de muestra 3
  - `temperatura_cubesat.csv` - Temperatura del cubesat
  - `aceleracion.csv` - Aceleración en ejes X, Y, Z
  - `presion.csv` - Datos de presión
  - `giroscopio_xyz.csv` - Datos de giroscopio (Roll, Pitch, Yaw)

### Rangos de Variables:
- **Temperatura cubesat**: Variación realista con ciclos térmicos
- **Aceleración**: Entorno de microgravedad con eventos ocasionales
- **Presión**: Estable con deriva gradual  
- **Giroscopio**: Rotación tipo tumbling durante la caída
- **Temperaturas de muestras**: Variaciones independientes por muestra

### Regeneración de Datos:
```bash
# Generar nuevos archivos CSV
python3 generate_csv.py
```

## 🚨 Requisitos

- **Python 3**: Para el servidor HTTP local
- **Navegador Moderno**: Chrome, Firefox, Safari, Edge (últimas versiones)
- **Resolución**: 1024x768 o superior recomendada

## 📝 Notas de Desarrollo

- El dashboard debe ejecutarse desde un servidor HTTP (no abrir directamente el HTML)
- Los archivos CSV se generan con el script Python y se sirven desde el backend
- Los datos del frontend se generan dinámicamente para los gráficos
- La visualización 3D se optimiza automáticamente según el rendimiento del dispositivo
- Compatible con dispositivos táctiles para la navegación 3D
- Los archivos CSV y librerías están excluidos del control de versiones (ver `.gitignore`)

## 🔄 Flujo de Trabajo

1. **Configuración inicial**: Ejecutar `./setup-offline.sh`
2. **Generar datos**: Ejecutar `python3 generate_csv.py`
3. **Iniciar servidor**: Ejecutar `./start-server.sh`
4. **Regenerar datos**: Volver a ejecutar `generate_csv.py` cuando sea necesario

---

**Desarrollado para simulación y análisis de de CubeSat** 🛰️
