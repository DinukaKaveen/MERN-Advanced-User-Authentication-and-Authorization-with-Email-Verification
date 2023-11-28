require("dotenv").config();
const express = require("express");
const { default: mongoose } = require("mongoose");

const app = express();

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("DB Connected Successfully");
  })
  .catch((err) => {
    console.log("DB Connection Error: ", err);
  });

app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}`);
});
