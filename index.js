const express = require("express")
const cookieParser = require("cookie-parser")

const dbConnector = require("./config/db")
const authRouter = require("./routes/auth")
const playRouter = require('./routes/plays')
const indexRouter = require("./routes/index")

const app = express()

dbConnector()
  .then(() => {
    const config = require("./config/config")
    require("./config/express")(app)

    app.use(cookieParser())

    app.use("/", authRouter)
    app.use('/', playRouter)
    app.use("/", indexRouter)

    app.listen(
      config.development.port,
      console.log(`Port *${config.development.port}* is ready!`))
})
.catch(console.error)