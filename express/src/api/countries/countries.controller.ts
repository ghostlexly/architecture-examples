import { prisma } from "@/src/providers/database/prisma";

const findAll = async (req, res) => {
  const data = await prisma.country.findMany();
  res.json(data);
};

export default { findAll };
