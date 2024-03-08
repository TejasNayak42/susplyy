"use client";
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Navbar from "../Navbar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function Example() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [producerInfo, setProducerInfo] = useState<any>({});
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

  const handleImageUrlChange = (e: any) => {
    setImageUrl(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const productData = {
      supplier_id: 123,
      product_name: productName,
      product_description: description,
      product_price: parseFloat(price),
      quantity: 100,
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
        console.log("Product added successfully!");
        // Optionally, you can redirect the user or show a success message
      } else {
        console.error("Failed to add product:", response.statusText);
        // Optionally, you can handle error cases here
      }
    } catch (error) {
      console.error("Error adding product:", error);
      // Handle network errors or other unexpected errors here
    }
  };

  return (
    <div className="px-5 min-h-[100dvh] pb-20">
      <Navbar />
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="pt-32 w-full max-w-6xl mb-10 text-2xl font-semibold">
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
                onChange={handleDescriptionChange}
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <Label>Unit Price</Label>
            <div className="mt-2.5">
              <Input
                type="text"
                name="price"
                id="price"
                onChange={handlePriceChange}
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

// import { useState } from "react";
// import Navbar from "../Navbar";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { useCookies } from "react-cookie";

// export default function AddProduct() {
//   const [productData, setProductData] = useState({
//     product_name: "",
//     product_description: "",
//     product_price: "",
//     quantity: "",
//     image_url: ""
//   });

//   const [cookies] = useCookies(["token"]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setProductData({
//       ...productData,
//       [name]: value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch("http://localhost:8080/add-product", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${cookies.token}`
//         },
//         body: JSON.stringify({
//           ...productData,
//           supplier_id: cookies.supplier_id // Assuming supplier_id is stored in cookies
//         })
//       });

//       if (!response.ok) {
//         throw new Error("Failed to add product");
//       }

//       alert("Product added successfully!");
//       // Reset form after successful submission
//       setProductData({
//         product_name: "",
//         product_description: "",
//         product_price: "",
//         quantity: "",
//         image_url: ""
//       });
//     } catch (error) {
//       console.error("Error adding product:", error);
//       // Handle error appropriately
//     }
//   };

//   return (
//     <div className="px-5 min-h-[100dvh] pb-20">
//       <Navbar />
//       <div className="mx-auto max-w-2xl text-center">
//         <h1 className="pt-32 w-full max-w-6xl mb-10 text-2xl font-semibold">
//           Add Products
//         </h1>
//       </div>
//       <form onSubmit={handleSubmit} className="mx-auto max-w-xl">
//         <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
//           <div className="sm:col-span-2">
//             <Label>Product Name</Label>
//             <div className="mt-2.5">
//               <Input type="text" name="product_name" id="product_name" value={productData.product_name} onChange={handleInputChange} />
//             </div>
//           </div>
//           <div className="sm:col-span-2">
//             <Label>Description</Label>
//             <div className="mt-2.5">
//               <Textarea name="product_description" id="product_description" rows={4} value={productData.product_description} onChange={handleInputChange} />
//             </div>
//           </div>
//           <div className="sm:col-span-2">
//             <Label>Unit Price</Label>
//             <div className="mt-2.5">
//               <Input type="text" name="product_price" id="product_price" value={productData.product_price} onChange={handleInputChange} />
//             </div>
//           </div>
//           <div className="sm:col-span-2">
//             <Label>Quantity</Label>
//             <div className="mt-2.5">
//               <Input type="text" name="quantity" id="quantity" value={productData.quantity} onChange={handleInputChange} />
//             </div>
//           </div>
//           <div className="sm:col-span-2">
//             <Label>Image</Label>
//             <div className="mt-2.5">
//               <Input type="text" name="image_url" id="image_url" value={productData.image_url} onChange={handleInputChange} />
//             </div>
//           </div>
//         </div>
//         <div className="mt-10">
//           <Button type="submit" className="w-full">
//             Add Product
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }
