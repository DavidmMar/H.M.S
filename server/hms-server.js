const express = require("express")
const router = require("./hms-api")
const website = require("./hms-website")

/**
 * @param {Express} app 
 */
module.exports = function (app) {
    app.set("view engine", "hbs")

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(express.static("public"))
    app.use(require("cookie-parser")())
    app.use(require("express-session")({ secret: "keyboard cat", resave: true, saveUninitialized: true }))

    app.use("/api", router)
    app.use("/", website)
}