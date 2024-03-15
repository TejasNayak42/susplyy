import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const contents = [
  {
    id: 1,
    title: "What is Susply?",
    description:
      "Susply is an eco-friendly supply chain platform for businesses. It simplifies ordering, ensures fast deliveries, and promotes sustainability.",
  },
  {
    id: 2,
    title: "Who can benefit from utilizing Susply?",
    description:
      "Businesses of all sizes looking to streamline operations and prioritize sustainability can benefit from using Susply.",
  },
  {
    id: 3,
    title: "Why aren't the products loading?",
    description:
      "Our server, hosted on Render's free tier, may cause delays in starting up, leading to slower loading. Please wait as it initializes. If issues persist, we may be undergoing maintenance.",
  },
  {
    id: 4,
    title:
      "Why am I unable to Sign In or Sign Up? I keep encountering an error.",
    description:
      "Sign In or Sign Up may encounter errors due to server delays on Render's free tier. Please wait and try again. Contact us if the issue persists.",
  },
];

export default function FAQ() {
  return (
    <div className="mx-auto max-w-6xl mb-48 px-6 lg:px-8">
      <h1 className="w-full text-center max-w-6xl mb-10 text-3xl font-semibold">
        Frequently Asked Questions
      </h1>
      <div className="w-full flex justify-center items-center">
        <Accordion type="single" collapsible className="w-[50rem]">
          {contents.map((content, index) => (
            <AccordionItem key={index} value={`item-${content.id}`}>
              <AccordionTrigger className="text-base text-left">
                {content.title}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-6 text-gray-600">
                {content.description}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
