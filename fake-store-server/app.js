var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/swagger/swaggerDoc");
var cors = require('cors');

const { getFakeStoreData } = require("./src/db/fakeStoreData");
// var indexRouter = require("./src/routes/index");
var usersRouter = require("./src/routes/users");
var ordersRouter = require("./src/routes/orders");
const cartRouter = require("./src/routes/cart");
const productRouter = require("./src/routes/product");
var app = express();

// Enable CORS
app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use("/", indexRouter);
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});
app.use("/users", usersRouter);
app.use("/orders", ordersRouter);
app.use("/cart", cartRouter);
app.use("/products", productRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

if (process.env.NODE_ENV !== "test") {
  setTimeout(() => {
    console.log(
      "\x1b[32m%s\x1b[0m",
      "\nFake store server started. Visit http://localhost:3000/ for API documentation.\n"
    );
  }, 1000);
}

module.exports = app;
