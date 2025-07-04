const Mission = require('../models/Mission');
const User = require('../models/User');

// GET /api/missions
exports.getMissions = async (req, res) => {
  try {
    const missions = await Mission.find({ daily: true });
    res.json(missions);
  } catch (err) {
    console.error('Errore nel recupero missioni:', err);
    res.status(500).json({ message: 'Errore nel recuperare missioni' });
  }
};

// POST /api/missions/complete/:id
exports.completeMission = async (req, res) => {
  try {
    const userId = req.user.id;
    const missionId = req.params.id;

    const mission = await Mission.findById(missionId);
    if (!mission) return res.status(404).json({ message: 'Missione non trovata' });

    const user = await User.findById(userId);
    const giàCompletata = user.completedMissions.some(m => m.missionId.toString() === missionId);

    if (giàCompletata) {
      return res.status(400).json({ message: 'Missione già completata' });
    }

    // aggiungi missione completata + punti
    user.completedMissions.push({ missionId: mission._id });
    user.points += mission.points;

    await user.save();

    res.json({ message: 'Missione completata!', nuoviPunti: user.points });
  } catch (err) {
    console.error('Errore completamento missione:', err);
    res.status(500).json({ message: 'Errore nel completare la missione' });
  }
};

// GET /api/missions/today/count
exports.countTodayMissions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const today = new Date();
    today.setHours(0,0,0,0);

    const count = await Mission.countDocuments({ daily: true });
    const doneToday = user.completedMissions.filter(cm => {
      return cm.completedAt >= today;
    }).length;

    res.json({ totalDaily: count, completedToday: doneToday });
  } catch (err) {
    res.status(500).json({ message: 'Errore nel conteggio missioni' });
  }
};

