package hms;

import org.eclipse.paho.client.mqttv3.*;

public class MqttSubscriber {

    public static void run() {
        String broker = "tcp://xxx:xxx";
        String clientId = "hms_server";

        MqttClient client = connect(broker, clientId);

        client.setCallback(new MqttCallback() {

            @Override
            public void connectionLost(Throwable throwable) {
                System.out.println("connectionLost: " + throwable.getMessage());
            }

            @Override
            public void deliveryComplete(IMqttDeliveryToken iMqttDeliveryToken) {
                System.out.println("deliveryComplete: " + iMqttDeliveryToken.isComplete());
            }

            @Override
            public void messageArrived(String topic, MqttMessage msg) throws Exception {
                System.out.println("topic: " + topic);
                System.out.println("qos: " + msg.getQos());
                System.out.println("message content: " + new String(msg.getPayload()));

                RethinkdbDriver.storeMessage(topic, new String(msg.getPayload()));
            }
        });

        String topic = "Test";
        int qos = 0;

        try {
            client.subscribe(topic, qos);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private static MqttClient connect(String broker, String clientId) {
        try {
            MqttClient client = new MqttClient(broker, clientId);
            MqttConnectOptions options = new MqttConnectOptions();
            client.connect(options);

            return client;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }
}
