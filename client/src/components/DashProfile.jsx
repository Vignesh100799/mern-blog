import React from "react";
import { useSelector } from "react-redux";
import { Button, TextInput } from "flowbite-react";

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form type="submit" className="flex flex-col gap-4">
        <div className="w-32 h-32 self-center cursor-pointer shadow-xl overflow-hidden rounded-full">
          <img
            alt="user"
            src={currentUser.profilePicture}
            className="rounded-full h-full w-full border-8 object-cover border-[lightgrey] "
          />
        </div>
        <TextInput
          defaultValue={currentUser.username}
          type="text"
          placeholder="username"
          id="username"
        />
        <TextInput
          defaultValue={currentUser.email}
          type="email"
          placeholder="email"
          id="email"
        />
        <TextInput type="password" placeholder="password" id="password" />
        <Button
          type="submit"
          gradientDuoTone="purpleToPink"
          className="w-full"
          outline
        >
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};

export default DashProfile;
