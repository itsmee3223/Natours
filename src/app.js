const path = require("path");

const express = require("express");
require("dotenv").config({
  path: path.join(__dirname, "./config/.env"),
});

const cors = require("cors");
const hpp = require("hpp");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const xss = require("xss-clean");
const morgan = require("morgan");
const compression = require("compression");

const errorHandlerMiddleware = require("./middleware/errorHandler");
const notFoundMiddleware = require("./middleware/notFound");

const tourRoutes = require("./routes/tour.routes");
const userRoutes = require("./routes/user.routes");

const app = express();
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "../public")));
app.set("views", path.join(__dirname, "views"));
app.enable("trust proxy");
process.env.NODE_ENV === "development"
  ? app.use(morgan("dev"))
  : app.use(morgan("short"));
app.use(cors());
const limiter = rateLimit({
  max: 100,
  windowsMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(limiter);
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "./public")));

// app.use("/", viewRouter);
app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/users", userRoutes);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
