import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const activeRentals = await prisma.rentalSession.count({
      where: { end_time: null }
    });

    const overdueRentals = await prisma.rentalSession.count({
      where: {
        due_date: { lt: new Date() },
        payment: { status: "PENDING" }
      }
    });

    const pendingPayments = await prisma.payment.count({
      where: { status: "PENDING" }
    });

    const revenueTodayAgg = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: "PAID",
        paid_at: {
          gte: new Date(new Date().setHours(0,0,0,0)),
          lt: new Date(new Date().setHours(24,0,0,0))
        }
      }
    });

    const revenueMonthAgg = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: "PAID",
        paid_at: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
        }
      }
    });

    const stationsAtCapacity = await prisma.station.count({
      where: { available_cycles: 0 }
    });

    // Most frequent student
    let frequentStudent = { name: "—" };
    const freqRaw = await prisma.rentalSession.groupBy({
      by: ["student_id"],
      _count: { student_id: true },
      orderBy: { _count: { student_id: "desc" } },
      take: 1
    });
    if (freqRaw.length > 0) {
      const student = await prisma.student.findUnique({
        where: { student_id: freqRaw[0].student_id },
        select: { name: true }
      });
      if (student) frequentStudent = student;
    }

    // Busiest station
    let busiestStation = { name: "—" };
    const busyRaw = await prisma.rentalSession.groupBy({
      by: ["start_station_id"],
      _count: { start_station_id: true },
      orderBy: { _count: { start_station_id: "desc" } },
      take: 1
    });
    if (busyRaw.length > 0) {
      const station = await prisma.station.findUnique({
        where: { station_id: busyRaw[0].start_station_id },
        select: { name: true }
      });
      if (station) busiestStation = station;
    }

    res.json({
      activeRentals: activeRentals || 0,
      overdueRentals: overdueRentals || 0,
      pendingPayments: pendingPayments || 0,
      revenueToday: revenueTodayAgg._sum.amount ? Number(revenueTodayAgg._sum.amount) : 0,
      revenueMonth: revenueMonthAgg._sum.amount ? Number(revenueMonthAgg._sum.amount) : 0,
      stationsAtCapacity: stationsAtCapacity || 0,
      frequentStudent,
      busiestStation
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
