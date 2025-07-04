# 📦 Instrucciones de Despliegue Offline

## 🎯 Para usar el Dashboard CubeSat SIN conexión a internet:

### 1. 🔧 Configuración Inicial (Solo una vez)
```bash
# Clonar o copiar el proyecto a tu directorio local
# Ejecutar configuración offline
./setup-offline.sh
```

### 2. 🚀 Uso Diario
```bash
# Iniciar dashboard
./start-server.sh

# O manualmente:
python3 -m http.server 8080
# Luego abrir: http://localhost:8080
```

### 3. 📋 Verificación
```bash
# Verificar estado del proyecto
./check-status.sh
```

## 📁 ¿Qué archivos necesitas para funcionar offline?

### Esenciales (copia estos archivos):
```
cubesat/
├── index.html              # ✅ Página principal
├── css/styles.css           # ✅ Estilos
├── js/                      # ✅ Toda la carpeta JS
│   ├── app.js
│   ├── data-generator.js
│   ├── chart-module.js
│   ├── stats-module.js
│   ├── csv-module.js
│   └── orientation3d-module.js
├── libs/                    # ✅ Librerías locales (generadas por setup-offline.sh)
│   ├── chart/chart.min.js
│   └── three/
│       ├── three.min.js
│       └── OrbitControls.js
└── start-server.sh          # ✅ Script de inicio
```

### Opcionales (útiles pero no esenciales):
```
├── setup-offline.sh         # Solo para configuración inicial
├── check-status.sh          # Solo para verificación
└── README.md               # Documentación
```

## 🌐 Escenarios de Uso Offline

### ✅ Laptop sin Internet
1. Copia la carpeta completa del proyecto
2. Ejecuta `./start-server.sh`
3. ¡Listo! Dashboard funcional sin internet

### ✅ Presentación en Sitio Remoto
1. Lleva el proyecto en USB/dispositivo
2. Ejecuta `python3 -m http.server 8080`
3. Comparte la URL con audiencia local: `http://localhost:8080`

### ✅ Demostración en Red Local
1. Inicia servidor en máquina principal
2. Otros dispositivos acceden via IP local: `http://[IP-LOCAL]:8080`
3. Ejemplo: `http://192.168.1.100:8080`

### ✅ Entorno Corporativo Sin Internet
1. Instala proyecto en servidor interno
2. Configura proxy interno si es necesario
3. Acceso vía intranet corporativa

## 🔧 Solución de Problemas

### ❌ Error: "No se pueden cargar las librerías"
**Solución**: Ejecuta `./setup-offline.sh` nuevamente

### ❌ Error: "Puerto 8080 en uso"
**Solución**: El script automáticamente usa puerto 8081 como alternativa

### ❌ Error: "Python no encontrado"
**Solución**: Instala Python 3 o usa servidor alternativo:
```bash
# Alternativa con Node.js
npx http-server -p 8080

# Alternativa con PHP
php -S localhost:8080
```

### ❌ Error: "Gráficos no aparecen"
**Verificar**:
1. ¿Estás accediendo via `http://localhost:8080` y NO abriendo el archivo directamente?
2. ¿Existen los archivos en `libs/chart/` y `libs/three/`?
3. ¿La consola del navegador muestra errores?

## 📊 Tamaños de Archivo

- **Total del proyecto**: ~1.2 MB
- **Librerías offline**: ~856 KB
- **Código fuente**: ~350 KB
- **Estilos**: ~8 KB

## 🚀 Rendimiento Offline

- ✅ **Carga instantánea**: Sin dependencias de CDN
- ✅ **Sin latencia**: Todo local
- ✅ **Confiable**: No depende de conexión externa
- ✅ **Portable**: Funciona en cualquier dispositivo con navegador y Python

---

**💡 Tip**: Una vez configurado offline, el dashboard es completamente autosuficiente y puede funcionar en cualquier entorno sin modificaciones.
