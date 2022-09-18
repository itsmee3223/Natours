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

const app = express();
app.enable("trust proxy");
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

module.exports = app;
