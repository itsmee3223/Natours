const mongoose = require("mongoose");
require("../../src/models/Tour.schema");
require("../../src/models/User.schema");
require("../../src/models/Review.schema");

const conncetDB = async () => {
  const connect = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(`MonogDB Connected ${connect.connection.host}`);
};

module.exports = conncetDB;
