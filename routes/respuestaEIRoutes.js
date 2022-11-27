const express = require('express');

const {createRespuestaEI, oneRespuestaEI, allRespuestaEI, updateRespuestaEI, 
    deleteRespuestaEI, setCursoUserIds, validarCurso, asignarCalificacion} = require('../controllers/respuestaEIController')
const {protect, restrictTo}= require('../controllers/authController')
const router = express.Router({mergeParams: true});
//Todas las rutas deben de estar authenticados
router.use(protect);

router.route('/').post(restrictTo('user'),setCursoUserIds,validarCurso,asignarCalificacion,createRespuestaEI).get(restrictTo( "administrador", "capacitador"),allRespuestaEI);

router.route('/:id').get(restrictTo("administrador", "capacitador"),oneRespuestaEI).patch(restrictTo('administrador'),updateRespuestaEI).delete(restrictTo('administrador'),deleteRespuestaEI);

module.exports = router;