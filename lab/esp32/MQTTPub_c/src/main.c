#include <stdio.h>
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_wifi.h"
#include "esp_system.h"
#include "esp_event.h"
#include "esp_log.h"
#include "nvs_flash.h"
#include "esp_netif.h"
#include "lwip/sockets.h"
#include "lwip/netdb.h"

#define WIFI_SSID "DM"
#define WIFI_PASS "novilho123"
#define MQTT_BROKER_IP "194.210.198.50"
#define MQTT_BROKER_PORT 1883
#define MQTT_TOPIC "test/topic"
#define MQTT_MESSAGE "Hello, MQTT!"

static const char *TAG = "MQTT Client";

void wifi_event_handler(void *arg, esp_event_base_t event_base, int32_t event_id, void *event_data)
{
    if (event_id == WIFI_EVENT_STA_START)
    {
        esp_wifi_connect();
        ESP_LOGI(TAG, "Connecting to WiFi...");
    }
    else if (event_id == WIFI_EVENT_STA_CONNECTED)
    {
        ESP_LOGI(TAG, "Connected to WiFi");
    }
    else if (event_id == WIFI_EVENT_STA_DISCONNECTED)
    {
        esp_wifi_connect();
        ESP_LOGI(TAG, "Disconnected from WiFi. Reconnecting...");
    }
}

void wifi_init_sta()
{
    ESP_ERROR_CHECK(esp_netif_init());
    ESP_ERROR_CHECK(esp_event_loop_create_default());
    esp_netif_create_default_wifi_sta();

    wifi_init_config_t wifi_cfg = WIFI_INIT_CONFIG_DEFAULT();
    ESP_ERROR_CHECK(esp_wifi_init(&wifi_cfg));
    ESP_ERROR_CHECK(esp_event_handler_register(WIFI_EVENT, ESP_EVENT_ANY_ID, &wifi_event_handler, NULL));
    ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_STA));

    wifi_config_t wifi_config = {
        .sta = {
            .ssid = WIFI_SSID,
            .password = WIFI_PASS}};
    ESP_ERROR_CHECK(esp_wifi_set_config(ESP_IF_WIFI_STA, &wifi_config));
    ESP_ERROR_CHECK(esp_wifi_start());
}

void mqtt_publish_task(void *pvParameters)
{
    int sock = -1;
    struct sockaddr_in server_address;
    struct hostent *server;

    // Create socket
    sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0)
    {
        ESP_LOGE(TAG, "Failed to create socket. Error %d", errno);
        vTaskDelete(NULL);
        return;
    }

    server = gethostbyname(MQTT_BROKER_IP);
    if (server == NULL)
    {
        ESP_LOGE(TAG, "Failed to get server IP address");
        vTaskDelete(NULL);
        return;
    }

    memset(&server_address, 0, sizeof(server_address));
    server_address.sin_family = AF_INET;
    memcpy(&server_address.sin_addr.s_addr, server->h_addr, server->h_length);
    server_address.sin_port = htons(MQTT_BROKER_PORT);

    // Connect to the server
    if (connect(sock, (struct sockaddr *)&server_address, sizeof(server_address)) < 0)
    {
        ESP_LOGE(TAG, "Failed to connect to server. Error %d", errno);
        vTaskDelete(NULL);
        return;
    }

    // Build MQTT PUBLISH packet
    char publish_packet[256];
    memset(publish_packet, 0, sizeof(publish_packet));
    snprintf(publish_packet, sizeof(publish_packet), "PUBLISH %s %s", MQTT_TOPIC, MQTT_MESSAGE);

    // Send MQTT PUBLISH packet
    if (send(sock, publish_packet, strlen(publish_packet), 0) < 0)
    {
        ESP_LOGE(TAG, "Failed to send MQTT PUBLISH packet. Error %d", errno);
        vTaskDelete(NULL);
        return;
    }

    ESP_LOGI(TAG, "MQTT message sent successfully");

    close(sock);

    vTaskDelete(NULL);
}

void app_main()
{
    ESP_ERROR_CHECK(nvs_flash_init());
    wifi_init_sta();

    xTaskCreate(mqtt_publish_task, "mqtt_publish", 4096, NULL, 5, NULL);
}