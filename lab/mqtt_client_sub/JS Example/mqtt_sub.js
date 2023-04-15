const mqtt = require('mqtt')
const client  = mqtt.connect([{ host: 'localhost', port: 1883 }])

client.on('connect', function () {
  client.subscribe('presence', function (err) {
    if (!err) {
      console.log("no error!\n");
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  client.end()
})