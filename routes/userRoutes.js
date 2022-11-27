//Modulo de terceros
const express = require('express');
//Modulo de sistema de archivos
const fs = require('fs');
//Modulo userController
const {createUser,allUsers,oneUser,updateUser,deleteUser, updateMe, deleteMe, getMe, updateMeDatesConstancias,updateMeDatesCapacitador, uploadUserPhoto, tamañoPhotoUser, uploadCapacitadorFirma, tamañoFirmaCapacitador} = require('../controllers/userController')
const {registro,login,olvideContraseña,restablecerContraseña, protect,actualizarContraseña, restrictTo, cerrarSesion, comprobarToken} = require('../controllers/authController');
const router = express.Router();

//Autenticacion
router.route('/registro').post(registro);
router.route('/confirmar/:token').get(comprobarToken)
router.route('/login').post(login)
router.route('/cerrarSesion').get(cerrarSesion)
router.route('/olvidePassword').post(olvideContraseña);
router.route('/restablecerPassword/:token').patch(restablecerContraseña);

//Apartir de aqui las rutas de abajo deben de estar autenticadas un truco para que no pongamos en todos los metodos protect es el sigm router es una mini aplicacion
router.use(protect)
//Rutas para usuarios
router.route('/actualizarMiPassword').patch(actualizarContraseña);

router.route('/me').get(getMe,oneUser);
router.route('/updateMe').patch(uploadUserPhoto,tamañoPhotoUser,updateMe);
router.route('/updateMeDatesConstancias').patch(restrictTo('user'),updateMeDatesConstancias);
router.route('/updateMeDatesCapacitador').patch(restrictTo('capacitador'),uploadCapacitadorFirma,tamañoFirmaCapacitador,updateMeDatesCapacitador);
router.route('/deleteMe').delete(deleteMe);

//Rutas solo para administradores
router.use(restrictTo('administrador','capacitador'))
router.route('/').get(allUsers).post(createUser);
router.route('/:id').get(oneUser).patch(updateUser).delete(deleteUser);

module.exports = router;