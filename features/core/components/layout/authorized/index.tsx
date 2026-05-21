"use server";
import { getUser } from "@/features/auth/utils/dal";
import { Fragment, ReactNode } from "react";
import { AuthorizedLayoutClient } from "./client";
import { Sidebar } from "./sideBar";
import { AppBarHeader } from "./appBarHeader";
import { redirect } from "next/navigation";
export async function AuthorizedLayout({ children }: { children: ReactNode }) {
  const user = await getUser();
  if (!user) redirect("/");
  return (
    <Fragment>
      <AppBarHeader
        userName={user.firstName + user.lastName}
        role={user.role}
      />
      <Sidebar />
      <AuthorizedLayoutClient>{children}</AuthorizedLayoutClient>
    </Fragment>
  );
}
