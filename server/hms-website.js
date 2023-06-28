const express = require("express");
const router = express.Router();
const service = require("./hms-service");
const utils = require("./utils.js");

router.get("/", (req, res) => {
  res.render("index");
});
router.get("/db", getDbList);
router.get("/db/:dbName/tables", getTableList);
router.get("/db/:dbName/tables/:tableName/data", getData);
router.get("/db/:dbName/tables/:tableName/data/:dataType", getDataType);

function getDbList(req, res, next) {
  service
    .listDb()
    .then((dbList) => {
      dbList = dbList.map((db) => {
        return {
          dbName: db,
          path: `/db/${db}/tables`,
        };
      });
      return res.render("dbs", { dbList: dbList });
    })
    .catch(next);
}

function getTableList(req, res, next) {
  service
    .listTables(req.params.dbName)
    .then((tableList) => {
      tableList = tableList.map((table) => {
        return {
          tableName: table,
          path: `/db/${req.params.dbName}/tables/${table}/data`,
        };
      });
      return res.render("tables", { tableList: tableList });
    })
    .catch(next);
}

function getData(req, res, next) {
  try {
    if (
      req.query.hour !== undefined &&
      req.query.hour >= 0 &&
      req.query.hour <= 23
    ) {
      service
        .listDataByTime(req.params.dbName, req.params.tableName)
        .then((dataList) => {
          dataList = utils.removeIds(dataList);
          let filteredData = [];
          dataList.map((data) => {
            let dataHour = utils.separateTimestamp(data.timestamp).hour;
            data.timestamp = utils.formatTimestamp(data.timestamp);
            if (dataHour == req.query.hour) {
              filteredData.push(data);
            }
            return data;
          });

          return res.render("data", {
            dbName: req.params.dbName,
            tableName: req.params.tableName,
            dataList: filteredData.length == 0 ? dataList : filteredData,
            keys:
              filteredData.length == 0
                ? Object.keys(dataList[0])
                : Object.keys(filteredData[0]),
          });
        })
        .catch(next);
    } else if (
      req.query.timespan !== undefined &&
      req.query.timespan == "hourly"
    ) {
      service
        .listDataByTime(req.params.dbName, req.params.tableName)
        .then((dataList) => {
          dataList = utils.removeIds(dataList);
          let timespanedData = [];
          let prevHour = utils.separateTimestamp(dataList[0].timestamp).hour;
          let amount = 1;
          let obj = dataList.shift();

          for (let index = 0; index < dataList.length; index++) {
            let data = dataList[index];
            if (utils.separateTimestamp(data.timestamp).hour == prevHour) {
              amount++;
              for (let key in data) {
                if (key != "timestamp") obj[key] += data[key];
              }
            }

            if (
              utils.separateTimestamp(data.timestamp).hour != prevHour ||
              index == dataList.length - 1
            ) {
              for (let key in obj) {
                if (key != "timestamp") obj[key] /= amount;
              }
              // prepare obj
              obj.timestamp = utils.separateTimestamp(obj.timestamp);
              obj.timestamp.min = "00";
              obj.timestamp.sec = "00";
              obj.timestamp = utils.formatTimestampFromObj(obj.timestamp);
              timespanedData.push(obj);

              // prepare data
              obj = data;
              prevHour = utils.separateTimestamp(data.timestamp).hour;
              amount = 1;
            }
          }

          return res.render("data", {
            dbName: req.params.dbName,
            tableName: req.params.tableName,
            dataList: timespanedData,
            keys: Object.keys(timespanedData[0]),
          });
        })
        .catch(next);
    } else if (
      req.query.timespan !== undefined &&
      req.query.timespan == "daily"
    ) {
      service
        .listDataByTime(req.params.dbName, req.params.tableName)
        .then((dataList) => {
          dataList = utils.removeIds(dataList);
          let timespanedData = [];
          let prevDay = utils.separateTimestamp(dataList[0].timestamp).day;
          let amount = 1;
          let obj = dataList.shift();

          for (let index = 0; index < dataList.length; index++) {
            let data = dataList[index];
            if (utils.separateTimestamp(data.timestamp).day == prevDay) {
              amount++;
              for (let key in data) {
                if (key != "timestamp") obj[key] += data[key];
              }
            }

            if (
              utils.separateTimestamp(data.timestamp).day != prevDay ||
              index == dataList.length - 1
            ) {
              for (let key in obj) {
                if (key != "timestamp") obj[key] /= amount;
              }
              // prepare obj
              obj.timestamp = utils.separateTimestamp(obj.timestamp);
              obj.timestamp.hour = "00";
              obj.timestamp.min = "00";
              obj.timestamp.sec = "00";
              obj.timestamp = utils.formatTimestampFromObj(obj.timestamp);
              timespanedData.push(obj);

              // prepare data
              obj = data;
              prevDay = utils.separateTimestamp(data.timestamp).day;
              amount = 1;
            }
          }

          return res.render("data", {
            dbName: req.params.dbName,
            tableName: req.params.tableName,
            dataList: timespanedData,
            keys: Object.keys(timespanedData[0]),
          });
        })
        .catch(next);
    } else {
      service
        .listDataByTime(req.params.dbName, req.params.tableName)
        .then((dataList) => {
          dataList = utils.removeIds(dataList);
          dataList.map((data) => {
            data.timestamp = utils.formatTimestamp(data.timestamp);
            return data;
          });

          let keys = Object.keys(dataList[0]);
          return res.render("data", {
            dbName: req.params.dbName,
            tableName: req.params.tableName,
            dataList: dataList,
            keys: keys,
          });
        })
        .catch(next);
    }
  } catch (error) {
    console.log(error);
  }
}

function getDataType(req, res, next) {
  service
    .listDataType(req.params.dbName, req.params.tableName, req.params.dataType)
    .then((dataList) => {
      dataList.map((data) => {
        data.timestamp = utils.formatTimestamp(data.timestamp);
        return data;
      });

      let keys = Object.keys(dataList[0]);
      return res.render("singleData", {
        dataList: dataList,
        keys: keys,
      });
    })
    .catch(next);
}

module.exports = router;
