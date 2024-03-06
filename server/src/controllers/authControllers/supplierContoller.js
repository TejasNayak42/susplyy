import connection from "../../../database.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export function registerSupplier(req, res) {
  try {
    const {
      supplier_name,
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
          INSERT INTO supplier (supplier_name, city, region, country, postal_code, contact_no, email, password, role)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

      // Execute the query using the connection object
      connection.query(
        query,
        [
          supplier_name,
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
              .json({ message: "Error registering supplier" });
          }

          res
            .status(201)
            .json({ message: "Supplier registered successfully!" });
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering Supplier" });
  }
}

export function loginSupplier(req, res) {
  try {
    const { email, password } = req.body;

    const query = `
          SELECT * FROM supplier WHERE email = ? LIMIT 1
        `;

    connection.query(query, [email], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Error logging in" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Incorrect email or password" });
      }

      const supplier = results[0];
      bcrypt.compare(password, supplier.password, (err, passwordMatch) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error comparing passwords" });
        }

        if (!passwordMatch) {
          return res
            .status(401)
            .json({ message: "Incorrect email or password" });
        }

        const response = { email: supplier.email, role: supplier.role };
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
