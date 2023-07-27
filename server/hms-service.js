const router = require("express").Router();
const db = require("./hms-db");
const utils = require("./utils.js");

module.exports = {
  listDb,
  listTables,
  listData,
  listDataByTime,
  listDataType,
  listDataSpecificHour,
  listDataTimespan,
};

function listDb() {
  return db.listDb();
}

function listTables(dbName) {
  return db.listTables(dbName);
}

function listData(dbName, tableName) {
  return db.listData(dbName, tableName);
}

async function listDataByTime(dbName, tableName) {
  return db.listDataByTime(dbName, tableName);
}

function listDataType(dbName, tableName, dataType) {
  return db.listDataType(dbName, tableName, dataType).then((dataList) => {
    if (dataList == undefined)
      return utils.rejectPromise(404, "No such data type");
    return dataList;
  });
}

function listDataSpecificHour(dbName, tableName, hour) {
  return db.listDataByTime(dbName, tableName).then((dataList) => {
    console.log(dataList);
    let filteredData = [];
    dataList.map((data) => {
      let dataHour = utils.separateTimestamp(data.timestamp).hour;
      if (dataHour == hour) {
        console.log(data);
        filteredData.push(data);
      }
      return data;
    });

    console.log(filteredData);
    return filteredData;
  });
}

async function listDataTimespan(dbName, tableName, timespan) {
  if (timespan == "hourly") {
    let dataList = await db.listDataByTime(dbName, tableName);

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
    return timespanedData;
  }
  if (timespan == "daily") {
    let dataList = await db.listDataByTime(dbName, tableName);
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
    return timespanedData
  }
}
