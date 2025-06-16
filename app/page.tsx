"use client";
import React, { useState } from "react";
import UserCalendar from "@/components/UserCalendar";

export default function Home() {
  return (

    <div className="container grid w-5/6 min-h-[700px] shadow-none md:shadow-md  rounded-lg md:grid-cols-1 p-3 mt-5">

      <div className="flex  justify-center  h-full">
        <UserCalendar />
      </div>
    </div>
  );

}
