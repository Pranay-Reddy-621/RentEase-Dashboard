import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const sessions = await prisma.rentalSession.findMany({
      orderBy: { start_time: "desc" },
      take: 10,
      include: {
        student: true,
        startStation: true,
        endStation: true,
        payment: true
      }
    });

    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
