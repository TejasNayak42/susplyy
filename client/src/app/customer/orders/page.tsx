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

const itemsPerPage = 10;

export default function CustomerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [cookies] = useCookies(["token"]);
  const [currentPage, setCurrentPage] = useState(1);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("http://localhost:8080/order/", {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        // Sort orders by date in descending order
        const sortedOrders = data.orders.sort((a: Order, b: Order) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        // Format dates and calculate total price as quantity
        const formattedOrders = sortedOrders.map((order: Order) => ({
          ...order,
          date: formatDate(order.date),
          quantity: order.total_amount / order.product_price,
        }));
        setOrders(formattedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }
    fetchOrders();
  }, [cookies.token]);

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

  return (
    <div>
      <Navbar />
      <div className="flex px-5 pb-20 flex-col min-h-[100dvh] items-center">
        <h1 className="mt-32 w-full max-w-6xl mb-10 text-2xl font-semibold">
          Your Orders
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
  );
}
