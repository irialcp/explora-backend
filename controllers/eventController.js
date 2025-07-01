const Event = require('../models/Event');

// GET /api/events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    console.error('❌ Errore nel recuperare eventi:', err);
    res.status(500).json({ message: 'Errore nel recupero eventi' });
  }
};

// POST /api/events
exports.createEvent = async (req, res) => {
  try {
    const { title, description, category, location, date, source } = req.body;

    if (!title || !date || !location) {
      return res.status(400).json({ message: 'Titolo, data e location sono obbligatori' });
    }

    const nuovoEvento = new Event({
      title,
      description,
      category,
      location,
      date,
      source
    });

    await nuovoEvento.save();
    res.status(201).json(nuovoEvento);
  } catch (err) {
    console.error('❌ Errore nella creazione evento:', err);
    res.status(500).json({ message: 'Errore nel creare evento' });
  }
};

// GET /api/events/nearby?lng=12.34&lat=56.78&radius=5
exports.getNearbyEvents = async (req, res) => {
  try {
    const { lng, lat, radius = 5 } = req.query;
    if (!lng || !lat) return res.status(400).json({ message: 'lng e lat obbligatori' });

    const events = await Event.find({
      location: {
        $geoWithin: {
          $centerSphere: [
            [ parseFloat(lng), parseFloat(lat) ],
            parseFloat(radius) / 6378.1
          ]
        }
      }
    }).limit(100);

    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel recupero eventi vicini' });
  }
};

// Pipeline esportata da Compass
exports.countByCategory = async (req, res) => {
  try {
    const pipeline = [
      { $match: { date: { $gte: new Date() } } },    // oppure ISODate statico se preferisci
      { $group: { _id: "$category", total: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ];
    const result = await Event.aggregate(pipeline);
    res.json(result);
  } catch (err) {
    console.error('❌ Errore countByCategory:', err);
    res.status(500).json({ message: 'Errore aggregazione categorie' });
  }
};

// Eventi più vicini ordinati per distanza
exports.closestEvents = async (req, res) => {
  try {
    const { lng, lat, maxDistance = 5000, limit = 10 } = req.query;
    if (!lng || !lat)
      return res.status(400).json({ message: 'lng e lat obbligatori' });

    const coords = [ parseFloat(lng), parseFloat(lat) ];
    const docs = await Event.aggregate([
      {
        $geoNear: {
          near:           { type: "Point", coordinates: coords },
          distanceField:  "dist.calculated",
          maxDistance:    parseFloat(maxDistance),  // in metri
          spherical:      true
        }
      },
      { $limit: parseInt(limit) },
      { $project: { title:1, category:1, date:1, "dist.calculated":1 } }
    ]);
    res.json(docs);
  } catch (err) {
    console.error('❌ Errore closestEvents:', err);
    res.status(500).json({ message: 'Errore geoNear' });
  }
};

// Statistiche
exports.comprehensiveStats = async (req, res) => {
  try {
    const { lng, lat, maxDistance = 10000, limit = 5 } = req.query;
    const now = new Date();

    // 1) Aggregation per byCategory + upcoming (su tutto il DB)
    const facetStage = {
      $facet: {
        byCategory: [
          { $match: { date: { $gte: now } } },
          { $group:    { _id: "$category", count: { $sum: 1 } } },
          { $sort:     { count: -1 } }
        ],
        upcoming: [
          { $match: { date: { $gte: now } } },
          { $sort:  { date: 1 } },
          { $limit: 5 }
        ]
      }
    };
    const [basicStats] = await Event.aggregate([ facetStage ]);

    // 2) Se sono passate coordinate, fai la geo-aggregation separata
    let closest = [];
    if (lng && lat) {
      const coords = [ parseFloat(lng), parseFloat(lat) ];
      closest = await Event.aggregate([
        {
          $geoNear: {
            near:          { type: "Point", coordinates: coords },
            distanceField: "distance",
            maxDistance:   parseFloat(maxDistance),
            spherical:     true
          }
        },
        { $limit: parseInt(limit) },
        { $project: { _id: 0, title: 1, distance: 1 } }
      ]);
    }

    // 3) Ricompone il JSON finale
    const result = {
      byCategory: basicStats.byCategory,
      upcoming:   basicStats.upcoming
    };
    if (closest.length) {
      result.closest = closest;
    }

    return res.json(result);

  } catch (err) {
    console.error('❌ Errore comprehensiveStats:', err);
    return res.status(500).json({ message: 'Errore comprehensiveStats' });
  }
};



