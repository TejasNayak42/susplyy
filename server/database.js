import mysql2 from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const DB = mysql2.createConnection({
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

DB.connect((err) => {
  if (!err) {
    console.log("Connected");
  } else {
    console.log(err);
  }
});

export default DB;
