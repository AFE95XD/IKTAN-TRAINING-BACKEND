//Modulo de terceros
const express = require('express');
//Modulo tourController
const {createCurso,oneCurso,allCursos,updateCurso,deleteCurso, aliasTopCurso, getCursoEstadisticas, getPlanMensual, uploadCursoImages, tamañoImagenesCurso} = require('../controllers/cursoController')
const {protect, restrictTo} = require('../controllers/authController');
const router = express.Router();

//Ruta anidada
const reviewRoutes = require('../routes/reviewRoutes');
router.use('/:cursoId/reviews', reviewRoutes);

const evaluacionInicialRoutes = require('../routes/evaluacionInicialRoutes');
router.use('/:cursoId/evaluaciones-iniciales', evaluacionInicialRoutes);

const evaluacionFinalRoutes = require('../routes/evaluacionFinalRoutes');
router.use('/:cursoId/evaluaciones-finales', evaluacionFinalRoutes);

//ruta de los 5 tours con mejor promedio y mas baratos
router.route('/top-5-cursos').get(aliasTopCurso,allCursos);

//ruta de las estadisticas de los tours
router.route('/estadisticas').get(getCursoEstadisticas);
//ruta para el mes mas ocupado de un año determinado
router.route('/plan-mensual/:year').get(protect,restrictTo("administrador","capacitador"),getPlanMensual);


//Podemos tener middlerware que lean un valor de una url
//Este middelware solo se ejecuta en tourRoutes y donde la url tenga una variable id
//router.param('id'/*,checkID*/ );

router.route('/').post(protect,restrictTo("administrador", "capacitador"),createCurso).get(allCursos);
router.route('/:id').get(oneCurso).patch(protect,restrictTo("administrador", "capacitador"),uploadCursoImages, tamañoImagenesCurso,updateCurso).delete(protect,restrictTo("administrador","capacitador"),deleteCurso);


module.exports = router;

