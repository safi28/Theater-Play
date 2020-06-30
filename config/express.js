const express = require("express")
const expressHanlebars = require("express-handlebars")

module.exports = (app) => {
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.engine(".hbs", expressHanlebars({ extname: ".hbs" }))
  app.set("view engine", ".hbs")
  app.use("/static", express.static("static"))
}
