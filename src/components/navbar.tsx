import { Plus, Crown } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { UserButton } from "@clerk/nextjs";

export const Navbar = () => {
  return (
    <header className="bg-transparent">
      <div className="flex h-16 gap-4 px-8 items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold">Informal </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Create
          </Button>
          <Button size="sm">
            <Crown className="h-4 w-4 mr-1" />
            Upgrade
          </Button>
          <Button variant="ghost" size="icon">
            <UserButton />
          </Button>
        </div>
      </div>
    </header>
  );
};
