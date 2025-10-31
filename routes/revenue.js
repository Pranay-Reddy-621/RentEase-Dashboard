import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { status: "PAID" },
      select: { amount: true, paid_at: true },
      orderBy: { paid_at: "asc" }
    });

    const revenueMap = {};
    payments.forEach(p => {
      const date = p.paid_at.toISOString().split("T")[0];
      revenueMap[date] = (revenueMap[date] || 0) + parseFloat(p.amount);
    });

    const revenue = Object.keys(revenueMap).map(date => ({
      date,
      total: revenueMap[date]
    }));

    res.json(revenue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
