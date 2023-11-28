"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import UserDropMenu from "./UserDropMenu";

export function AuthButton() {
  
  return (
    <div className="flex">
        <Link href={'/login'}><Button color="default">Log in</Button></Link>
      </div>
    );
  }
  
  const Navbar = () => {
    const { data: session } = useSession();
    
    return (
      <>
        <nav className="dark:bg-black p-3 flex items-center  w-full justify-between sm:px-[100px] min-md:px-[300px] max-md:[400px]">
          <Link href={"/"}>
            <h1 className="text-2xl font-bold hover:opacity-75">ChatWithMe</h1>
          </Link>
          {!session ? <AuthButton /> : <UserDropMenu/> }
          
        </nav>
      </>
    );
  };

export default Navbar;
