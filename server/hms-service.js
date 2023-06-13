const router = require("express").Router()
const { table } = require("rethinkdb")
const db = require("./db")

module.exports = {
    listDb,
    listTables,
    listData,
    listDataByTime,
    getDataFeed
}

function listDb() {
    return db.listDb()
}

function listTables(dbName) {
    return db.listTables(dbName)
}

function listData(dbName, tableName) {
    return db.listData(dbName, tableName)
}

async function listDataByTime(dbName, tableName) {
    return db.listDataByTime(dbName, tableName)
}

function getDataFeed(dbName, tableName) {
    return db.getDataFeed(dbName, tableName)
}