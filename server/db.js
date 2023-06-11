require("dotenv").config()

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

}

const r = require("rethinkdb")

function connect(dbName) {
    try {
        return r.connect({ host: process.env.DB_IP, port: process.env.DB_PORT, db: dbName })
    } catch (error) {
        console.log(error);
    }
}

function listDb() {
    let connection = null
    return connect()
        .then(conn => {
            return r.dbList().run(conn, function (err, res) {
                connection = conn
                if (err) console.log(err);
                return res
            })
        })
        .then(res => {
            connection.close()
            return res
        })
}

function createDb(dbName) {
    let connection = null
    return connect(dbName)
        .then(conn => {
            return r.dbCreate(dbName).run(conn, function (err, res) {
                connection = conn
                if (err) console.log(err);
                return res
            })
        })
        .then(res => {
            connection.close()
            return res
        })
}

function deleteDb(dbName) {
    let connection = null
    return connect(dbName)
        .then(conn => {
            return r.dbDrop(dbName).run(conn, function (err, res) {
                connection = conn
                if (err) console.log(err);
                return res
            })
        })
        .then(res => {
            connection.close()
            return res
        })
}

function listTables(dbName) {
    let connection = null
    return connect(dbName)
        .then(conn => {
            return r.db(dbName).tableList().run(conn, function (err, res) {
                connection = conn
                if (err) console.log(err);
                return res
            })
        })
        .then(res => {
            connection.close()
            return res
        })
}

function createTable(dbName, tableName) {
    let connection = null
    return connect(dbName)
        .then(conn => {
            return r.db(dbName).tableCreate(tableName).run(conn, function (err, res) {
                connection = conn
                if (err) console.log(err);
                return res
            })
        })
        .then(res => {
            connection.close()
            return res
        })
}

function deleteTable(dbName, tableName) {
    let connection = null
    return connect(dbName)
        .then(conn => {
            return r.db(dbName).tableDrop(tableName).run(conn, function (err, res) {
                connection = conn
                if (err) console.log(err);
                return res
            })
        })
        .then(res => {
            connection.close()
            return res
        })
}

function listData(dbName, tableName) {
    let connection = null
    return connect(dbName)
        .then(conn => {
            return r.table(tableName).run(conn, function (err, res) {
                connection = conn
                if (err) console.log(err);
                return res
            })
        })
        .then(res => {
            connection.close()
            let arr = []
            res.each(function (err, row) {
                if (err) throw err
                arr.push(row)
            })
            return arr
        })
}

function listDataByTime(dbName, tableName) {
    let connection = null
    return connect(dbName)
        .then(conn => {
            if (!(hasIndex(dbName, tableName, "timestamp"))) { createIndex(dbName, tableName, "timestamp") }
            else {
                return r.table(tableName).orderBy({ index: "timestamp" }).run(conn, function (err, res) {
                    connection = conn
                    if (err) console.log(err);
                    return res
                })
            }
        })
        .then(res => {
            connection.close()
            let arr = []
            res.each(function (err, row) {
                if (err) throw err
                arr.push(row)
            })
            return arr
        })
}

function insertData(dbName, tableName, data) {
    let connection = null
    return connect(dbName)
        .then(conn => {
            return r.table(tableName).insert(data).run(conn, function (err, res) {
                connection = conn
                if (err) console.log(err);
                return res
            })
        })
        .then(res => {
            connection.close()
            return res
        })
}

function hasIndex(dbName, tableName, indexName) {
    let connection = null
    return connect(dbName)
        .then(conn => {
            return r.table(tableName).indexList().run(conn, function (err, res) {
                connection = conn
                if (err) console.log(err);
                return res
            })
        })
        .then(res => {
            connection.close()
            return res.includes(indexName)
        })
}

function createIndex(dbName, tableName, indexName) {
    let connection = null
    return connect(dbName)
        .then(conn => {
            return r.table(tableName).indexCreate(indexName).run(conn, function (err, res) {
                connection = conn
                if (err) console.log(err);
                return res
            })
        })
        .then(res => {
            connection.close()
            return res
        })
}

async function testFun() {
    // console.log(await listDb())
    // console.log(await listTables("testTopic"));
    // console.log(await deleteTable("test", "testTable"));
    // console.log(await createTable("test", "testTable"));
    // console.log(await listData("testTopic", "electricity"));
    // console.log(await listDataByTime("testTopic", "eletricity"));
    console.log(await hasIndex("testTopic", "electricity", "timestamp"));
    console.log(await createIndex("testTopic", "electricity", "timestamp"));
    console.log(await hasIndex("testTopic", "electricity", "timestamp"));
}

// testFun()