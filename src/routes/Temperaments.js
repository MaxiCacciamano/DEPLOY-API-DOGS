const {Router} = require('express');
const router = Router();
const TemperantC = require('../Contrtols/TemperamentsC');

router.get('/',TemperantC.getTemperament)

module.exports = router