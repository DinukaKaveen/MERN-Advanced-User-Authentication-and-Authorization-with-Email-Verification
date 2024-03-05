require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); //body-parser is used to convert json format into javascript object.
const userRoutes = require("./routes/user_routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();

//app MiddleWare
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

// express session
app.use(
  expressSession({
    name: "session",
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB }),
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 1,
      httpOnly: true,
    },
  })
);

//route MiddleWare
app.use("/api", userRoutes);

// coonect app with MongoDB
const PORT = process.env.PORT;
const DB_URL = process.env.DB;

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log("DB Connection Error: ", err);
  });

// listen express app on port 8000
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
