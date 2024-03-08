import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

const stats = [
  {
    id: 1,
    img: "/customer1.svg",
    name: "Customer",
    description: "Order Products and Track Shipments Easily.",
    link: "/customer/login",
  },
  {
    id: 2,
    img: "/register.svg",
    name: "Producer",
    description: "Add Products and Manage Inventory Seamlessly.",
    link: "/producer/login",
  },
  {
    id: 3,
    img: "/cargo.svg",
    name: "Shipment Provider",
    description: "Deliver Products Sustainably with Eco-Friendly Practices.",
    link: "/shipment-provider/login",
  },
];

export default function LoginOptions() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="flex flex-col justify-center items-center"
          >
            <div className="w-60 h-60 flex justify-center items-center">
              <Image
                src={stat.img}
                alt={stat.name}
                className="w-full"
                width={500}
                height={500}
              ></Image>
            </div>
            <h1 className="text-xl font-semibold mb-2">{stat.name}</h1>
            <div className="text-base leading-7 text-gray-600">
              {stat.description}
            </div>
            <Link href={stat.link}>
              <Button className="mt-5">Continue</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
