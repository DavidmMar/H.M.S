#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "MQTTClient.h"
 
#define ADDRESS     "127.0.0.1:1883"
#define CLIENTID    "MQTTSub"
#define TOPIC       "test"
#define PAYLOAD     "ACK"
#define QOS         0
#define TIMEOUT     10000L