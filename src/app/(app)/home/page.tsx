import React from "react";
import { BiMale, BiFemale } from "react-icons/bi"; // Ikon yang sesuai
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const userGender = "female"; // "male" atau "female"

  return (
    <div className="container mx-auto p-6">
      {/* User Info Card */}
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center space-x-6">
          {/* Gender Icon Avatar */}
          <div className="flex-shrink-0">
            {userGender === "female" ? (
              <BiFemale className="w-24 h-24 text-pink-500 rounded-full border-2 border-pink-300 p-2" />
            ) : (
              <BiMale className="w-24 h-24 text-blue-500 rounded-full border-2 border-blue-300 p-2" />
            )}
          </div>

          {/* User Info */}
          <div>
            <CardDescription>
              <h4 className="font-semibold text-xl">John Doe</h4>
              <p className="text-sm text-muted">Web Developer</p>
              <p className="text-sm">Email: johndoe@example.com</p>
              <p className="text-sm">Phone: +123456789</p>
            </CardDescription>

            {/* Gender label */}
            <div className="mt-4 flex items-center">
              {userGender === "female" ? (
                <BiFemale className="text-pink-500 text-xl" />
              ) : (
                <BiMale className="text-blue-500 text-xl" />
              )}
              <p className="ml-2 text-sm capitalize">{userGender}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Button */}
      <div className="mb-6">
        <Button size="lg" className="w-full" variant="default">
          View Job Categories
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
