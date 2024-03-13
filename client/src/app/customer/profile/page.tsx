"use client";
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

const CustomerInfo = () => {
  const [customerInfo, setCustomerInfo] = useState<any>({});
  const [cookies] = useCookies(["token"]);

  const server_url = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        const response = await fetch(`${server_url}/customer/info`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch customer information");
        }
        const data = await response.json();
        setCustomerInfo(data);
      } catch (error) {
        console.error("Error fetching customer information:", error);
      }
    };

    // Fetch customer information only if token is available in cookies
    if (cookies.token) {
      fetchCustomerInfo();
    }
  }, [cookies.token]);

  return (
    <div>
      <h2>Customer Information</h2>
      {customerInfo && (
        <div>
          <p>ID: {customerInfo.customer_id}</p>
          <p>Email: {customerInfo.email}</p>
          <p>Role: {customerInfo.role}</p>
        </div>
      )}
    </div>
  );
};

export default CustomerInfo;
