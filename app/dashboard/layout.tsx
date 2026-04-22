import { AuthorizedLayout } from "@/features/core";
import { ReactNode } from "react";


export default function Layout({children} : {children : ReactNode}) {
    return(<AuthorizedLayout>{children}</AuthorizedLayout>)
}