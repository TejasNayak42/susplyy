"use client";

import React, { useState } from "react";
import { useCookies } from "react-cookie";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Main/Navbar";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [cookies, setCookie] = useCookies(["token"]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    fetch("http://localhost:8080/shipper/login", {
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
        return response.json();
      })
      .then((data) => {
        // Store token in cookies and local storage
        setCookie("token", data.token, { path: "/" });
        localStorage.setItem("token", data.token);
        console.log(data.message); // "Login successful!"
        setFormData({ email: "", password: "" });
        // Redirect to customer page
        window.location.href = "/shipment-provider";
      })
      .catch((error) => {
        console.error("There was an error logging in:", error);
        // Handle error appropriately (show error message, etc.)
      });
  };

  return (
    <div className="grid lg:grid-cols-2 max-w-6xl mx-auto">
      <Navbar />
      <div className="lg:flex hidden">
        <Image
          className="flex fixed ml-5 min-h-[100dvh]"
          src="/customer1.svg"
          alt="login"
          width={500}
          height={500}
        ></Image>
      </div>
      <div className="flex w-full px-5 flex-col justify-center items-center min-h-[100dvh]">
        <div className="sm:mx-auto w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-semibold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
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

            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Do not have an account?{" "}
            <Link
              href="/customer/register"
              className="font-semibold leading-6 text-green-500 hover:text-green-600 transition-all duration-200"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
