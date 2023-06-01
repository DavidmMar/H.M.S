require("dotenv").config()

module.exports = {
    connect,
    listDb,
    createDb,
    deleteDb,
    listTables,
    createTable,
    deleteTable,
    getAllDocs,
    insertData

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
    connect()
        .then(conn => {
            let result = null
            r.dbList().run(conn, function (err, res) {
                if (err) console.log(err);
                // console.log(JSON.stringify(res, null, 2));
                console.log("----- end listDb ----- \n");
                result = res
            })
            console.log(result);
            connection = conn
        })
        .then(result => {
            console.log(connection);
            connection.close()
            console.log(result);
            // return res
        })
}

function createDb(dbName) {
    connect(dbName)
        .then(conn => {
            r.dbCreate(dbName).run(conn, function (err, res) {
                if (err) console.log(err);
                console.log(JSON.stringify(res, null, 2));
                console.log("----- end CreateDb ----- \n");
            })
            return conn
        })
        .then((conn, res) => {
            conn.close()
            return res
        })
}

function deleteDb(dbName) {
    connect(dbName)
        .then(conn => {
            r.dbDrop(dbName).run(conn, function (err, res) {
                if (err) console.log(err);
                console.log(JSON.stringify(res, null, 2));
                console.log("----- end dropDB ----- \n");
            })
        })
        .then((conn, res) => {
            conn.close()
            return res
        })
}

function listTables(dbName) {
    connect(dbName)
        .then(conn => {
            r.db(dbName).tableList().run(conn, function (err, res) {
                if (err) throw err
                console.log(JSON.stringify(res, null, 2));
                console.log("----- end listTables ----- \n");
            })
        })
        .then((conn, res) => {
            conn.close()
            return res
        })
}

function createTable(dbName, tableName) {
    connect(dbName)
        .then(conn => {
            r.db(dbName).tableCreate(tableName).run(conn, function (err, res) {
                if (err) console.log(err);
                console.log(JSON.stringify(res, null, 2));
                console.log("----- end createTable ----- \n");
            })
        })
        .then((conn, res) => {
            conn.close()
            return res
        })
}

function deleteTable(dbName, tableName) {
    connect(dbName)
        .then(conn => {
            r.db(dbName).tableDrop(tableName).run(conn, function (err, res) {
                if (err) throw err
                console.log(JSON.stringify(res, null, 2));
                console.log("----- end deleteTable ----- \n");
            })
        })
        .then((conn, res) => {
            conn.close()
            return res
        })
}

function getAllDocs(dbName, tableName) {
    connect(dbName)
        .then(conn => {
            r.table(tableName).run(conn, function (err, res) {
                if (err) throw err
                console.log(JSON.stringify(res, null, 2));
                console.log("----- end getAllDocs ----- \n");
            })
        })
        .then((conn, res) => {
            conn.close()
            return res
        })
}

function insertData(dbName, tableName, data) {
    connect(dbName)
        .then(conn => {
            r.table(tableName).insert(data).run(conn, function (err, res) {
                if (err) throw err
                console.log(JSON.stringify(res, null, 2));
                console.log("----- end insertData ----- \n");
            })
            return conn
        })
        .then((conn, res) => {
            conn.close()
            return res
        })
}



function testFun() {
    // deleteDb("jestTest")
    listDb();
    // createDb("test3");
    // listDb();
    // listTables("test")
    // createTable("test", "testTable2");
    // listTables("test")
    // deleteTable("test", "testTable2")
    // listTables("test")
    // insertData("test", "testTable", {data: 2})
    // getAllDocs("test", "testTable");
}

testFun()