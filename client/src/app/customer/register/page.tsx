"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Main/Navbar";

const Register = () => {
  const [formData, setFormData] = useState({
    customer_name: "",
    city: "",
    region: "",
    country: "",
    postal_code: "",
    contact_no: "",
    email: "",
    password: "",
    role: "customer",
  });

  const handleSubmit = (event: any) => {
    event.preventDefault();
    fetch("http://localhost:8080/customer/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        setFormData({
          customer_name: "",
          city: "",
          region: "",
          country: "",
          postal_code: "",
          contact_no: "",
          email: "",
          password: "",
          role: "customer",
        });

        // Redirect to login page after successful registration
        window.location.href = "/customer/login";
      })
      .catch((error) => {
        console.error("There was an error registering the user:", error);
        // Handle error appropriately (show error message, etc.)
      });
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="grid lg:grid-cols-2 max-w-6xl mx-auto">
      <Navbar />
      <div className="lg:flex hidden">
        <Image
          className="flex fixed ml-5 min-h-[100dvh]"
          src="/register.svg"
          alt="login"
          width={500}
          height={500}
        ></Image>
      </div>
      <div className="my-32 px-5">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-semibold leading-9 tracking-tight text-gray-900">
            Sign up your account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label>Full Name</Label>
              <div className="mt-2">
                <Input
                  id="customer_name"
                  name="customer_name"
                  type="text"
                  autoComplete="customer_name"
                  required
                  value={formData.customer_name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label>City</Label>
              <div className="mt-2">
                <Input
                  id="city"
                  name="city"
                  type="text"
                  autoComplete="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label>Region</Label>
              <div className="mt-2">
                <Input
                  id="region"
                  name="region"
                  type="text"
                  autoComplete="region"
                  required
                  value={formData.region}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label>Country</Label>
              <div className="mt-2">
                <Input
                  id="country"
                  name="country"
                  type="text"
                  autoComplete="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label>Postal Code</Label>
              <div className="mt-2">
                <Input
                  id="postal_code"
                  name="postal_code"
                  type="text"
                  autoComplete="postal_code"
                  required
                  value={formData.postal_code}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label>Contact Number</Label>
              <div className="mt-2">
                <Input
                  id="contact_no"
                  name="contact_no"
                  type="number"
                  autoComplete="contact_no"
                  required
                  value={formData.contact_no}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label>Email address</Label>
              <div className="mt-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label>Password</Label>
              </div>
              <div className="mt-2">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full">
                Sign up
              </Button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/customer/login"
              className="font-semibold leading-6 text-green-500 hover:text-green-600 transition-all duration-200"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
