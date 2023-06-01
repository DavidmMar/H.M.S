const db = require("../db.js")

test("create a db", async () => {
    const res = await db.createDb("jestTest")
    expect(res["dbs_created"]).toBe(1)
})