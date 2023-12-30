import { prisma } from "@/src/providers/database/prisma";
import { api } from "../lib/api";

const main = async () => {
  console.log("Receiving data from geonames.org ...");

  const data = await api.get("http://api.geonames.org/countryInfoJSON", {
    params: {
      username: "ghostlexly",
      formatted: "true",
      style: "full",
      lang: "FR",
    },
  });

  await prisma.$transaction(async (prisma) => {
    for (let i = 0; i < data.geonames.length; i++) {
      const geoname = data.geonames[i];
      console.log(`Creating country ${geoname.countryName} ...`);
      await prisma.country.create({
        data: {
          countryCode: geoname.countryCode,
          countryName: geoname.countryName,
          isoAlpha3: geoname.isoAlpha3,
          isoNumeric: parseInt(geoname.isoNumeric),
          continentName: geoname.continentName,
          continent: geoname.continent,
          fipsCode: geoname.fipsCode,
          currencyCode: geoname.currencyCode,
          capital: geoname.capital,
          languages: geoname.languages,
          population: parseInt(geoname.population),
          postalCodeFormat: geoname.postalCodeFormat,
        },
      });
    }
  });

  console.log("All transactions are applied !");
};

main();
