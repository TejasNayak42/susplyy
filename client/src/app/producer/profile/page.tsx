"use client";
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

const ProducerInfo = () => {
  const [producerInfo, setProducerInfo] = useState<any>({});
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    const fetchProducerInfo = async () => {
      try {
        const response = await fetch("http://localhost:8080/supplier/info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch producer information");
        }
        const data = await response.json();
        setProducerInfo(data);
      } catch (error) {
        console.error("Error fetching producer information:", error);
      }
    };

    // Fetch producer information only if token is available in cookies
    if (cookies.token) {
      fetchProducerInfo();
    }
  }, [cookies.token]);

  return (
    <div>
      <h2>Producer Information</h2>
      {producerInfo && (
        <div>
          <p>ID: {producerInfo.supplier_id}</p>
          <p>Email: {producerInfo.email}</p>
          <p>Role: {producerInfo.role}</p>
        </div>
      )}
    </div>
  );
};

export default ProducerInfo;
