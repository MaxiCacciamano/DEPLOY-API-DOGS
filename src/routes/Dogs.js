const {Router} = require('express');
const router = Router();
const DogsC = require('../Contrtols/DogsC');

router.get('/', DogsC.GetDogs);
router.get('/:id', DogsC.GetDogsId)
router.post('/',DogsC.postDogs)
router.delete('/delete/:id', DogsC.deleteDogs)
module.exports = router;