const router = require("express").Router()
const { table } = require("rethinkdb")
const db = require("./hms-db")
const utils = require("./utils.js")

module.exports = {
    listDb,
    listTables,
    listData,
    listDataByTime,
    listDataType,
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

function listDataType(dbName, tableName, dataType) {
    return db.listDataType(dbName, tableName, dataType)
        .then(dataList => {
            if(dataList == undefined) return utils.rejectPromise(404, "No such data type")
            return dataList
        })
}

function getDataFeed(dbName, tableName) {
    return db.getDataFeed(dbName, tableName)
}