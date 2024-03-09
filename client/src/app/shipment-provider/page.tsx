"use client";
import * as React from "react";
import { useState, useEffect } from "react";
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
import Navbar from "./Navbar";

interface Track {
  customer_contact_no: string;
  customer_postal_code: string;
  track_id: string;
  order_id: string;
  customer_id: string;
}

export default function ShipmentTrackingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [trackData, setTrackData] = useState<Track[]>([]);
  const [filteredData, setFilteredData] = useState([] as any[]);
  const [cookies] = useCookies(["token"]);

  const itemsPerPage = 7;

  useEffect(() => {
    const token = cookies.token;
    fetchTrackData(token);
  }, []);

  const fetchTrackData = async (token: string) => {
    try {
      const res = await fetch("http://localhost:8080/tracks/info", {
        headers: {
          Authorization: `Bearer ${token}`, // Attach JWT token to the request header
        },
      });
      const data = await res.json();
      console.log("Track data:", data);
      setTrackData(data.tracks);
      setFilteredData(data.tracks);
    } catch (error) {
      console.error("Error fetching track data:", error);
    }
  };

  const handleSearch = () => {
    const filtered = trackData.filter(
      (track) =>
        track.customer_contact_no.includes(searchQuery) ||
        track.track_id.includes(searchQuery) ||
        track.order_id.includes(searchQuery) ||
        track.customer_id.includes(searchQuery) ||
        track.customer_postal_code.includes(searchQuery)
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

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData
    ? filteredData.slice(startIndex, endIndex)
    : [];

  const totalCount = filteredData ? filteredData.length : 0;

  return (
    <div>
      <Navbar />
      <div className="flex px-5 pb-20 flex-col min-h-[100dvh] items-center">
        <h1 className="mt-32 w-full max-w-6xl mb-10 text-2xl font-semibold">
          Track your Shipments
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
                <TableHead>Tracking ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead>Customer Contact</TableHead>
                <TableHead>Delivery Address</TableHead>
                <TableHead>Delivery Pin</TableHead>
                <TableHead>Tracking Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((track, index) => (
                <TableRow key={index}>
                  <TableCell>{track.track_id}</TableCell>
                  <TableCell>{track.order_id}</TableCell>
                  <TableCell>{track.customer_id}</TableCell>
                  <TableCell>{track.customer_contact_no}</TableCell>
                  <TableCell>
                    {`${track.customer_city}, ${track.customer_region}, ${track.customer_country}`}
                  </TableCell>
                  <TableCell>{track.customer_postal_code}</TableCell>
                  <TableCell>{track.tracking_status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between w-full max-w-6xl space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Showing {startIndex + 1} - {Math.min(endIndex, totalCount)} of{" "}
            {totalCount} tracks
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
              disabled={endIndex >= totalCount}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
