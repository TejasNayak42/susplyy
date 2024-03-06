"use client";

import * as React from "react";

import { useState } from "react";

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
import Navbar from "./Navbar";

const shipmentData = [
  {
    id: 1,
    productName: "Widget",
    trackingNumber: "1234567890",
    status: "In Transit",
    location: "New York, NY",
    estimatedDelivery: "March 10, 2024",
  },
  {
    id: 2,
    productName: "Gadget",
    trackingNumber: "0987654321",
    status: "Delivered",
    location: "Los Angeles, CA",
    estimatedDelivery: "March 5, 2024",
  },
  {
    id: 3,
    productName: "Machine",
    trackingNumber: "5432167890",
    status: "Out for Delivery",
    location: "Chicago, IL",
    estimatedDelivery: "March 12, 2024",
  },
  {
    id: 4,
    productName: "Tool",
    trackingNumber: "6789012345",
    status: "Delayed",
    location: "Houston, TX",
    estimatedDelivery: "March 15, 2024",
  },
  {
    id: 5,
    productName: "Equipment",
    trackingNumber: "2345678901",
    status: "In Transit",
    location: "Phoenix, AZ",
    estimatedDelivery: "March 8, 2024",
  },
  {
    id: 6,
    productName: "Appliance",
    trackingNumber: "3456789012",
    status: "Delivered",
    location: "Philadelphia, PA",
    estimatedDelivery: "March 6, 2024",
  },
  {
    id: 7,
    productName: "Furniture",
    trackingNumber: "4567890123",
    status: "In Transit",
    location: "San Antonio, TX",
    estimatedDelivery: "March 9, 2024",
  },
  {
    id: 8,
    productName: "Accessory",
    trackingNumber: "5678901234",
    status: "Delivered",
    location: "San Diego, CA",
    estimatedDelivery: "March 4, 2024",
  },
  {
    id: 9,
    productName: "Material",
    trackingNumber: "7890123456",
    status: "Out for Delivery",
    location: "Dallas, TX",
    estimatedDelivery: "March 11, 2024",
  },
  {
    id: 10,
    productName: "Supply",
    trackingNumber: "8901234567",
    status: "Delayed",
    location: "San Jose, CA",
    estimatedDelivery: "March 14, 2024",
  },
];

const itemsPerPage = 7;

export default function ShipmentTrackingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState(shipmentData);

  const handleSearch = () => {
    const filtered = shipmentData.filter(
      (shipment) =>
        shipment.trackingNumber.includes(searchQuery) ||
        shipment.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);

  return (
    <div>
      <Navbar />

      <div className="flex px-5 flex-col min-h-[100dvh] items-center">
        <h1 className="mt-32 w-full max-w-6xl mb-10 text-2xl font-semibold">
          Track your stuffs
        </h1>
        <div className="flex w-full max-w-6xl  items-center pb-10">
          <Input
            placeholder="Enter Tracking Number, Product Name, or Location"
            className="max-w-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button className="ml-4" onClick={handleSearch}>
            Search
          </Button>
        </div>

        <div className="rounded-md border max-w-6xl w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Tracking Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Estimated Delivery</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((shipment, index) => (
                <TableRow key={index}>
                  <TableCell>{shipment.productName}</TableCell>
                  <TableCell>{shipment.trackingNumber}</TableCell>
                  <TableCell>{shipment.status}</TableCell>
                  <TableCell>{shipment.location}</TableCell>
                  <TableCell>{shipment.estimatedDelivery}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between w-full max-w-6xl space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Showing {startIndex + 1} - {Math.min(endIndex, filteredData.length)}{" "}
            of {filteredData.length} shipments
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
              disabled={endIndex >= filteredData.length}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
