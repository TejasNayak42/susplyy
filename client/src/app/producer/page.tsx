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

interface Product {
  product_name: string;
  product_price: number;
  image_url: string;
  product_description: string;
  quantity: number;
}

export default function Producer() {
  const [products, setProducts] = useState<Product[]>([]);

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

  return (
    <div className="flex px-5 justify-center items-center">
      <Navbar />
      <div className="max-w-6xl pb-20 min-h-screen">
        <h1 className="mt-32 px-5 w-screen max-w-6xl mb-10 text-2xl font-semibold">
          Your Products
        </h1>
        <div className="mt-6 px-5 grid grid-cols-1 gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <AlertDialog key={product.product_name}>
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
                        <div className="flex items-center gap-1 justify-center">
                          <div className="text-xl">
                            ${product.product_price}
                          </div>
                          <div>per piece</div>
                        </div>

                        <p>Stock Left: {product.quantity}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ))}
        </div>
      </div>
    </div>
  );
}
