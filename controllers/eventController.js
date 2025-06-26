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
