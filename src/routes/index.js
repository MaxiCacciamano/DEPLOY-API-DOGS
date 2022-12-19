const { Router } = require('express');
const Temperament = require('../models/Temperament');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const Dogs = require('./Dogs');
const Temperaments = require('./Temperaments');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('/dogs',Dogs)
router.use('/temperament', Temperaments)

module.exports = router;
