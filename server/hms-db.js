require("dotenv").config();

module.exports = {
  connect,
  listDb,
  createDb,
  deleteDb,
  listTables,
  createTable,
  deleteTable,
  listData,
  listDataByTime,
  insertData,
  listDataType,
  getDataFeed,
};

const r = require("rethinkdb");
const utils = require("./utils.js");
const socketio = require("socket.io");

function connect(dbName) {
  try {
    return r.connect({
      host: process.env.DB_IP,
      port: process.env.DB_PORT,
      db: dbName,
    });
  } catch (error) {
    console.log(error);
  }
}

function listDb() {
  let connection = null;
  return connect()
    .then((conn) => {
      return r.dbList().run(conn, function (err, res) {
        connection = conn;
        if (err) console.log(err);
        return res;
      });
    })
    .then((res) => {
      connection.close();
      return res;
    });
}

function createDb(dbName) {
  let connection = null;
  return connect(dbName)
    .then((conn) => {
      return r.dbCreate(dbName).run(conn, function (err, res) {
        connection = conn;
        if (err) console.log(err);
        return res;
      });
    })
    .then((res) => {
      connection.close();
      return res;
    });
}

function deleteDb(dbName) {
  let connection = null;
  return connect(dbName)
    .then((conn) => {
      return r.dbDrop(dbName).run(conn, function (err, res) {
        connection = conn;
        if (err) console.log(err);
        return res;
      });
    })
    .then((res) => {
      connection.close();
      return res;
    });
}

function listTables(dbName) {
  let connection = null;
  return connect(dbName)
    .then((conn) => {
      return r
        .db(dbName)
        .tableList()
        .run(conn, function (err, res) {
          connection = conn;
          if (err) console.log(err);
          return res;
        });
    })
    .then((res) => {
      connection.close();
      return res;
    });
}

function createTable(dbName, tableName) {
  let connection = null;
  return connect(dbName)
    .then((conn) => {
      return r
        .db(dbName)
        .tableCreate(tableName)
        .run(conn, function (err, res) {
          connection = conn;
          if (err) console.log(err);
          return res;
        });
    })
    .then((res) => {
      connection.close();
      return res;
    });
}

function deleteTable(dbName, tableName) {
  let connection = null;
  return connect(dbName)
    .then((conn) => {
      return r
        .db(dbName)
        .tableDrop(tableName)
        .run(conn, function (err, res) {
          connection = conn;
          if (err) console.log(err);
          return res;
        });
    })
    .then((res) => {
      connection.close();
      return res;
    });
}

function listData(dbName, tableName) {
  let connection = null;
  return connect(dbName)
    .then((conn) => {
      return r.table(tableName).run(conn, function (err, res) {
        connection = conn;
        if (err) console.log(err);
        return res;
      });
    })
    .then((res) => {
      connection.close();
      let arr = [];
      res.each(function (err, row) {
        if (err) throw err;
        arr.push(row);
      });
      return arr;
    });
}

function listDataByTime(dbName, tableName) {
  let connection = null;
  return connect(dbName)
    .then((conn) => {
      connection = conn;
      return hasIndex(dbName, tableName, "timestamp");
    })
    .then((hasIndex) => {
      if (!hasIndex) {
        return createIndex(dbName, tableName, "timestamp");
      }
    })
    .then(() => {
      return r
        .table(tableName)
        .indexWait("timestamp")
        .run(connection, function (err, res) {
          if (err) console.log(err);
          return res;
        });
    })
    .then(() => {
      return r
        .table(tableName)
        .orderBy({ index: r.desc("timestamp") })
        .run(connection, function (err, res) {
          if (err) console.log(err);
          return res;
        });
    })
    .then((res) => {
      connection.close();
      let arr = [];
      res.each(function (err, row) {
        if (err) throw err;
        arr.push(row);
      });
      return arr;
    });
}

function insertData(dbName, tableName, data) {
  let connection = null;
  return connect(dbName)
    .then((conn) => {
      return r
        .table(tableName)
        .insert(data)
        .run(conn, function (err, res) {
          connection = conn;
          if (err) console.log(err);
          return res;
        });
    })
    .then((res) => {
      connection.close();
      return res;
    });
}

function hasIndex(dbName, tableName, indexName) {
  let connection = null;
  return connect(dbName)
    .then((conn) => {
      return r
        .table(tableName)
        .indexList()
        .run(conn, function (err, res) {
          connection = conn;
          if (err) console.log(err);
          return res;
        });
    })
    .then((res) => {
      connection.close();
      return res.includes(indexName);
    });
}

function createIndex(dbName, tableName, indexName) {
  let connection = null;
  return connect(dbName)
    .then((conn) => {
      return r
        .table(tableName)
        .indexCreate(indexName)
        .run(conn, function (err, res) {
          connection = conn;
          if (err) console.log(err);
          return res;
        });
    })
    .then((res) => {
      connection.close();
      return res;
    });
}

async function listDataType(dbName, tableName, dataType) {
  const dataList = await listDataByTime(dbName, tableName);

  if (!Object.keys(dataList[0]).includes(dataType)) return undefined;
  let validKeys = [dataType, "timestamp"];
  let filteredData = [];
  dataList.map((data) => {
    let filtered = Object.entries(data).filter(([key]) =>
      validKeys.includes(key)
    );
    filteredData.push(Object.fromEntries(filtered));
  });

  return filteredData;
}

function getDataFeed(dbName, tableName) {
  let connection = null;
  return connect(dbName)
    .then((conn) => {
      if (!hasIndex(dbName, tableName, "timestamp")) {
        createIndex(dbName, tableName, "timestamp");
      }
      return r
        .table(tableName)
        .orderBy({ index: r.desc("timestamp") })
        .changes()
        .run(conn, function (err, cursor) {
          connection = conn;
          if (err) console.log(err);
          return cursor;
        });
    })
    .then((cursor) => {
      const io = new socketio.Server(8080);
      cursor.each(
        function (err, row) {
          if (err) throw err;
          console.log(row);
          io.emit("message", row);
          return row;
        },
        function () {
          connection.close();
          return;
        }
      );
    });
}
