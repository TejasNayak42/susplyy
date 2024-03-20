"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { useCookies } from "react-cookie";
import { Button } from "@/components/ui/button";

import { useToast } from "@/components/ui/use-toast";

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
  const [trackingInfo, setTrackingInfo] = useState<{ [key: number]: boolean }>(
    {}
  );

  const server_url = process.env.NEXT_PUBLIC_SERVER_URL;

  const { toast } = useToast();

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    fetchShipments();
    fetchTrackingInfo();
  }, []);

  const fetchShipments = async () => {
    try {
      const token = cookies.token;
      if (!token) {
        throw new Error("Token not found in cookies");
      }

      const res = await fetch(`${server_url}/shipments`, {
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

  const fetchTrackingInfo = async () => {
    try {
      const token = cookies.token;
      if (!token) {
        throw new Error("Token not found in cookies");
      }

      const res = await fetch(`${server_url}/tracks/info`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      // Extract shipment_ids from the tracks data
      const trackedShipments = data.tracks.map(
        (track: any) => track.shipment_id
      );

      // Create a tracking map with shipment_ids as keys
      const trackingMap: { [key: number]: boolean } = {};
      trackedShipments.forEach((shipmentId: number) => {
        trackingMap[shipmentId] = true;
      });

      setTrackingInfo(trackingMap);
    } catch (error) {
      console.error("Error fetching tracking info:", error);
    }
  };

  // Function to format date in "dd-mm-yyyy" format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleTrackButtonClick = async (shipmentId: number) => {
    try {
      const token = cookies.token;
      if (!token) {
        throw new Error("Token not found in cookies");
      }

      const res = await fetch(`${server_url}/tracks/addtracks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ shipment_id: shipmentId }),
      });

      if (res.ok) {
        toast({
          title: "Tracking",
          variant: "success",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast({
          title: "Failed to track",
          description: "Please try again",
          variant: "destructive",
        });
        throw new Error("Failed to track");
      }
    } catch (error) {
      toast({
        title: "Some error in tracking",
        description: "Please try again later",
        variant: "destructive",
      });
      console.error("Error track:", error);
    }
  };

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
                  <TableHead>Actions</TableHead>
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
                      {trackingInfo[shipment.shipment_id] ? (
                        <Button disabled>Tracking</Button>
                      ) : (
                        <Button
                          onClick={() =>
                            handleTrackButtonClick(shipment.shipment_id)
                          }
                        >
                          Track
                        </Button>
                      )}
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
