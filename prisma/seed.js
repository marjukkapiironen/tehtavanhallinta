const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
 
  await prisma.jasen.createMany({
    data: [
      { jasen_id: 1, jasen_nimi: 'Eeva Virtanen', kayttajatunnus: 'eeva.virtanen', salasana: 'eb881772d3704cad02d4b3531ade5052d901b108366e01991d7d7db4d80dc899' },
      { jasen_id: 2, jasen_nimi: 'Matti Korhonen', kayttajatunnus: 'matti.korhonen', salasana: 'eb881772d3704cad02d4b3531ade5052d901b108366e01991d7d7db4d80dc899' },
      { jasen_id: 3, jasen_nimi: 'Liisa Koskinen', kayttajatunnus: 'liisa.koskinen', salasana: 'eb881772d3704cad02d4b3531ade5052d901b108366e01991d7d7db4d80dc899' },
      { jasen_id: 4, jasen_nimi: 'Juhani Lahtinen', kayttajatunnus: 'juhani.lahtinen', salasana: 'eb881772d3704cad02d4b3531ade5052d901b108366e01991d7d7db4d80dc899' },
      { jasen_id: 5, jasen_nimi: 'Anna Hämäläinen', kayttajatunnus: 'anna.hamalainen', salasana: 'eb881772d3704cad02d4b3531ade5052d901b108366e01991d7d7db4d80dc899' },
    ],
  });

  
  await prisma.tehtava.createMany({
    data: [
      { tehtava_id: 4, tehtava_nimi: 'Projektisuunnitelman hiominen', kuvaus: '<p>Käy läpi suunnitelman toteutusvaiheet.</p>', deadline: new Date('2024-04-25T11:30:00') },
      { tehtava_id: 5, tehtava_nimi: 'Lähetä raportti asiakkaalle', kuvaus: '<p>Viimeistele raportti ja lähetä.</p>', deadline: new Date('2024-05-22T13:00:00') },
    ],
  });

  
  await prisma.tehtava_jasen.createMany({
    data: [
      { tehtava_id: 4, jasen_id: 2 },
      { tehtava_id: 4, jasen_id: 3 },
      { tehtava_id: 4, jasen_id: 4 },
      { tehtava_id: 5, jasen_id: 4 },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });