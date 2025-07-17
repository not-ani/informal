"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NavLink {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

interface NavigationTabsProps {
  links: NavLink[];
}

export function NavigationTabs({ links }: NavigationTabsProps) {
  const pathname = usePathname();

  // Determine the active tab based on the current pathname
  const activeTabId = React.useMemo(() => {
    const currentLink = links.find((link) => link.href === pathname);
    return currentLink ? currentLink.id : links[0]?.id;
  }, [pathname, links]);

  return (
    <Tabs value={activeTabId}>
      <ScrollArea>
        <TabsList className="mb-3 h-auto w-min-[300px] -space-x-px bg-background p-0 shadow-sm shadow-black/5 rtl:space-x-reverse">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <TabsTrigger
                key={link.id}
                value={link.id}
                className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
                asChild
              >
                <Link href={link.href}>
                  <Icon
                    className="-ms-0.5 me-1.5 opacity-60"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  {link.label}
                </Link>
              </TabsTrigger>
            );
          })}
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Tabs>
  );
}
