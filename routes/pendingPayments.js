import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { status: "PENDING" },
      include: {
        session: { include: { student: true } }
      },
      orderBy: { created_at: "desc" }
    });

    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
