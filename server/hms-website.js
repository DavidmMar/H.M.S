const express = require("express")
const router = express.Router()
const service = require("./hms-service")

router.get("/", (req, res) => { res.render("index") })
router.get("/db", getDbList)
router.get("/db/:dbName/tables", getTableList)
router.get("/db/:dbName/tables/:tableName/data", getData)

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
            console.log(dataList);
            return res.render("data", { "dataList": dataList })
        })
        .catch(next)
}
module.exports = router