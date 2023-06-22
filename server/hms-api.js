const router = require("express").Router()
const service = require("./hms-service")

router.get("/", (req, res, next) => {
    res.send("Hello from H.M.S API!")
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
    if (req.query.hour !== undefined && req.query.hour >= 0 && req.query.hour <= 23) {
        service.listDataSpecificHour(req.params.dbName, req.params.tableName, req.query.hour)
            .then(list => res.json(list))
            .catch(next)
    }
    else if(req.query.timespan != undefined) {
        service.listDataTimespan(req.params.dbName, req.params.tableName, req.query.timespan)
            .then(list => res.json(list))
            .catch(next)
    }
    else {
        service.listDataByTime(req.params.dbName, req.params.tableName)
            .then(list => res.json(list))
            .catch(next)
    }
})

router.get("/db/:dbName/tables/:tableName/data/:dataType", (req, res, next) => {
    service.listDataType(req.params.dbName, req.params.tableName, req.params.dataType)
        .then(list => res.json(list))
        .catch(next)
})

// router.get("/db/:dbName/tables/:tableName/data/feed", (req, res, next) => {
//     service.getDataFeed(req.params.dbName, req.params.tableName)
//         .then(aux => res.json(aux))
//         .catch(next)
// })

module.exports = router