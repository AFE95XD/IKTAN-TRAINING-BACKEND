const express = require('express');

const {createEvaluacionFinal, allEvaluacionFinal, oneEvaluacionFinal, updateEvaluacionFinal, deleteEvaluacionFinal, setCursoUserIds, validarCurso} = require('../controllers/evaluacionFinalController')
const {protect, restrictTo}= require('../controllers/authController')
const router = express.Router({mergeParams: true});
//Todas las rutas deben de estar authenticados
router.use(protect);

router.route('/').post(restrictTo('administrador', 'capacitador'),setCursoUserIds,validarCurso,createEvaluacionFinal).get(restrictTo("user", "administrador", "capacitador"),allEvaluacionFinal);

router.route('/:id').get(restrictTo("user", "administrador", "capacitador"),oneEvaluacionFinal).patch(restrictTo('administrador','capacitador'),updateEvaluacionFinal).delete(restrictTo('administrador'),deleteEvaluacionFinal);

module.exports = router;