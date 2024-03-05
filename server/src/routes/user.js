// user.js
import express from "express";
import connection from "../../database.js"; // Change import statement

import bcrypt from "bcrypt";

const router = express.Router();
export { router as userRouter };

router.post("/register", (req, res) => {
  try {
    const { name, phone, email, password, status, role } = req.body;

    const saltRounds = 12;
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error hashing password" });
      }

      // Use prepared statements to prevent SQL injection vulnerabilities
      const query = `
        INSERT INTO user (name, phone, email, password, status, role)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      // Execute the query using the connection object
      connection.query(
        query,
        [name, phone, email, hashedPassword, status, role],
        (error, results) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ message: "Error registering user" });
          }

          res.status(201).json({ message: "User registered successfully!" });
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" }); // Avoid returning detailed error messages
  }
});
