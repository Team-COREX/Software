# Generación de Archivos CSV - CubeSat

## Descripción

Este sistema permite generar archivos CSV con datos que simulan ser del cubesat, usando Python, y luego servirlos desde el backend para su descarga desde el frontend.

## Archivos Generados

El script `generate_csv.py` genera los siguientes archivos CSV:

- `temperatura_muestra1.csv` - Datos de temperatura de la muestra 1
- `temperatura_muestra2.csv` - Datos de temperatura de la muestra 2  
- `temperatura_muestra3.csv` - Datos de temperatura de la muestra 3
- `temperatura_cubesat.csv` - Datos de temperatura del cubesat
- `aceleracion.csv` - Datos de aceleración en los ejes X, Y, Z
- `presion.csv` - Datos de presión
- `giroscopio_xyz.csv` - Datos de giroscopio (Roll, Pitch, Yaw)

## Uso

### 1. Generar archivos CSV

Ejecutar el script de Python para generar los archivos CSV:

```bash
python3 generate_csv.py
```

Los archivos se generarán en el directorio `csv_data/`.

### 2. Configurar el backend

El backend debe servir los archivos CSV desde el directorio `csv_data/` para que el frontend pueda descargarlos.

### 3. Funcionamiento del frontend

El módulo JavaScript `csv-module.js` ha sido modificado para:
- Eliminar la generación de CSV en el cliente
- Descargar archivos CSV pre-generados desde el backend
- Mantener la misma interfaz de usuario para los botones de descarga

## Características de los Datos

- **Duración**: 4 horas de datos
- **Frecuencia**: 5 lecturas por segundo
- **Puntos totales**: 72,000 puntos de datos por sensor
- **Formato de tiempo**: HH:MM:SS

## Ventajas del Nuevo Sistema

1. **Separación de responsabilidades**: La generación de datos se hace en Python, el frontend solo maneja la descarga
2. **Mejor rendimiento**: No se generan datos en tiempo real en el navegador
3. **Datos consistentes**: Los mismos datos se mantienen entre sesiones
4. **Escalabilidad**: Fácil de integrar con un backend real
5. **Mantenibilidad**: El código de generación de datos está separado del frontend

## Notas

- Los archivos CSV se generan con encoding UTF-8
- El separador utilizado es la coma (`,`)
- Los datos son con generados con proposito de prueba para la pagina.
- Los archivos se pueden regenerar ejecutando el script Python nuevamente
