import { Application } from "express"
module.exports = (app: Application) => {
    // * Bind routes to application
    app.use("/auth", require("./auth"))
    app.use("/classes", require("./classes"))
}
