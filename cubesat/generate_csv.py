#!/usr/bin/env python3
"""
Script para generar archivos CSV de datos de telemetría del cubesat.
Ejecutar este script manualmente para generar los archivos CSV que serán servidos por el backend.
"""

import csv
import math
import random
import os
from datetime import datetime, timedelta

# Configuración
HOURS = 4
MINUTES_PER_HOUR = 60
SECONDS_PER_MINUTE = 60
READINGS_PER_SECOND = 5  # 5 lecturas por segundo

# Puntos de datos totales (4 horas de datos a 5 lecturas por segundo)
TOTAL_POINTS = HOURS * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * READINGS_PER_SECOND

# Directorio para guardar los archivos CSV
CSV_DIR = "csv_data"

def create_csv_directory():
    """Crear el directorio para archivos CSV si no existe."""
    if not os.path.exists(CSV_DIR):
        os.makedirs(CSV_DIR)

def generate_time_data():
    """Generar datos de tiempo en formato HH:MM:SS."""
    time_data = []
    
    for i in range(TOTAL_POINTS):
        total_seconds = i / READINGS_PER_SECOND
        hours = int(total_seconds // 3600)
        minutes = int((total_seconds % 3600) // 60)
        seconds = int(total_seconds % 60)
        
        time_string = f"{hours:02d}:{minutes:02d}:{seconds:02d}"
        time_data.append(time_string)
    
    return time_data

def generate_temperature_data():
    """Generar datos de temperatura para todas las muestras."""
    # Temperatura base
    base_temp = 22  # Celsius
    temperature_data = []
    
    for i in range(TOTAL_POINTS):
        time_progress = i / TOTAL_POINTS
        
        # Patrón sinusoidal con ruido
        hour_cycle = math.sin(time_progress * math.pi * 2) * 3
        noise = random.random() * 0.5 - 0.25
        spike = (random.random() * 5 * (1 if random.random() > 0.5 else -1)) if random.random() > 0.995 else 0
        
        temperature_data.append(base_temp + hour_cycle + noise + spike)
    
    # Generar variaciones para diferentes muestras
    temp2_data = [temp + (random.random() * 2 - 1) for temp in temperature_data]
    temp3_data = [temp + (random.random() * 3 - 1.5) for temp in temperature_data]
    temp_cubesat_data = [temp - 2 + (random.random() * 4) for temp in temperature_data]
    
    return temperature_data, temp2_data, temp3_data, temp_cubesat_data

def generate_acceleration_data():
    """Generar datos de aceleración para los tres ejes."""
    base_accel = 0.001  # Microgravedad
    accel_x_data = []
    accel_y_data = []
    accel_z_data = []
    
    for i in range(TOTAL_POINTS):
        time_progress = i / TOTAL_POINTS
        
        # Microgravedad base con jitter
        jitter = random.random() * 0.0005
        thruster_event = (random.random() * 0.05) if random.random() > 0.999 else 0
        vibration = math.sin(time_progress * math.pi * 200) * 0.0002
        
        accel_value = base_accel + jitter + thruster_event + vibration
        
        # Generar componentes X, Y, Z con variaciones aleatorias
        accel_x_data.append(accel_value * (1 + (random.random() * 0.4 - 0.2)))
        accel_y_data.append(accel_value * (1 + (random.random() * 0.4 - 0.2)))
        accel_z_data.append(accel_value * (1 + (random.random() * 0.4 - 0.2)))
    
    return accel_x_data, accel_y_data, accel_z_data

def generate_pressure_data():
    """Generar datos de presión."""
    base_pressure = 101.3  # kPa
    pressure_data = []
    current_pressure = base_pressure
    
    for i in range(TOTAL_POINTS):
        # Pequeña deriva aleatoria
        drift = (random.random() - 0.5) * 0.01
        
        # Eventos ocasionales de ajuste de presión
        if random.random() > 0.9995:
            current_pressure += (random.random() - 0.5) * 0.5
        
        current_pressure += drift
        current_pressure = max(100.8, min(101.8, current_pressure))
        
        pressure_data.append(current_pressure)
    
    return pressure_data

def generate_gyroscope_data():
    """Generar datos de giroscopio para los tres ejes."""
    gyro_x_data = []
    gyro_y_data = []
    gyro_z_data = []
    
    current_rotation_x = 0
    current_rotation_y = 0
    current_rotation_z = 0
    
    for i in range(TOTAL_POINTS):
        time_progress = i / TOTAL_POINTS
        
        # Rotación tipo tumbling
        tumbling_rate = math.sin(time_progress * math.pi * 4) * 15
        
        # Deriva aleatoria en cada eje
        drift_x = (random.random() - 0.5) * 0.1
        drift_y = (random.random() - 0.5) * 0.1
        drift_z = (random.random() - 0.5) * 0.1
        
        # Eventos ocasionales de perturbación
        if random.random() > 0.995:
            current_rotation_x += (random.random() - 0.5) * 10
            current_rotation_y += (random.random() - 0.5) * 10
            current_rotation_z += (random.random() - 0.5) * 10
        
        # Amortiguación gradual
        current_rotation_x *= 0.999
        current_rotation_y *= 0.999
        current_rotation_z *= 0.999
        
        # Aplicar deriva y tumbling
        current_rotation_x += drift_x
        current_rotation_y += drift_y + tumbling_rate * 0.3
        current_rotation_z += drift_z + tumbling_rate * 0.7
        
        gyro_x_data.append(current_rotation_x)
        gyro_y_data.append(current_rotation_y)
        gyro_z_data.append(current_rotation_z)
    
    return gyro_x_data, gyro_y_data, gyro_z_data

def save_csv_file(filename, headers, data):
    """Guardar datos en un archivo CSV."""
    filepath = os.path.join(CSV_DIR, filename)
    with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(headers)
        writer.writerows(data)
    print(f"Archivo CSV generado: {filepath}")

def main():
    """Función principal para generar todos los archivos CSV."""
    print("Generando archivos CSV de telemetría del cubesat...")
    
    # Crear directorio
    create_csv_directory()
    
    # Generar datos de tiempo
    time_data = generate_time_data()
    
    # Generar datos de temperatura
    temp1_data, temp2_data, temp3_data, temp_cubesat_data = generate_temperature_data()
    
    # Guardar archivos de temperatura
    save_csv_file("temperatura_muestra1.csv", ["Tiempo", "Temperatura (Muestra 1)"], 
                  list(zip(time_data, temp1_data)))
    
    save_csv_file("temperatura_muestra2.csv", ["Tiempo", "Temperatura (Muestra 2)"], 
                  list(zip(time_data, temp2_data)))
    
    save_csv_file("temperatura_muestra3.csv", ["Tiempo", "Temperatura (Muestra 3)"], 
                  list(zip(time_data, temp3_data)))
    
    save_csv_file("temperatura_cubesat.csv", ["Tiempo", "Temperatura (cubesat)"], 
                  list(zip(time_data, temp_cubesat_data)))
    
    # Generar y guardar datos de aceleración
    accel_x_data, accel_y_data, accel_z_data = generate_acceleration_data()
    save_csv_file("aceleracion.csv", ["Tiempo", "Aceleración X", "Aceleración Y", "Aceleración Z"], 
                  list(zip(time_data, accel_x_data, accel_y_data, accel_z_data)))
    
    # Generar y guardar datos de presión
    pressure_data = generate_pressure_data()
    save_csv_file("presion.csv", ["Tiempo", "Presión"], 
                  list(zip(time_data, pressure_data)))
    
    # Generar y guardar datos de giroscopio
    gyro_x_data, gyro_y_data, gyro_z_data = generate_gyroscope_data()
    save_csv_file("giroscopio_xyz.csv", ["Tiempo", "Giro X (Roll)", "Giro Y (Pitch)", "Giro Z (Yaw)"], 
                  list(zip(time_data, gyro_x_data, gyro_y_data, gyro_z_data)))
    
    print("\n¡Todos los archivos CSV han sido generados exitosamente!")
    print(f"Los archivos se encuentran en el directorio: {CSV_DIR}/")

if __name__ == "__main__":
    main()
