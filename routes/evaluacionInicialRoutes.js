const express = require('express');

const {createEvaluacionInicial, allEvaluacionInicial, oneEvaluacionInicial, updateEvaluacionInicial, deleteEvaluacionInicial, setCursoUserIds, validarCurso} = require('../controllers/evaluacionInicialController')
const {protect, restrictTo}= require('../controllers/authController')
const router = express.Router({mergeParams: true});
//Todas las rutas deben de estar authenticados
router.use(protect);

router.route('/').post(restrictTo('administrador', 'capacitador'),setCursoUserIds,validarCurso,createEvaluacionInicial).get(restrictTo("user", "administrador", "capacitador"),allEvaluacionInicial);

router.route('/:id').get(restrictTo("user", "administrador", "capacitador"),oneEvaluacionInicial).patch(restrictTo('administrador','capacitador'),updateEvaluacionInicial).delete(restrictTo('administrador','capacitador'),deleteEvaluacionInicial);

module.exports = router;