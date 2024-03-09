import connection from "../../../database.js";
import Jwt from "jsonwebtoken";

export async function placeOrder(req, res) {
  try {
    // Extract customer ID and role from JWT
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }

    let customerID;
    let role;
    try {
      const decoded = Jwt.verify(token, process.env.ACCESS_TOKEN);
      customerID = decoded.id;
      role = decoded.role;
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Invalid token" });
    }

    // Check if user has customer role (optional)
    if (role !== "customer") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const { product_id, selected_quantity } = req.body;

    // Input validation (optional, adjust based on your needs)
    if (!product_id || selected_quantity <= 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    // Start a transaction (if supported by your database)
    connection.beginTransaction((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error starting transaction" });
      }

      // Update product status and quantity (assuming sufficient stock check is done beforehand)
      const updateProductQuery = `
        UPDATE products
        SET status = 'true',
        quantity = quantity - ?
        WHERE product_id = ?`;
      connection.query(
        `SELECT quantity FROM products WHERE product_id = ?`,
        [product_id],
        (err, stockResult) => {
          if (err) {
            // Handle error here
          } else if (stockResult.length === 0) {
            // Handle product not found case
          } else if (stockResult[0].quantity < selected_quantity) {
            connection.rollback(() => {
              console.error("Insufficient stock");
              return res
                .status(400)
                .json({ message: "Insufficient product stock" });
            });
          } else {
            // Proceed with updating product quantity...
          }
        }
      );

      connection.query(
        updateProductQuery,
        [selected_quantity, product_id],
        (error) => {
          if (error) {
            connection.rollback(() => {
              console.error(error);
              return res
                .status(500)
                .json({ message: "Error updating product" });
            });
          } else {
            // Fetch product details
            const productQuery = `
            SELECT p.product_id, p.product_name, p.product_description, p.product_price
            FROM products p
            WHERE p.product_id = ?`;

            connection.query(
              productQuery,
              [product_id],
              (err, productResult) => {
                if (err) {
                  connection.rollback(() => {
                    console.error(err);
                    return res
                      .status(500)
                      .json({ message: "Error retrieving product details" });
                  });
                } else if (productResult.length === 0) {
                  connection.rollback(() => {
                    console.error("Product not found");
                    return res
                      .status(404)
                      .json({ message: "Product not found" });
                  });
                } else {
                  const product = productResult[0];
                  const totalAmount = product.product_price * selected_quantity;

                  // Insert order details
                  const insertOrderQuery = `
                INSERT INTO orders (customer_id, date, total_amount, product_id, quantity)
                VALUES (?, CURDATE(), ?,?,?)`;

                  connection.query(
                    insertOrderQuery,
                    [customerID, totalAmount, product_id, selected_quantity],
                    (error) => {
                      if (error) {
                        connection.rollback(() => {
                          console.error(error);
                          return res.status(500).json({
                            message:
                              "Error placing order while inserting in order table",
                          });
                        });
                      } else {
                        // Get the newly inserted order ID
                        connection.query(
                          "SELECT LAST_INSERT_ID()",
                          (err, result) => {
                            if (err) {
                              connection.rollback(() => {
                                console.error(err);
                                return res.status(500).json({
                                  message: "Error retrieving order ID",
                                });
                              });
                            } else {
                              const orderID = result[0]["LAST_INSERT_ID()"];

                              // Construct the desired response object with order details
                              const order = {
                                order_id: orderID,
                                customer_id: customerID,
                                date: new Date().toISOString().slice(0, 10), // Format date
                                total_amount: totalAmount,
                                product: product,
                              };

                              // Commit transaction on success
                              connection.commit((err) => {
                                if (err) {
                                  console.error(err);
                                  return res.status(500).json({
                                    message: "Error placing order at last code",
                                  });
                                } else {
                                  console.log("Order placed successfully!");
                                  return res.status(201).json({ order }); // Send the order details in response
                                }
                              });
                            }
                          }
                        );
                      }
                    }
                  );
                }
              }
            );
          }
        }
      );
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export function getOrdersByCustomerId(req, res) {
  try {
    // Extract customer ID from JWT token (replace 'your_secret_key' with your actual secret key)
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = Jwt.verify(token, process.env.ACCESS_TOKEN);
    const customerId = decoded.id;

    // Define the SQL query to directly join the 'orders' and 'products' tables
    const query = `
      SELECT o.order_id, o.date, o.total_amount, p.product_name, p.product_price, p.quantity
      FROM orders o
      JOIN products p ON o.product_id = p.product_id
      WHERE o.customer_id = ?
    `;

    connection.query(query, [customerId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error retrieving orders" });
      }

      // Send successful response with retrieved orders
      return res.status(200).json({ orders: results });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error retrieving orders" });
  }
}

export function getAllOrders(req, res) {
  try {
    // Extract role from JWT token
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = Jwt.verify(token, process.env.ACCESS_TOKEN);
    const role = decoded.role;

    // Check if role is "shipper"
    if (role !== "shipper") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Define the SQL query to directly join the 'orders' and 'products' tables
    const query = `
      SELECT o.order_id, o.date, o.total_amount, p.product_name, p.product_price, p.quantity
      FROM orders o
      JOIN products p ON o.product_id = p.product_id
    `;

    connection.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error retrieving orders" });
      }

      // Send successful response with retrieved orders
      return res.status(200).json({ orders: results });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error retrieving orders" });
  }
}
