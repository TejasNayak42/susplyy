"use client";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import Navbar from "../Navbar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Example() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [cookies] = useCookies(["token"]);

  const handleProductNameChange = (e: any) => {
    setProductName(e.target.value);
  };

  const handleDescriptionChange = (e: any) => {
    setDescription(e.target.value);
  };

  const handlePriceChange = (e: any) => {
    setPrice(e.target.value);
  };

  const handleQuantityChange = (e: any) => {
    setQuantity(e.target.value);
  };

  const handleImageUrlChange = (e: any) => {
    setImageUrl(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const productData = {
      supplier_id: "",
      product_name: productName,
      product_description: description,
      product_price: parseFloat(price),
      quantity: parseInt(quantity),
      image_url: imageUrl,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/supplier/addProducts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.token}`,
          },
          body: JSON.stringify(productData),
        }
      );

      if (response.ok) {
        setProductName("");
        setDescription("");
        setPrice("");
        setQuantity("");
        setImageUrl("");
        console.log("Product added successfully!");
      } else {
        console.error("Failed to add product:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="px-5 min-h-[100dvh] py-32">
      <Navbar />
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="w-full max-w-6xl mb-10 text-2xl font-semibold">
          Add Products
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="mx-auto max-w-xl">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Product Name</Label>
            <div className="mt-2.5">
              <Input
                type="text"
                name="name"
                id="name"
                value={productName}
                onChange={handleProductNameChange}
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <Label>Description</Label>
            <div className="mt-2.5">
              <Textarea
                name="description"
                id="description"
                rows={4}
                value={description}
                onChange={handleDescriptionChange}
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <Label>Unit Price</Label>
            <div className="mt-2.5">
              <Input
                type="number"
                name="price"
                id="price"
                value={price}
                onChange={handlePriceChange}
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <Label>Quantity</Label>
            <div className="mt-2.5">
              <Input
                type="number"
                name="quantity"
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <Label>Image</Label>
            <div className="mt-2.5">
              <Input
                type="text"
                name="image"
                id="image"
                value={imageUrl}
                onChange={handleImageUrlChange}
              />
              {imageUrl && (
                <div className="mt-10">
                  <img
                    width={500}
                    height={500}
                    src={imageUrl}
                    alt="Preview"
                    className="max-w-80 aspect-video mx-auto"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-10">
          <Button type="submit" className="w-full">
            Add Product
          </Button>
        </div>
      </form>
    </div>
  );
}
