"use client";

import React, { useState } from "react";
import { useCookies } from "react-cookie";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Main/Navbar";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    setIsLoading(true);

    fetch("http://localhost:8080/supplier/login", {
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

        toast({
          title: "Login Successful",
          variant: "success",
        });

        setFormData({ email: "", password: "" });

        // Redirect to producer page
        setTimeout(() => {
          window.location.href = "/producer";
        }, 1000);
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Login Failed",
          description: "An error occurred. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      });
  };

  return (
    <div className="grid lg:grid-cols-2 max-w-6xl mx-auto">
      <Navbar />
      <div className="lg:flex hidden">
        <Image
          className="flex fixed ml-5 min-h-[100dvh]"
          src="/assets/producer/producer3.svg"
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

            <Button disabled={isLoading} type="submit" className="w-full">
              Sign in
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
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Do not have an account?{" "}
            <Link
              href="/producer/register"
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
