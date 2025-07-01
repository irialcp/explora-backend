const Event = require('../models/Event');

// GET /api/events
exports.getEvents = async (req, res) => {
  try {
    const eventi = await Event.find();
    res.json(eventi);
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

