// scripts/seedMissions.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Mission = require('../models/Mission');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connesso. Inserisco missioni...');

    await Mission.deleteMany(); // pulisce missioni vecchie

    await Mission.insertMany([
      {
        title: 'Partecipa a un evento musicale',
        description: 'Trova un concerto o jam session nella tua zona',
        points: 20,
        eventCategoryRequired: 'musica',
        daily: true
      },
      {
        title: 'Visita un museo',
        description: 'Scopri l’arte nella tua città',
        points: 25,
        eventCategoryRequired: 'arte',
        daily: true
      },
      {
        title: 'Partecipa a un’attività sportiva',
        description: 'Muovi il corpo: parkour, arrampicata o altro!',
        points: 15,
        eventCategoryRequired: 'sport',
        daily: true
      }
    ]);

    console.log('✅ Missioni inserite');
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('Errore:', err);
  });
