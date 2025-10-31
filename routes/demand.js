import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pickupsRaw = await prisma.rentalSession.groupBy({
      by: ["start_station_id"],
      _count: { start_station_id: true },
    });

    const returnsRaw = await prisma.rentalSession.groupBy({
      by: ["end_station_id"],
      _count: { end_station_id: true },
      where: { end_station_id: { not: null } }
    });

    const stationIds = [
      ...new Set([...pickupsRaw.map(p => p.start_station_id), ...returnsRaw.map(r => r.end_station_id)])
    ];

    const stations = await prisma.station.findMany({
      where: { station_id: { in: stationIds } }
    });

    const stationMap = {};
    stations.forEach(s => stationMap[s.station_id] = s.name);

    const demand = stationIds.map(id => ({
      station: stationMap[id] || "Unknown",
      pickups: pickupsRaw.find(p => p.start_station_id === id)?._count.start_station_id || 0,
      returns: returnsRaw.find(r => r.end_station_id === id)?._count.end_station_id || 0
    }));

    res.json(demand);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
