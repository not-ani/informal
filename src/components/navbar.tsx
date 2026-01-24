import { Crown } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { UserButton } from "@clerk/nextjs";
import { NotificationsDialog } from "./notifications-dialog";
import CreateFormButton from "./create-form-button";

export const Navbar = () => {
  return (
    <header className="bg-transparent">
      <div className="flex h-16 gap-4 px-8 items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold">Informal </h1>
        </div>
        <div className="flex items-center space-x-4">
          <CreateFormButton />
          <Button size="sm">
            <Crown className="h-4 w-4 mr-1" />
            Upgrade
          </Button>
          <NotificationsDialog />
          <Button variant="ghost" size="icon">
            <UserButton />
          </Button>
        </div>
      </div>
    </header>
  );
};
