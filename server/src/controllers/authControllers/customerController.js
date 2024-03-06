import connection from "../../../database.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export function registerCustomer(req, res) {
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
    res.status(500).json({ message: "Error registering user" });
  }
}

export function loginCustomer(req, res) {
  try {
    const { email, password } = req.body;

    const query = `
          SELECT * FROM user WHERE email = ? LIMIT 1
        `;

    connection.query(query, [email], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Error logging in" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Incorrect email or password" });
      }

      const user = results[0];
      bcrypt.compare(password, user.password, (err, passwordMatch) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error comparing passwords" });
        }

        if (!passwordMatch) {
          return res
            .status(401)
            .json({ message: "Incorrect email or password" });
        }

        if (user.status === "false") {
          return res
            .status(403)
            .json({ message: "User is waiting for admin approval" });
        }

        const response = { email: user.email, role: user.role };
        const accessToken = Jwt.sign(response, process.env.ACCESS_TOKEN, {
          expiresIn: "8h",
        });

        res
          .status(200)
          .json({ message: "Login successful!", token: accessToken });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
}
