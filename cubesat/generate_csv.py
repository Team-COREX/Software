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
# Asegurar que los CSV siempre se escriban dentro del directorio del proyecto (junto al script)
# Esto evita que al ejecutar el script desde la raíz se creen archivos fuera de `cubesat/csv_data`.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_DIR = os.path.join(BASE_DIR, "csv_data")

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

# ===================== NUEVOS GENERADORES DE ENERGÍA ===================== #

def generate_voltage_data():
    """Generar datos de voltaje de bus simulando ciclos de descarga/recarga."""
    max_voltage = 5.0
    min_voltage = 3.7
    current_voltage = max_voltage
    charging = False
    voltage_data = []
    for i in range(TOTAL_POINTS):
        time_progress = i / TOTAL_POINTS
        noise = (random.random() - 0.5) * 0.02
        if charging:
            current_voltage += 0.0003
            if current_voltage >= max_voltage:
                current_voltage = max_voltage
                charging = False
        else:
            current_voltage -= 0.0001
            if current_voltage <= min_voltage:
                charging = True
        activity_drop = 0.1 if math.sin(time_progress * math.pi * 8) > 0.7 else 0
        voltage_data.append(current_voltage + noise - activity_drop)
    return voltage_data

def generate_current_and_power_data(voltage_data):
    """Generar corriente y potencia del bus con picos de actividad."""
    current_data = []
    power_data = []
    for i in range(TOTAL_POINTS):
        time_progress = i / TOTAL_POINTS
        base = 0.8 + math.sin(time_progress * math.pi * 6) * 0.1
        noise = (random.random() - 0.5) * 0.05
        spike = (random.random() * 0.7) if random.random() > 0.999 else 0
        current = max(0.3, base + noise + spike)
        current_data.append(current)
        v = voltage_data[i] if i < len(voltage_data) else 5.0
        power_data.append(v * current)
    return current_data, power_data

def generate_cell_data(current_data):
    """Generar voltajes por celda (5 en serie) y corriente común de celdas."""
    cell_voltages = [[] for _ in range(5)]
    cell_currents = []
    for i in range(TOTAL_POINTS):
        soc = 0.5 + math.sin((i / TOTAL_POINTS) * math.pi * 2) * 0.4  # 0-1
        for c in range(5):
            base_cell = 3.7 + soc * 0.5  # 3.7 a ~4.2
            imbalance = (c - 2) * 0.01
            noise = (random.random() - 0.5) * 0.01
            v = max(3.6, min(4.25, base_cell + imbalance + noise))
            cell_voltages[c].append(v)
        # Corriente común (serie) + pequeño ruido de medición
        if i < len(current_data):
            cell_currents.append(current_data[i] + (random.random() - 0.5) * 0.02)
        else:
            cell_currents.append(0.8)
    return cell_voltages, cell_currents

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

    # ===================== NUEVOS ARCHIVOS DE ENERGÍA ===================== #
    voltage_data = generate_voltage_data()
    current_data, power_data = generate_current_and_power_data(voltage_data)
    cell_voltages, cell_currents = generate_cell_data(current_data)

    # Voltaje bus
    save_csv_file("voltaje_bus.csv", ["Tiempo", "Voltaje (V)"], list(zip(time_data, voltage_data)))
    # Corriente bus
    save_csv_file("corriente_bus.csv", ["Tiempo", "Corriente (A)"], list(zip(time_data, current_data)))
    # Potencia bus
    save_csv_file("potencia_bus.csv", ["Tiempo", "Potencia (W)"], list(zip(time_data, power_data)))
    # Voltajes de celdas (una fila: Time, Celda1..Celda5)
    save_csv_file("celdas_voltajes.csv", ["Tiempo", "Celda1 (V)", "Celda2 (V)", "Celda3 (V)", "Celda4 (V)", "Celda5 (V)"],
                  list(zip(time_data, cell_voltages[0], cell_voltages[1], cell_voltages[2], cell_voltages[3], cell_voltages[4])))
    # Corriente de celdas (igual a bus en serie)
    save_csv_file("celdas_corriente.csv", ["Tiempo", "Corriente Serie (A)"], list(zip(time_data, cell_currents)))

    # ===================== RIELES DE POTENCIA (3 railes) ===================== #
    # Railes típicos: 5V, 3.3V, 12V (ejemplo). Cada uno con ligeras variaciones y picos.
    rail_nominal = [5.0, 3.3, 12.0]
    rail_voltages = [[], [], []]
    rail_currents = [[], [], []]
    rail_powers = [[], [], []]
    for i in range(TOTAL_POINTS):
        tp = i / TOTAL_POINTS
        activity = math.sin(tp * math.pi * 6)
        for r in range(3):
            base_v = rail_nominal[r]
            variance = 0.02 if r < 2 else 0.03  # 2% para 5V y 3.3V, 3% para 12V
            noise_v = base_v * variance * (random.random() - 0.5)
            rail_v = base_v + noise_v
            base_current = [0.6, 0.4, 0.2][r]
            current_noise = base_current * 0.15 * (random.random() - 0.5)
            spike = (random.random() > 0.9995) * base_current * 1.2
            rail_i = max(0.05, base_current + current_noise + spike + 0.05 * activity)
            rail_p = rail_v * rail_i
            rail_voltages[r].append(rail_v)
            rail_currents[r].append(rail_i)
            rail_powers[r].append(rail_p)

    save_csv_file(
        "rails_voltajes.csv",
        ["Tiempo", "Rail1_V", "Rail2_V", "Rail3_V"],
        list(zip(time_data, rail_voltages[0], rail_voltages[1], rail_voltages[2]))
    )
    print("Rails voltajes generado")
    save_csv_file(
        "rails_corrientes.csv",
        ["Tiempo", "Rail1_I", "Rail2_I", "Rail3_I"],
        list(zip(time_data, rail_currents[0], rail_currents[1], rail_currents[2]))
    )
    print("Rails corrientes generado")
    save_csv_file(
        "rails_potencias.csv",
        ["Tiempo", "Rail1_P", "Rail2_P", "Rail3_P"],
        list(zip(time_data, rail_powers[0], rail_powers[1], rail_powers[2]))
    )
    print("Rails potencias generado")
    
    print("\n¡Todos los archivos CSV han sido generados exitosamente!")
    print(f"Los archivos se encuentran en el directorio: {CSV_DIR}/")

if __name__ == "__main__":
    main()
