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

      //prepared statements to prevent SQL injection vulnerabilities
      const query = `
          INSERT INTO supplier (supplier_name, city, region, country, postal_code, contact_no, email, password, role)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

      // Executing the query using the connection object
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

        const response = {
          id: supplier.supplier_id,
          email: supplier.email,
          role: supplier.role,
        };
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

// Function to retrieve supplier information
export function supplierInfo(req, callback) {
  if (!callback) {
    throw new Error("Callback function is required");
  }

  // Extract token from authorization header
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return callback(new Error("Missing token"), null);
  }

  try {
    // Verify the token using JWT
    const decoded = Jwt.verify(token, process.env.ACCESS_TOKEN);
    const supplier_id = decoded.id;

    //SQL query to find shipper by email
    const query = `
      SELECT *
      FROM supplier
      WHERE supplier_id = ?
      LIMIT 1
    `;

    // Executing the query using the connection and handle results
    connection.query(query, [supplier_id], (error, results) => {
      if (error) {
        return callback(error, null);
      }

      if (results.length === 0) {
        return callback(null, null); // User not found
      }

      const user = results[0];

      // Remove sensitive information before returning the user object
      delete user.password; // Example: Remove password field
      delete user.email_verification_token; // Example: Remove email verification token (if applicable)

      callback(null, user);
    });
  } catch (error) {
    callback(error, null);
  }
}
