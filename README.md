![poster](docs/imgs/cG08.png)

# H.M.S  - Home Monitoring System

## Intro
The objective of this project is to design and prototype an IoT system that measures the electrical consumption of a home, supplied by photovoltaic panels. The system provides the user with simple access to energy consumption information and analytics. The energy consumption is obtained from a custom wireless IoT sensor node installed on the electrical panel of a house. This node also provides electrical energy production from solar panels and environment data. The sensor data is communicated over the Internet to an IoT server that hosts a database to record the measurements. An API was implemented for accessing the data storage and a simple Web
application was created to provide a user-friendly interface to access the information collected,
including analytics.

The sensor node uses a current transformer with a PZEM004T module to obtain the eletrical readings and a DHT11 sensor to obtain the environment data. It alsos uses a microcontroller, ESP32-S2, to communicate with the server, using C++ language and the arduino framework.

The server was implemented using JavaScript and the Express framework, HTML, CSS and Handlebars templating language. For the database it was used the RethinkDB.

For the communication between the two, it was used the MQTT communication protocol and the MQTT Mosquitto broker on the server side.


This project was done in the context of Final Project (Project and Seminar course unit) in Undergraduate in Computer Science and Computer Engineering. Despite being started in an academic context, the idea is to continue its development.


## Table of Contents
- [H.M.S  - Home Monitoring System](#hms----home-monitoring-system)
  - [Intro](#intro)
  - [Table of Contents](#table-of-contents)
  - [Versions](#versions)
  - [Installation Guide](#installation-guide)
    - [Node Sensor](#node-sensor)
      - [Prerequisites](#prerequisites)
    - [Server](#server)
  - [Features](#features)
  - [Contact](#contact)

## Versions
The fpd (final project delivery) branch and tag represent the state of the project when delivered for evaluation for the Project and Seminar course unit, along with the final report (rfG08).

Subsequent tags or branches will be for the following development of the project.

## Installation Guide

### Node Sensor
#### Prerequisites
- ESP32-S2 Saola 1 board
- DHT11 Sensor
- PZEM004T-V3
- 2 resistors (1k ohm and 2k ohm)
- Cables
  
Connect them the following way:
![](/docs/imgs/sensor_node.png)

After assembling the system, you need to create a file in “/node_sensor/src” called credentials.h with the following lines, where the values are substituted with the real credentials:
````
#define SSID “myssid”
#define PWD “mypwd”
#define MQTT_SERVER “mqqt_ipaddress”
````
After that its necessary to build the code and upload it to the ESP32, and to connect the split current transformer around the cable to measure.

### Server
For the server, it necessary to have installed the mosquito broker (https://mosquitto.org/download/). Before running it, it’s necessary to change the mosquito.conf file present in the installation folder, writing the following line:
``````
listener 1883
allow_anonymous true
``````

After that, open the command line interface in the installation folder and run the following command:
``````
mosquitto -c mosquitto.conf -v
``````

Finally, its necessary to run the client, by running the following command on a command line interface on the “server” folder:
``````
node index.js
``````

After that, the server its ready at www.localhost:8080.

## Features
- Eletrical readings with minimum 60 ms between each
- Temperature and humidity readings with minimum 25 ms between each
- Local database to see the readings in real time
- API to access the readings
- Web App to present the readings to the user
- Different filters both in API and Web App
  - Specific hour
  - Hourly median
  - Daily median

## Contact
Reach out to me through my email:
davidmm@live.com.pt

