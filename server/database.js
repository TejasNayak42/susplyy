import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

const connection = mysql.createConnection({
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const port = process.env.DB_PORT;
connection.connect((err) => {
  if (!err) {
    console.log(`mySQL Database Connected on port ${port}`);
  } else {
    console.log(err);
  }
});

export default connection;
