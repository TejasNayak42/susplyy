import connection from "../../../database.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export function registerCustomer(req, res) {
  try {
    const {
      customer_name,
      city,
      region,
      country,
      postal_code,
      contact_no,
      email,
      password,
      role,
    } = req.body;

    const saltRounds = 12;
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error hashing password" });
      }

      // Use prepared statements to prevent SQL injection vulnerabilities
      const query = `
          INSERT INTO customer (customer_name, city, region, country, postal_code, contact_no, email, password, role)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

      // Execute the query using the connection object
      connection.query(
        query,
        [
          customer_name,
          city,
          region,
          country,
          postal_code,
          contact_no,
          email,
          hashedPassword,
          role,
        ],
        (error, results) => {
          if (error) {
            console.error(error);
            return res
              .status(500)
              .json({ message: "Error registering customer" });
          }

          res
            .status(201)
            .json({ message: "Customer registered successfully!" });
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering customer" });
  }
}

export function loginCustomer(req, res) {
  try {
    const { email, password } = req.body;

    const query = `
          SELECT * FROM customer WHERE email = ? LIMIT 1
        `;

    connection.query(query, [email], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Error logging in" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Incorrect email or password" });
      }

      const customer = results[0];
      bcrypt.compare(password, customer.password, (err, passwordMatch) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error comparing passwords" });
        }

        if (!passwordMatch) {
          return res
            .status(401)
            .json({ message: "Incorrect email or password" });
        }

        const response = { email: customer.email, role: customer.role };
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
