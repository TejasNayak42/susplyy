"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Main/Navbar";
import { useToast } from "@/components/ui/use-toast";

const Register = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    shipper_name: "",
    city: "",
    region: "",
    country: "",
    postal_code: "",
    contact_no: "",
    email: "",
    password: "",
    role: "shipper",
  });

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setIsLoading(true);

    fetch("http://localhost:8080/shipper/register", {
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

        toast({
          title: "Registration Completed",
          description: "Redirecting to login page.",
          variant: "success",
        });

        setFormData({
          shipper_name: "",
          city: "",
          region: "",
          country: "",
          postal_code: "",
          contact_no: "",
          email: "",
          password: "",
          role: "shipper",
        });

        // Redirect to login page after successful registration
        setTimeout(() => {
          window.location.href = "/shipment-provider/login";
        }, 1000);
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Registration Failed",
          description:
            "An error occurred during registration. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
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
          src="/assets/shipment-provider/shipment1.svg"
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
                  disabled={isLoading}
                  id="shipper_name"
                  name="shipper_name"
                  type="text"
                  autoComplete="shipper_name"
                  required
                  value={formData.shipper_name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label>City</Label>
              <div className="mt-2">
                <Input
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
              <Button disabled={isLoading} type="submit" className="w-full">
                Sign up
                {isLoading && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    className="ml-2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
                      opacity=".5"
                    />
                    <path
                      fill="currentColor"
                      d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"
                    >
                      <animateTransform
                        attributeName="transform"
                        dur="1s"
                        from="0 12 12"
                        repeatCount="indefinite"
                        to="360 12 12"
                        type="rotate"
                      />
                    </path>
                  </svg>
                )}
              </Button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/shipment-provider/login"
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
