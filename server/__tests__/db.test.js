const db = require("../hms-db.js")

test("create a db", async () => {
    const res = await db.createDb("jestTest")
    expect(res["dbs_created"]).toBe(1)
})

test("create a table", async () => {
    const res = await db.createTable("jestTest", "jestTable")
    expect(res["tables_created"]).toBe(1)
})

test("delete a table", async () => {
    const res = await db.deleteTable("jestTest", "jestTable")
    expect(res["tables_dropped"]).toBe(1)
})

test("delete a db", async () => {
    const res = await db.deleteDb("jestTest")
    expect(res["dbs_dropped"]).toBe(1)
})
