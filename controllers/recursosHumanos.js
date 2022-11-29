const User = require('../models/User');
const catchAsync = require('../utils/catchAsync')
const createUsers = catchAsync(async(req,res,next)=>{
    const users = req.body;

    for(var x= 0; x<= users.length; x++){
        const numeroUsers = users[x];
        /*
            Datos a permitir nombre, apellidoPaterno, apellidoMaterno, correo, contraseña, confirmarContraseña
        */
        const user = new User.create({numeroUsers});
    }
})