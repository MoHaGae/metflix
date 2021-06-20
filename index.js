/**
 * module import
 */
const express = require("express");
const session = require("express-session");
const morgan = require("morgan");

const globalRouter = require("./routers/globalRouter");
const userRouter = require("./routers/userRouter");
const fileRouter = require("./routers/fileRouter");
const log = require("./util/logger");

/**
 * express 세팅
 */
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "Ssok2as@$!ssds@#aaxcBP$sd",
    resave: false,
    saveUninitialized: false,
  })
);

/**
 * 라우팅
 */
app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/file", fileRouter);
 
app.listen(PORT, () => {
  log.info(`✅ Server Listen: http://localhost:${PORT}`);
});

module.exports = app;