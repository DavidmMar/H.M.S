require("dotenv").config()

const mqtt = require('mqtt')
const client  = mqtt.connect([{ host: process.env.HOST_IP, port: 1883 }])

client.on('connect', function () {
  client.subscribe('test/topic', function (err) {
    if (!err) {
      console.log("no error!\n");
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
})