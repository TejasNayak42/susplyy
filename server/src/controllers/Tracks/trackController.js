import connection from "../../../database.js";
import Jwt from "jsonwebtoken";

export function populateTracks(req, res) {
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

  // Extract shipment ID from request body
  const { shipment_id } = req.body;

  // Input validation (adjust based on your needs)
  if (!shipment_id) {
    return res.status(400).json({ message: "Invalid shipment data" });
  }

  const populateTracks = (shipment) => {
    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    // Prepare query to fetch customer details based on shipment ID
    const customerQuery = `
SELECT c.customer_id, c.contact_no AS customer_contact_no, c.city, c.region, c.country, c.postal_code
FROM shipments s
INNER JOIN orders o ON s.order_id = o.order_id
INNER JOIN customer c ON o.customer_id = c.customer_id
WHERE s.shipment_id = ?
`;

    connection.query(
      customerQuery,
      [shipment.order_id],
      (customerError, customerResults) => {
        if (customerError) {
          console.error(customerError);
          return res
            .status(500)
            .json({ message: "Error fetching customer details" });
        }

        if (!customerResults.length) {
          return res.status(404).json({ message: "Customer not found" });
        }

        const customerData = customerResults[0]; // Assuming single customer per order

        const trackData = {
          order_id: shipment.order_id,
          customer_id: customerData.customer_id,
          shipment_id: shipment.shipment_id,
          tracking_date: new Date().toISOString().slice(0, 10), // Current date
          tracking_status: "ordered",
          customer_contact_no: customerData.customer_contact_no,
          customer_city: customerData.city,
          customer_region: customerData.region,
          customer_country: customerData.country,
          customer_postal_code: customerData.postal_code,
        };

        // Execute a separate query to insert into tracks table
        connection.query(
          `
            INSERT INTO tracks (order_id, customer_id, shipment_id, tracking_date, tracking_status, customer_contact_no, customer_city, customer_region, customer_country, customer_postal_code)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            trackData.order_id,
            trackData.customer_id,
            trackData.shipment_id,
            trackData.tracking_date,
            trackData.tracking_status,
            trackData.customer_contact_no,
            trackData.customer_city,
            trackData.customer_region,
            trackData.customer_country,
            trackData.customer_postal_code,
          ],
          (insertError) => {
            if (insertError) {
              console.error(insertError);
              return res
                .status(500)
                .json({ message: "Error populating tracks table" });
            }
            res.status(200).json({ message: "Tracks populated successfully!" });
          }
        );
      }
    );
  };
  const shipmentQuery = `
    SELECT *
    FROM shipments
    WHERE shipment_id = ?
  `;
  connection.query(
    shipmentQuery,
    [shipment_id],
    (shipmentError, shipmentResults) => {
      if (shipmentError) {
        console.error(shipmentError);
        return res
          .status(500)
          .json({ message: "Error fetching shipment details" });
      }

      populateTracks(shipmentResults.length ? shipmentResults[0] : null); // Check for non-empty result
    }
  );
}

export function updateTrackStatus(req, res) {
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

  // Extract track ID and new tracking status from request body
  const { track_id, new_tracking_status } = req.body;

  // Input validation (adjust based on your needs)
  if (!track_id || !new_tracking_status) {
    return res.status(400).json({ message: "Invalid track data" });
  }

  const updateTrack = () => {
    // Get current date
    const currentDate = new Date().toISOString().slice(0, 10);

    const updateQuery = `
      UPDATE tracks
      SET tracking_status = ?, tracking_date = ?
      WHERE track_id = ?
    `;

    connection.query(
      updateQuery,
      [new_tracking_status, currentDate, track_id],
      (updateError, updateResults) => {
        if (updateError) {
          console.error(updateError);
          return res.status(500).json({ message: "Error updating track" });
        }

        if (updateResults.affectedRows === 0) {
          return res.status(404).json({ message: "Track not found" });
        }

        res.status(200).json({ message: "Track updated successfully!" });
      }
    );
  };

  // Check if track exists before updating
  const checkTrackQuery = `
    SELECT *
    FROM tracks
    WHERE track_id = ?
  `;

  connection.query(checkTrackQuery, [track_id], (checkError, checkResults) => {
    if (checkError) {
      console.error(checkError);
      return res.status(500).json({ message: "Error fetching track details" });
    }

    if (!checkResults.length) {
      return res.status(404).json({ message: "Track not found" });
    }

    updateTrack(); // Update only if track exists
  });
}

export function getTrackInfo(req, res) {
  // Extract token, ID, and role
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  let userID; // Can be customerID or shipperID depending on role
  let role;
  try {
    const decoded = Jwt.verify(token, process.env.ACCESS_TOKEN);
    userID = decoded.id;
    role = decoded.role;
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid token" });
  }

  // Check role
  const getTrackInfo = () => {
    let trackQuery;
    if (role === "shipper") {
      // Shippers can access all tracks
      trackQuery = `
          SELECT *
          FROM tracks
        `;
    } else if (role === "customer") {
      // Customers can only access tracks where customer_id matches their ID
      trackQuery = `
          SELECT *
          FROM tracks
          WHERE customer_id = ?
        `;
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    connection.query(
      trackQuery,
      role === "customer" ? [userID] : [], // Only customer needs user ID
      (error, results) => {
        if (error) {
          console.error(error);
          return res
            .status(500)
            .json({ message: "Error fetching track information" });
        }

        if (!results.length) {
          return res.status(404).json({ message: "No tracks found" });
        }

        res.status(200).json({ tracks: results });
      }
    );
  };

  getTrackInfo();
}
