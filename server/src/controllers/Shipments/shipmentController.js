import connection from "../../../database.js";
import Jwt from "jsonwebtoken";
export async function addShipment(req, res) {
  try {
    // Extract shipper ID and role from JWT
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }

    let shipperID;
    let role;
    try {
      const decoded = Jwt.verify(token, process.env.ACCESS_TOKEN);
      shipperID = decoded.id;
      role = decoded.role;
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Invalid token" });
    }

    // Check if user has shipper role
    if (role !== "shipper") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Extract order ID, shipment status (optional) from request body
    const { order_id, shipment_status } = req.body;

    // Input validation (adjust based on your needs)
    if (!order_id) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    // Get current date
    const currentDate = new Date().toISOString().slice(0, 10);

    // Calculate estimated delivery date (add 3 days)
    const estimatedDeliveryDate = new Date(currentDate);
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 3);
    const deliveryDate = estimatedDeliveryDate.toISOString().slice(0, 10);

    // Prepare insert query with JOIN to orders table
    const query = `
        INSERT INTO shipments (order_id, shipper_id, shipment_date, delivery_date, shipment_status, product_id)
        SELECT o.order_id, ?, ?, ?, ?, o.product_id
        FROM orders o
        WHERE o.order_id = ?
      `;

    // Execute query with order ID, shipper ID, dates, status, and using order ID to get product_id
    connection.query(
      query,
      [shipperID, currentDate, deliveryDate, shipment_status, order_id],
      (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "Error adding shipment" });
        }

        // Success response
        res.status(201).json({ message: "Shipment added successfully!" });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getShipments(req, res) {
  try {
    // Extract shipper ID and role from JWT
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }

    let shipperID;
    let role;
    try {
      const decoded = Jwt.verify(token, process.env.ACCESS_TOKEN);
      shipperID = decoded.id;
      role = decoded.role;
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Invalid token" });
    }

    // Check if user has shipper role
    if (role !== "shipper") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Prepare select query for shipments table (filtering by shipper)
    const query = `
      SELECT s.*, o.product_id AS order_product_id
      FROM shipments s
      INNER JOIN orders o ON s.order_id = o.order_id
      WHERE s.shipper_id = ?
    `;

    // Execute query with shipper ID
    connection.query(query, [shipperID], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching shipments" });
      }

      // Return shipment details (consider filtering sensitive data if needed)
      res.status(200).json({ shipments: results });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
