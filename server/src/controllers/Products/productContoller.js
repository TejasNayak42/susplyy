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
