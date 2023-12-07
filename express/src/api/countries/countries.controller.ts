import { prisma } from "@/src/providers/database/prisma";

const index = async (req, res) => {
  const data = await prisma.country.findMany();
  res.json(data);
};

export default { index };
