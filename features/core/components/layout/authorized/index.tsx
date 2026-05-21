"use server";
import { getUser } from "@/features/auth/utils/dal";
import { Fragment, ReactNode } from "react";
import { AuthorizedLayoutClient } from "./client";
import { Sidebar } from "./sideBar";
import { AppBarHeader } from "./appBarHeader";
export async function AuthorizedLayout({ children }: { children: ReactNode }) {
  const user = await getUser();

  return (
    <Fragment>
      <AppBarHeader
        userName={user ? user.firstName + user.lastName : "کاربر"}
      />
      <Sidebar />
      <AuthorizedLayoutClient>{children}</AuthorizedLayoutClient>
    </Fragment>
  );
}
