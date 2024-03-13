"use client";
import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useCookies } from "react-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useToast } from "@/components/ui/use-toast";

import { Minus, Plus } from "lucide-react";

interface Product {
  product_id: number;
  product_name: string;
  product_price: number;
  image_url: string;
  product_description: string;
  quantity: number;
}

export default function Customer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cookies] = useCookies(["token"]);
  const { toast } = useToast();

  const server_url = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`${server_url}/products`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  const handlePlaceOrder = async (
    product_id: number,
    selectedQuantity: number
  ) => {
    try {
      const response = await fetch(`${server_url}/customer/placeorder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
        },
        body: JSON.stringify({
          product_id: product_id,
          selected_quantity: selectedQuantity,
        }),
      });
      if (response.ok) {
        toast({
          title: "Order placed successfully!",
          variant: "success",
        });
        console.log("Order placed!");
      } else {
        toast({
          title: "Failed to place order",
          description: "Please try again",
          variant: "destructive",
        });
        console.error("Failed to place order:", response.statusText);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div className="flex px-5 justify-center items-center">
      <Navbar />
      <div className="max-w-6xl pb-20 min-h-screen">
        <h1 className="mt-32 px-5 w-screen max-w-6xl mb-10 text-2xl font-semibold">
          Buy Products
        </h1>
        <div className="mt-6 px-5 grid grid-cols-1 gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <AlertDialog key={product.product_id}>
              <AlertDialogTrigger>
                <div className="group relative">
                  <div className="aspect-video w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 transition-all duration-200">
                    <img
                      width={500}
                      height={500}
                      src={product.image_url}
                      alt={product.product_name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-lg text-gray-700">
                        <div>
                          <span
                            aria-hidden="true"
                            className="absolute inset-0"
                          />
                          {product.product_name}
                        </div>
                      </h3>
                    </div>
                    <p className="text-lg font-medium text-gray-900">
                      ${product.product_price}
                    </p>
                  </div>
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <div className="flex w-full items-center">
                  <div className="grid w-full grid-cols-1 items-start">
                    <div>
                      <div className="">
                        <img
                          width={500}
                          height={500}
                          src={product.image_url}
                          alt={product.product_name}
                          className="object-cover aspect-video mb-5 rounded-lg object-center"
                        />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">
                        {product.product_name}
                      </h2>
                      <p className="text-sm mt-2">
                        {product.product_description}
                      </p>
                      <div className="flex mt-2 justify-between items-center">
                        <section>
                          <p className="text-xl">${product.product_price}</p>
                        </section>
                        {product.quantity > 20 ? (
                          <p className="text-sm">{product.quantity} In Stock</p>
                        ) : (
                          <p className="text-sm text-destructive">
                            Hurry Up! Only {product.quantity} left
                          </p>
                        )}
                      </div>
                      <div className="mt-4 flex items-center">
                        <div className="flex">
                          <Button
                            variant={"secondary"}
                            onClick={() => {
                              const input = document.getElementById(
                                `quantity-${product.product_id}`
                              ) as HTMLInputElement;
                              if (parseInt(input.value) > 1) {
                                input.value = (
                                  parseInt(input.value) - 1
                                ).toString();
                              }
                            }}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <Input
                            type="number"
                            id={`quantity-${product.product_id}`}
                            name={`quantity-${product.product_id}`}
                            min="1"
                            max={product.quantity}
                            defaultValue="1"
                            className="mx-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <Button
                            variant={"secondary"}
                            onClick={() => {
                              const input = document.getElementById(
                                `quantity-${product.product_id}`
                              ) as HTMLInputElement;
                              if (parseInt(input.value) < product.quantity) {
                                input.value = (
                                  parseInt(input.value) + 1
                                ).toString();
                              }
                            }}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Close</AlertDialogCancel>
                  <Button
                    onClick={() => {
                      const selectedQuantity = parseInt(
                        (
                          document.getElementById(
                            `quantity-${product.product_id}`
                          ) as HTMLInputElement
                        ).value
                      );
                      handlePlaceOrder(product.product_id, selectedQuantity);
                    }}
                  >
                    Place Order
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ))}
        </div>
      </div>
    </div>
  );
}
