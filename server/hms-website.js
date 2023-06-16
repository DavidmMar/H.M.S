const express = require("express")
const router = express.Router()
const service = require("./hms-service")
const utils = require("./utils.js")

router.get("/", (req, res) => { res.render("index") })
router.get("/db", getDbList)
router.get("/db/:dbName/tables", getTableList)
router.get("/db/:dbName/tables/:tableName/data", getData)
router.get("/db/:dbName/tables/:tableName/data/:dataType", getSingleData)

function getDbList(req, res, next) {
    service
        .listDb()
        .then(dbList => {
            dbList = dbList.map(db => {
                return {
                    "dbName": db,
                    "path": `/db/${db}/tables`
                }
            })
            return res.render("dbs", { "dbList": dbList })
        })
        .catch(next)
}

function getTableList(req, res, next) {
    service
        .listTables(req.params.dbName)
        .then(tableList => {
            tableList = tableList.map(table => {
                return {
                    "tableName": table,
                    "path": `/db/${req.params.dbName}/tables/${table}/data`
                }
            })
            return res.render("tables", { "tableList": tableList })
        })
        .catch(next)
}

function getData(req, res, next) {
    service
        .listDataByTime(req.params.dbName, req.params.tableName)
        .then(dataList => {
            dataList = utils.removeIds(dataList)
            dataList.map(data => {
                data.timestamp = utils.formatTimestamp(data.timestamp)
                return data
            })

            let keys = Object.keys(dataList[0])
            return res.render("data", {
                "dataList": dataList,
                "keys": keys
            })
        })
        .catch(next)
}

function getSingleData(req, res, next) {
    service
        .listDataByTime(req.params.dbName, req.params.tableName)
        .then(dataList => {
            if (!(Object.keys(dataList[0]).includes(req.params.dataType))) res.send("Data Type not available")
            let validKeys = [req.params.dataType, "timestamp"]
            dataList = utils.removeIds(dataList)
            let filteredData = []
            dataList.map(data => {
                let filtered = Object.entries(data).filter(([key]) => validKeys.includes(key))
                filteredData.push(Object.fromEntries(filtered))
            })

            console.log(filteredData);
            let keys = Object.keys(filteredData[0])
            return res.render("data", {
                "dataList": filteredData,
                "keys": keys
            })
        })
        .catch(next)
}

module.exports = router