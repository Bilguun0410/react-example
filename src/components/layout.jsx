import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export default function Layout() {
  return (
    <main className="flex flex-col min-h-dvh w-dvw">
      <Header />
      <div className="flex-1 container mx-auto mt-14 flex flex-col">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
}
