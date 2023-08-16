require("dotenv").config()


const mqtt = require('mqtt')
const client = mqtt.connect([{ host: process.env.HOST_IP, port: 1883 }])
const topic = "demo"

const db = require("./hms-db")

const express = require("express")
const app = express()
require("./hms-server")(app)
const PORT = 8080

client.on('connect', function () {
  client.subscribe(topic, async function (err) {
    let dbList = await db.listDb()

    if (!(dbList.includes(topic))) {
      await db.createDb(topic)
    }

    if (!err) {
      console.log(`Subscribed to ${topic}!\n`);
    }
  })
})

client.on('message', async function (topic, message) {
  let res = JSON.parse(message.toString());
  let tableList = await db.listTables(topic)

  if (!(tableList.includes(res.sensor))) {
    console.log("Creating table " + res.sensor + " for the first time!\n");
    await db.createTable(topic, res.sensor)
  }

  db.insertData(topic, res.sensor, res.data)
})

app.listen(PORT, () => {
  console.log("Listening on port: " + PORT);
})