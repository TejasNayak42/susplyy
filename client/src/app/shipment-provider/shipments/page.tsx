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

interface Shipment {
  shipment_id: number;
  order_id: number;
  product_id: number;
  shipper_id: number;
  shipment_date: string;
  shipment_status: string;
  delivery_date: string;
}

const itemsPerPage = 7;

export default function Shipments() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [cookies] = useCookies(["token"]);
  const [currentPage, setCurrentPage] = useState(1);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    fetchShipments();
  }, []);

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

      // Sort the shipments by their ID
      const sortedShipments = data.shipments.sort(
        (a: any, b: any) => a.shipment_id - b.shipment_id
      );

      setShipments(sortedShipments);
    } catch (error) {
      console.error("Error fetching shipments:", error);
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
  const currentItems = shipments.slice(startIndex, endIndex);

  return (
    <div>
      <div>
        <Navbar />
        <div className="flex px-5 pb-20 flex-col min-h-[100dvh] items-center">
          <h1 className="mt-32 w-full max-w-6xl mb-10 text-2xl font-semibold">
            Shipments
          </h1>
          <div className="rounded-md border max-w-6xl w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shipment ID</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Shipment Status</TableHead>
                  <TableHead>Shipment Date</TableHead>
                  <TableHead>Expected Delivery Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((shipment, index) => (
                  <TableRow key={index}>
                    <TableCell>{shipment.shipment_id}</TableCell>
                    <TableCell>{shipment.order_id}</TableCell>
                    <TableCell>{shipment.shipment_status}</TableCell>
                    <TableCell>{formatDate(shipment.shipment_date)}</TableCell>
                    <TableCell>{formatDate(shipment.delivery_date)}</TableCell>
                    <TableCell>
                      <Button>Track</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between w-full max-w-6xl space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Showing {startIndex + 1} - {Math.min(endIndex, shipments.length)}{" "}
              of {shipments.length} shipments
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
                disabled={endIndex >= shipments.length}
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
