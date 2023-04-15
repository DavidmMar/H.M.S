cmake_minimum_required(VERSION 3.5)
project(MQTTSub VERSION 1.0.0 LANGUAGES C)

find_package(eclipse-paho-mqtt-c REQUIRED)

add_executable(MQTTSub MQTTSub.c)
target_link_libraries(MQTTVersion eclipse-paho-mqtt-c::paho-mqtt3as) 