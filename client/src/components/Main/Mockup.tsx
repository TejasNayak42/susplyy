import React from "react";

const Mockup = () => {
  return (
    <div className="mx-auto max-w-6xl mb-48 px-6 lg:px-8">
      <h1 className="w-full text-center max-w-6xl md:mb-5 mb-10 text-3xl font-semibold">
        Mockups
      </h1>
      <img
        src="/mockup.png"
        alt="mockup"
        width={500}
        height={500}
        className="w-full"
      ></img>
    </div>
  );
};

export default Mockup;
