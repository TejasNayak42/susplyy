"use client";
import { useState } from "react";
import Navbar from "../Navbar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function Example() {
  const [imageUrl, setImageUrl] = useState("");

  const handleImageUrlChange = (e: any) => {
    setImageUrl(e.target.value);
  };

  return (
    <div className="px-5 min-h-[100dvh] pb-20">
      <Navbar />
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="pt-32 w-full max-w-6xl mb-10 text-2xl font-semibold">
          Add Products
        </h1>
      </div>
      <form action="#" method="POST" className="mx-auto max-w-xl">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Product Name</Label>
            <div className="mt-2.5">
              <Input type="text" name="name" id="name" />
            </div>
          </div>
          <div className="sm:col-span-2">
            <Label>Description</Label>
            <div className="mt-2.5">
              <Textarea name="description" id="description" rows={4} />
            </div>
          </div>
          <div className="sm:col-span-2">
            <Label>Unit Price</Label>
            <div className="mt-2.5">
              <Input type="price" name="price" id="price" />
            </div>
          </div>
          <div className="sm:col-span-2">
            <Label>Image</Label>
            <div className="mt-2.5">
              <Input
                type="text"
                name="image"
                id="image"
                onChange={handleImageUrlChange}
              />
              {imageUrl && (
                <div className="mt-10">
                  <Image
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
