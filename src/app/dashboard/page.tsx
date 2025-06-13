import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import MainChart from "@/components/charts/MainChart";
import Header from "@/components/Header";

async function fetchSoil() {
  const soilData = await prisma.soil.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  // Separate x and y values
  const xValues = soilData.map((entry) => entry.createdAt.getDate());
  const yValues = soilData.map((entry) => entry.value);

  return { xValues, yValues };
}
async function fetchHumidity(){
  const humidityData = await prisma.humidity.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });
  const x1Values = humidityData.map((entry) => entry.createdAt.getDate());
  const y1Values = humidityData.map((entry) => entry.value);

  return { x1Values, y1Values };
}
async function fetchTemp(){
  const tempData = await prisma.temperature.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });
    const x2Values = tempData.map((entry) => entry.createdAt.getDate());
  const y2Values = tempData.map((entry) => entry.value);
  return { x2Values, y2Values };
}
  async function fetchLight(){
    const LightData = await prisma.light.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
      const x3Values = LightData.map((entry) => entry.createdAt.getDate());
    const y3Values = LightData.map((entry) => entry.value);
    return { x3Values, y3Values };
    
  }


export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const { xValues, yValues } = await fetchSoil();
  const { x1Values, y1Values } = await fetchHumidity();
  const { x2Values, y2Values } = await fetchTemp();
  const { x3Values, y3Values } = await fetchLight();
const title1="Soil Humidity (%)"
const title2=" Humidity (%)"
const title3="Temp"
const title4="Light"
  return (
    <>
       <div className="grid grid-cols-2 justify-items-center gap-4">

      <MainChart xValues={xValues} yValues={yValues} title={title1} />
      <MainChart xValues={x1Values} yValues={y1Values} title={title2}/>
      <MainChart xValues={x2Values} yValues={y2Values} title={title3}/>
      <MainChart xValues={x3Values} yValues={y3Values} title={title4}/>

      </div>

    </>
  );
}

Dashboard.requireAuth = true;
