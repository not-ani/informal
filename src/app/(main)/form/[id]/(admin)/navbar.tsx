"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { useUser } from "@clerk/nextjs";
import { ChevronDownIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFormContext } from "./form-context";
import { CollaboratorsDialog } from "./edit/collaborators";

export const Navbar = () => {
  const formContext = useFormContext();
  const { user } = useUser();
  const pathname = usePathname();

  if (!formContext) {
    return <div>Form not found</div>;
  }

  const adminRoutes = [
    { path: `/form/${formContext._id}/edit`, label: "Edit Form" },
    { path: `/form/${formContext._id}/responses`, label: "Responses" },
    { path: `/form/${formContext._id}/collaborators`, label: "Collaborators" },
    { path: `/form/${formContext._id}/settings`, label: "Settings" },
  ];

  const currentRoute = adminRoutes.find((route) =>
    pathname.startsWith(route.path),
  ) || { path: pathname, label: "Unknown" };

  return (
    <header className="border-b-2 px-4 md:px-6">
      <div className="bg-background  h-12 flex flex-row justify-between items-center w-full gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/app">LOGO</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/form">{user?.fullName}&apos;s Account</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/form/${formContext._id}`}>
                  {formContext.name}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-auto p-0 font-normal">
                    {currentRoute.label}
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {adminRoutes.map((route) => (
                    <DropdownMenuItem key={route.path} asChild>
                      <Link href={route.path}>{route.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex gap-4 items-center justify-evenly">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"outline"} asChild>
                <Link href={`/form/${formContext._id}`}>
                  <EyeIcon />
                  <span>View Form</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>View Form</TooltipContent>
          </Tooltip>
          <CollaboratorsDialog formId={formContext._id} />
        </div>
      </div>
    </header>
  );
};
