const express = require('express');
//Acesso a los parametros de la anterior ruta
const router = express.Router({mergeParams: true});
const {createReview, allReviews, deleteReview, updateReview,setCursoUserIds, oneReview} = require('../controllers/reviewController')
const {protect, restrictTo}= require('../controllers/authController')

//Todas las rutas deben de estar authenticados
router.use(protect);
router.route('/').post(restrictTo('user'),setCursoUserIds,createReview).get(allReviews);

router.route('/:id').get(oneReview).patch(restrictTo('user', 'administrador'),updateReview).delete(restrictTo('user', 'administrador'),deleteReview);
module.exports = router;