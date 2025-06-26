"use client";
import React, { useState } from "react";
import UserCalendar from "@/components/UserCalendar";

export default function Home() {
  return (
    <>
      <div className="container max-w-7xl  min-h-[700px] md:min-h-auto shadow-none md:shadow-md rounded-lg p-3 mt-5">
        <div className="grid grid-cols-1 gap-4">
          <UserCalendar />
        </div>
      </div>
    </>

  );

}
