"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { useCookies } from "react-cookie";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Order {
  order_id: number;
  date: string;
  total_amount: number;
  product_name: string;
  product_price: number;
  quantity: number;
}

interface Shipment {
  order_id: number;
  shipment_status: string;
}

const itemsPerPage = 7;

export default function Shipments() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<{
    [orderId: number]: string;
  }>({});
  const [confirmedOrders, setConfirmedOrders] = useState<number[]>([]);
  const [cookies] = useCookies(["token"]);
  const [shipments, setShipments] = useState<Shipment[]>([]);

  const [currentPage, setCurrentPage] = useState(1);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    fetchOrders();
    fetchShipments();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = cookies.token;
      if (!token) {
        throw new Error("Token not found in cookies");
      }

      const res = await fetch("http://localhost:8080/order/all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      const sortedOrders = data.orders.sort((a: Order, b: Order) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      const formattedOrders = sortedOrders.map((order: Order) => ({
        ...order,
        date: formatDate(order.date),
        quantity: order.total_amount / order.product_price,
      }));
      setOrders(formattedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleStatusChange = (orderId: number, status: string) => {
    setSelectedStatuses((prevStatuses) => ({
      ...prevStatuses,
      [orderId]: status,
    }));
  };

  const fetchShipments = async () => {
    try {
      const token = cookies.token;
      if (!token) {
        throw new Error("Token not found in cookies");
      }

      const res = await fetch("http://localhost:8080/shipments", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setShipments(data.shipments);
    } catch (error) {
      console.error("Error fetching shipments:", error);
    }
  };

  const addShipment = async (orderId: number) => {
    try {
      const token = cookies.token;
      if (!token) {
        throw new Error("Token not found in cookies");
      }

      const selectedStatus = "ordered"; // Set status as "ordered"

      const res = await fetch("http://localhost:8080/shipper/addshipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          order_id: orderId,
          shipment_status: selectedStatus,
        }),
      });
      const data = await res.json();
      console.log("Shipment added successfully:", data);
      // Fetch and display updated orders after adding shipment
      fetchOrders();
      // Mark the order as confirmed
      setConfirmedOrders((prevConfirmedOrders) => [
        ...prevConfirmedOrders,
        orderId,
      ]);
      // Clear the selected status after adding shipment
      handleStatusChange(orderId, "");
    } catch (error) {
      console.error("Error adding shipment:", error);
    }
  };

  // Function to format date in "dd-mm-yyyy" format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  };

  // Calculate start and end index for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = orders.slice(startIndex, endIndex);

  const isShipmentOrdered = (orderId: number) => {
    return shipments.some(
      (shipment) =>
        shipment.order_id === orderId && shipment.shipment_status === "ordered"
    );
  };

  return (
    <div>
      <div>
        <Navbar />
        <div className="flex px-5 pb-20 flex-col min-h-[100dvh] items-center">
          <h1 className="mt-32 w-full max-w-6xl mb-10 text-2xl font-semibold">
            Order Requests
          </h1>
          <div className="rounded-md border max-w-6xl w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Ordered On</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((order, index) => (
                  <TableRow key={index}>
                    <TableCell>{order.order_id}</TableCell>
                    <TableCell>{order.product_name}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>${order.product_price}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>${order.total_amount}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => addShipment(order.order_id)}
                        disabled={isShipmentOrdered(order.order_id)}
                      >
                        {isShipmentOrdered(order.order_id)
                          ? "Confirmed Order"
                          : "Add Shipment"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between w-full max-w-6xl space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Showing {startIndex + 1} - {Math.min(endIndex, orders.length)} of{" "}
              {orders.length} orders
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={endIndex >= orders.length}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
