"use client";
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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Track {
  customer_contact_no: string;
  customer_postal_code: string;
  track_id: string;
  order_id: string;
  customer_id: string;
  tracking_status: string;
  tracking_date: string;
}

import React from "react";
import Navbar from "../Navbar";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";

const Tracking = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [trackData, setTrackData] = useState<Track[]>([]);
  const [filteredData, setFilteredData] = useState([] as any[]);
  const [cookies] = useCookies(["token"]);

  const [editTrackId, setEditTrackId] = useState("");
  const [newStatus, setNewStatus] = useState("");

  const itemsPerPage = 7;

  useEffect(() => {
    const token = cookies.token;
    fetchTrackData(token);
  }, []);

  const fetchTrackData = async (token: string) => {
    try {
      const res = await fetch("http://localhost:8080/tracks/info", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
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

  // const handleEditClick = (trackId: string) => {
  //   setEditTrackId(trackId);
  // };

  const handleCancelEdit = () => {
    setEditTrackId("");
    setNewStatus("");
  };

  const handleSaveEdit = async () => {
    const token = cookies.token;
    try {
      const response = await fetch("http://localhost:8080/tracks/updatetrack", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          track_id: editTrackId,
          new_tracking_status: newStatus,
        }),
      });

      if (response.ok) {
        // Update the tracking status in the local state
        const updatedTracks = trackData.map((track) => {
          if (track.track_id === editTrackId) {
            return { ...track, tracking_status: newStatus };
          }
          return track;
        });
        setTrackData(updatedTracks);
        setFilteredData(updatedTracks);
        handleCancelEdit();
      } else {
        console.error("Failed to update tracking status:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating tracking status:", error);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData
    ? filteredData.slice(startIndex, endIndex)
    : [];

  return (
    <div className="flex flex-col justify-center px-5 items-center">
      <Navbar />
      <div className="max-w-6xl pb-20 min-h-screen">
        <h1 className="mt-32 w-full max-w-6xl mb-10 text-2xl font-semibold">
          Track your Orders
        </h1>

        <div className="flex flex-col gap-10">
          {/* this below one is one card */}
          {currentItems.map((track, index) => (
            <div key={index} className="rounded-lg border w-full p-5">
              <div>
                <div className="grid grid-cols-4">
                  <div className="grid gap-5 lg:col-span-3 col-span-4">
                    <div className="flex gap-5 md:flex-row flex-col">
                      <div className="w-80 bg-pink-100 aspect-video overflow-hidden rounded-md lg:aspect-none group-hover:opacity-75 transition-all duration-200">
                        <Image
                          width={500}
                          height={500}
                          src="/cargo.svg"
                          alt="susply"
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="gap-1 flex flex-col pr-5">
                        <h1 className="text-xl font-semibold">Product Name</h1>
                        <h2 className="text-lg">50$</h2>
                        <p>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Vel, reiciendis?{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex lg:col-span-1 w-full justify-between col-span-4 lg:flex-col md:flex-row-reverse flex-col mt-5 md:mt-10 lg:mt-0 gap-5">
                    <div className="gap-1 flex flex-col">
                      <div className="font-semibold">Delivery Address</div>
                      <p>
                        {`${track.customer_city}, ${track.customer_region}, ${track.customer_country}`}
                      </p>
                      <p>{track.customer_postal_code}</p>
                    </div>
                    <div className="gap-1 flex flex-col">
                      <div className="font-semibold">
                        Shipment ID #{track.shipment_id}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:mt-10 mt-5">
                <p className="mb-4">
                  Preparing to ship on {formatDate(track.tracking_date)}
                </p>

                <Progress
                  value={
                    track.tracking_status === "delivered"
                      ? 100
                      : track.tracking_status === "processing"
                      ? 40
                      : track.tracking_status === "shipped"
                      ? 75
                      : 10
                  }
                />

                <div className="md:flex hidden w-full justify-between mt-4">
                  <span className="text-primary">Order Placed</span>
                  <span
                    className={
                      ["processing", "shipped", "delivered"].includes(
                        track.tracking_status
                      )
                        ? "text-primary"
                        : ""
                    }
                  >
                    Processing
                  </span>
                  <span
                    className={
                      ["shipped", "delivered"].includes(track.tracking_status)
                        ? "text-primary"
                        : ""
                    }
                  >
                    Shipped
                  </span>
                  <span
                    className={
                      track.tracking_status === "delivered"
                        ? "text-primary"
                        : ""
                    }
                  >
                    Delivered
                  </span>
                </div>

                <div className="flex md:hidden w-full justify-between mt-4">
                  <span className="text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M10.591 2.513a3.75 3.75 0 0 1 2.818 0l7.498 3.04A1.75 1.75 0 0 1 22 7.175v9.653a1.75 1.75 0 0 1-1.093 1.621l-7.498 3.04a3.75 3.75 0 0 1-2.818 0l-7.498-3.04A1.75 1.75 0 0 1 2 16.827V7.176a1.75 1.75 0 0 1 1.093-1.622zm2.254 1.39a2.25 2.25 0 0 0-1.69 0L9.24 4.68l7.527 2.927l2.669-1.03zm1.846 4.505L7.215 5.5L4.59 6.564l7.411 2.882zM3.5 16.828a.25.25 0 0 0 .156.231l7.499 3.04c.031.013.063.025.095.036v-9.371L3.5 7.75zm9.345 3.271l7.499-3.04a.25.25 0 0 0 .156-.232V7.774l-7.75 2.992v9.37a2.18 2.18 0 0 0 .095-.036"
                      />
                    </svg>
                  </span>
                  <span className="text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 32 32"
                    >
                      <circle cx="16" cy="29" r="2" fill="currentColor" />
                      <path
                        fill="currentColor"
                        d="M22.5 30H20v-2h2.5c3.033 0 5.5-2.467 5.5-5.5a5.477 5.477 0 0 0-4.23-5.353l.46-1.946A7.47 7.47 0 0 1 30 22.5c0 4.135-3.364 7.5-7.5 7.5m-2.086-15.414l-3-3C17.037 11.208 16.534 11 16 11s-1.037.208-1.414.586l-3 3c-.39.39-.586.902-.586 1.414s.196 1.024.586 1.414l3 3c.377.378.88.586 1.414.586s1.037-.208 1.414-.586l3-3c.39-.39.586-.902.586-1.414s-.196-1.024-.586-1.414M16 19l-3-3l3-3l3 3z"
                      />
                      <circle cx="16" cy="3" r="2" fill="currentColor" />
                      <path
                        fill="currentColor"
                        d="M7.77 16.8A7.47 7.47 0 0 1 2 9.5C2 5.365 5.364 2 9.5 2H12v2H9.5A5.506 5.506 0 0 0 4 9.5a5.477 5.477 0 0 0 4.23 5.353z"
                      />
                    </svg>
                  </span>
                  <span className="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5zm-.5 1.5l1.96 2.5H17V9.5zM6 18c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1m2.22-3c-.55-.61-1.33-1-2.22-1s-1.67.39-2.22 1H3V6h12v9zM18 18c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1"
                      />
                    </svg>
                  </span>
                  <span className="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M12 2c-.2 0-.4.1-.6.2L3.5 6.6c-.3.2-.5.5-.5.9v9c0 .4.2.7.5.9l7.9 4.4c.2.1.4.2.6.2s.4-.1.6-.2l.9-.5c-.3-.6-.4-1.3-.5-2v-6.7l6-3.4V13c.7 0 1.4.1 2 .3V7.5c0-.4-.2-.7-.5-.9l-7.9-4.4c-.2-.1-.4-.2-.6-.2m0 2.2l6 3.3l-2 1.1l-5.9-3.4zM8.1 6.3L14 9.8l-2 1.1l-6-3.4zM5 9.2l6 3.4v6.7l-6-3.4zm16.3 6.6l-3.6 3.6l-1.6-1.6L15 19l2.8 3l4.8-4.8z"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tracking;
