const mongoose = require("mongoose");

let databaseURI = process.env.DB;

mongoose
  .connect(databaseURI, {
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => console.log("Database is connected!"));
