import connection from "../../../database.js"; // Import database connection
import Jwt from "jsonwebtoken"; // Import JSON Web Token library
import bcrypt from "bcrypt"; // Import password hashing library

// Function to register a new shipper
export function registerShippers(req, res) {
  try {
    // Extract user data from request body
    const {
      shipper_name,
      city,
      region,
      country,
      postal_code,
      contact_no,
      email,
      password,
      role,
    } = req.body;

    // Hash the password using bcrypt
    const saltRounds = 12;
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
        console.error(err); // Log error for debugging
        return res.status(500).json({ message: "Error hashing password" });
      }

      // Prepare SQL query to insert new shipper
      const query = `
        INSERT INTO shipper (shipper_name, city, region, country, postal_code, contact_no, email, password, role)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      // Execute the query using the connection and handle results
      connection.query(
        query,
        [
          shipper_name,
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
            console.error(error); // Log error for debugging
            return res
              .status(500)
              .json({ message: "Error registering Shipment Provider" });
          }

          // Extract the newly created shipper ID
          const shipperId = results.insertId;

          // Send successful registration response with shipper ID
          res.status(201).json({
            message: "Shipment Provider registered successfully!",
            shipperId,
          });
        }
      );
    });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Error registering shipper" });
  }
}

// Function to login a shipper
export function loginShippers(req, res) {
  try {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Prepare SQL query to find shipper by email
    const query = `
      SELECT * FROM shipper WHERE email = ? LIMIT 1
    `;

    // Execute the query using the connection and handle results
    connection.query(query, [email], (error, results) => {
      if (error) {
        console.error(error); // Log error for debugging
        return res.status(500).json({ message: "Error logging in" });
      }

      // Check if shipper with email exists
      if (results.length === 0) {
        return res.status(401).json({ message: "Incorrect email or password" });
      }

      // Extract the found shipper object
      const shipper = results[0];

      // Compare password using bcrypt
      bcrypt.compare(password, shipper.password, (err, passwordMatch) => {
        if (err) {
          console.error(err); // Log error for debugging
          return res.status(500).json({ message: "Error comparing passwords" });
        }

        // Check if password matches
        if (!passwordMatch) {
          return res
            .status(401)
            .json({ message: "Incorrect email or password" });
        }

        // Create response object with shipper information
        const response = {
          id: shipper.id,
          email: shipper.email,
          role: shipper.role,
        };

        // Generate JWT access token
        const accessToken = Jwt.sign(response, process.env.ACCESS_TOKEN, {
          expiresIn: "8h",
        });

        // Send successful login response with access token
        res
          .status(200)
          .json({ message: "Login successful!", token: accessToken });
      });
    });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Error logging in" });
  }
}

// Function to retrieve shipper information based on token
export function shipperInfo(req, callback) {
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
    const email = decoded.email; // Assuming email is present in the decoded token

    // Prepare SQL query to find shipper by email
    const query = `
      SELECT *
      FROM shipper
      WHERE email = ?
      LIMIT 1
    `;

    // Execute the query using the connection and handle results
    connection.query(query, [email], (error, results) => {
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
