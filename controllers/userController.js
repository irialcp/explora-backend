const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  console.log('✅ Funzione register chiamata con:', req.body);
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('❌ Mancano email o password');
      return res.status(400).json({ message: 'Email e password sono richieste' });
    }

    const userEsiste = await User.findOne({ email });
    if (userEsiste) {
      console.log('❌ Utente già esistente');
      return res.status(400).json({ message: 'Utente già registrato' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const nuovoUtente = new User({ email, password: hashedPassword });
    await nuovoUtente.save();

    const token = jwt.sign({ id: nuovoUtente._id }, process.env.JWT_SECRET);

    console.log('✅ Utente registrato con token:', token);
    return res.status(201).json({ token });

  } catch (err) {
    console.error('❌ Errore in register:', err);
    return res.status(500).json({ message: 'Errore registrazione' });
  }
};

exports.login = async (req, res) => {
  console.log('🔑 Funzione login chiamata con:', req.body);
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e password sono richieste' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Utente non trovato' });
    }

    const passwordCorretta = await bcrypt.compare(password, user.password);
    if (!passwordCorretta) {
      return res.status(401).json({ message: 'Password errata' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    return res.status(200).json({ token });

  } catch (err) {
    console.error('❌ Errore in login:', err);
    return res.status(500).json({ message: 'Errore login' });
  }
};
