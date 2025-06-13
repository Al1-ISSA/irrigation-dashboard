"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import LiveCard from "@/components/LiveCard";
import PumpController from "@/components/controllers/PumpController";
import AlarmController from "@/components/controllers/AlarmController";
import LightController from "@/components/controllers/LightController";
import AutomationController from "@/components/controllers/AutomationController";
import ShadeController from "@/components/controllers/ShadeController";

export default function Controller() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Controllers</h1>
      </div>
      <div className="grid grid-cols-2 justify-items-center gap-4">
        <PumpController />
        <AlarmController />
        <LightController />
        <AutomationController />
        <ShadeController />
      </div>
    </>
  );
}
