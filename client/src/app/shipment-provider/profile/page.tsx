"use client";
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

const ShipperInfo = () => {
  const [shipperInfo, setShipperInfo] = useState<any>({});
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    const fetchShipperInfo = async () => {
      try {
        const response = await fetch("http://localhost:8080/shipper/info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch shipper information");
        }
        const data = await response.json();
        setShipperInfo(data);
      } catch (error) {
        console.error("Error fetching shipper information:", error);
      }
    };

    // Fetch shipper information only if token is available in cookies
    if (cookies.token) {
      fetchShipperInfo();
    }
  }, [cookies.token]);

  return (
    <div>
      <h2>shipper Information</h2>
      {shipperInfo && (
        <div>
          <p>ID: {shipperInfo.shipper_id}</p>
          <p>Email: {shipperInfo.email}</p>
          <p>Role: {shipperInfo.role}</p>
        </div>
      )}
    </div>
  );
};

export default ShipperInfo;
