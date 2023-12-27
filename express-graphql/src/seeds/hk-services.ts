import { prisma } from "../providers/database/prisma";

const main = async () => {
  await prisma.housekeeperService.createMany({
    data: [
      {
        key: "HOUSE",
        text: "Ménage à domicile",
        availableForSap: true,
      },
      {
        key: "WINDOW",
        text: "Nettoyage des vitres",
        availableForSap: true,
      },
      {
        key: "BUILDING",
        text: "Nettoyage des bâtiments",
      },
      {
        key: "SHORT_TERM_RENTAL",
        text: "Nettoyage location courte durée",
      },
      {
        key: "CARPET_AND_SOFA",
        text: "Nettoyage moquette et canapé",
        availableForSap: true,
      },
      {
        key: "IRONING",
        text: "Repassage",
        availableForSap: true,
      },
      {
        key: "PROFESSIONAL_PREMISES",
        text: "Nettoyage locaux professionnels",
      },
      {
        key: "AFTER_WORK",
        text: "Nettoyage après travaux",
      },
      {
        key: "INDUSTRIAL",
        text: "Nettoyage industriel",
      },
      {
        text: "Nettoyage de véhicules",
        key: "VEHICLE",
      },
    ],
  });

  console.log("All transactions are applied !");
};

main();
