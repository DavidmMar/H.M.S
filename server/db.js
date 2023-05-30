require("dotenv").config()

const r = require("rethinkdb")

async function connect(dbName) {
    try {
        return await r.connect({ host: process.env.DB_IP, port: process.env.DB_PORT, db: dbName})
    } catch (error) {
        console.log(error);
    }
}

async function createTable(dbName, tableName) {
    const conn = await connect(dbName)
    r.db(dbName).tableCreate(tableName).run(conn, function (err, res) {
        if (err) throw err
        console.log(JSON.stringify(res, null, 2));
    })
    conn.close()
}