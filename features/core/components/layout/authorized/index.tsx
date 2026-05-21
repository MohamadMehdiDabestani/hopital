"use server";
import { getUser } from "@/features/auth/utils/dal";
import { Fragment, ReactNode } from "react";
import { AuthorizedLayoutClient } from "./client";
import { Sidebar } from "./sideBar";
import { AppBarHeader } from "./appBarHeader";
import { redirect } from "next/navigation";
import { UserProvider } from "@/features/core";
export async function AuthorizedLayout({ children }: { children: ReactNode }) {
  const user = await getUser();
  if (!user) redirect("/");
  return (
    <UserProvider user={user}>
      <AppBarHeader />
      <Sidebar />
      <AuthorizedLayoutClient>{children}</AuthorizedLayoutClient>
    </UserProvider>
  );
}
