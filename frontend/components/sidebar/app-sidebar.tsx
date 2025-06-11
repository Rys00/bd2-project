"use client";

import {
  IconActivity,
  IconChartLine,
  IconDashboard,
  IconSettings,
  IconShoppingBag,
  IconStar,
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
      title: "Złóż zamówienia",
      url: "/order",
      icon: IconShoppingBag,
    },
    {
      title: "Panel statystyczny",
      url: "/dashboard",
      icon: IconDashboard,
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
      name: "Aktywność klientów",
      url: "/dashboard/activity",
      icon: IconActivity,
    },
    {
      name: "Przychody",
      url: "/dashboard/income",
      icon: IconChartLine,
    },
    {
      name: "Popularność produktów",
      url: "/dashboard/products",
      icon: IconStar,
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
