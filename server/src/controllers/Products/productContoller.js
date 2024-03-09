import connection from "../../../database.js";

export function getProducts(req, res) {
  try {
    // Execute the SQL query
    const query = `SELECT product_id, product_name, product_description, product_price, quantity, image_url, status FROM products`;

    connection.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error retrieving products" });
      }

      // Send successful response with retrieved products
      return res.status(200).json({ products: results });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error retrieving products" });
  }
}

// Function to add a new product
export function addProduct(req, res) {
  try {
    // Extract product data from request body (excluding supplier_id)
    const {
      image_url,
      product_name,
      product_description,
      product_price,
      quantity,
    } = req.body;

    // Fetch supplier ID and role from JWT
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Missing token" });
    }

    let decodedSupplierId; // Declare variables to store details
    let decodedRole;

    try {
      const decoded = Jwt.verify(token, process.env.ACCESS_TOKEN);
      decodedSupplierId = decoded.id;
      decodedRole = decoded.role; // Extract role from decoded token
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // Ensure the user has the "supplier" role
    if (decodedRole !== "supplier") {
      return res
        .status(403)
        .json({ message: "Unauthorized: Only suppliers can add products" });
    }

    // Prepare SQL query to insert new product, using decodedSupplierId
    const query = `
      INSERT INTO products (supplier_id, image_url,product_name, product_description, product_price, quantity)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    // Execute the query using the connection and handle results
    connection.query(
      query,
      [
        decodedSupplierId,
        image_url,
        product_name,
        product_description,
        product_price,
        quantity,
      ],
      (error, results) => {
        if (error) {
          console.error(error); // Log error for debugging
          return res.status(500).json({ message: "Error adding product" });
        }

        // Send successful product addition response
        res.status(201).json({ message: "Product added successfully!" });
      }
    );
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Error adding product" });
  }
}
