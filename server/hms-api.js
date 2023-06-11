const router = require("express").Router()
const service = require("./hms-service")

router.get("/", (req, res, next) => {
    res.send("Hello!")
})

router.get("/db", (req, res, next) => {
    service.listDb()
        .then(list => res.json(list))
        .catch(next)
})

router.get("/db/:dbName/tables", (req, res, next) => {
    service.listTables(req.params.dbName)
        .then(list => res.json(list))
        .catch(next)
})

router.get("/db/:dbName/tables/:tableName/data", (req, res, next) => {
    service.listData(req.params.dbName, req.params.tableName)
        .then(list => res.json(list))
        .catch(next)
})


module.exports = router