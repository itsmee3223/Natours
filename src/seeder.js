const fs = require("fs");
const path = require("path");

const connectDB = require("../config/database/db.mongo");
require("dotenv").config({
  path: path.join(__dirname, "../config/.env"),
});

const Tour = require("./models/Tour.schema");
const User = require("./models/User.schema");
const Review = require("./models/Review.schema");

const tours = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/tours.json"), "utf-8")
);
const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/users.json"), "utf-8")
);
const reviews = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/reviews.json"), "utf-8")
);

const importData = async () => {
  try {
    await connectDB();
    await Tour.create(tours);
    await User.create(users);
    await Review.create(reviews);
    console.info("Data imported....");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await connectDB();
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.info("Data deleted....");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

process.argv[2] === "-d" ? deleteData() : importData();
