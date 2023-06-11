const router = require("express").Router()
const db = require("./db")

module.exports = {
    listDb,
    listTables,
    listData,
    listDataByTime
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