"use client";

import { Fragment, useEffect } from "react";
import { useUserStore } from "@/features/core/store";

export const UserProvider = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: any;
}) => {
  const { setUser } = useUserStore();

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return <Fragment>{children}</Fragment>;
};
