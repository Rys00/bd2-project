"use client";

import {
  IconCashRegister,
  IconCup,
  IconSettings,
  IconShoppingBag,
  IconTrendingUp,
} from "@tabler/icons-react";
import * as React from "react";

import { NavDocuments } from "@/components/sidebar/nav-documents";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

const data = {
  navMain: [
    {
      title: "Panel kasjera",
      url: "/order",
      icon: IconCashRegister,
    },
    {
      title: "Panel statystyczny",
      url: "/dashboard",
      icon: IconTrendingUp,
    },
  ],
  navSecondary: [
    {
      title: "Ustawienia",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
  ],
  documents: [
    {
      name: "Zamówienia",
      url: "/dashboard/orders",
      icon: IconShoppingBag,
    },
    {
      name: "Produkty",
      url: "/dashboard/products",
      icon: IconCup,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 text-primary"
            >
              <Link href="/">
                <span className="text-2xl font-semibold">Bufet PW</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
