import { Button } from "flowbite-react";
import React from "react";

const CalltoAction = () => {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">Want to learn more about my projects ?</h2>
        <p className="text-gray-500 my-2">Check out my Github page..!</p>
        <Button
          gradientDuoTone="purpleToBlue"
          className="rounded-tl-xl rounded-bl-none"
          outline
        >
          <a
            rel="noopener noreferrer"
            href="https://github.com/Vignesh100799"
            target="_blank"
          >
            GitHub Link To know more about me
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img
          src="https://cdn.thenewstack.io/media/2022/11/fb6f0845-github-lab.jpg"
          alt=""
        />
      </div>
    </div>
  );
};

export default CalltoAction;
