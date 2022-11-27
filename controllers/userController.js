const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
//const APIFeature = require('../utils/apiFeature');
const AppError = require('../utils/AppError');
const {deleteOne, updateOne, getOne, getAll} = require('../controllers/handleFactory')
//Modulo para la carga de archivos desde el cliente al servidor
const multer = require('multer');
//Modulo para modificar el tamaño de la photo user
const sharp = require('sharp');
/*
//Manejar los archivos de imagen
//Disco de la memoria lo usamos si no necesitamos procesamiento de imagenes
const multerStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null,'public/img/users')
    },
    filename: (req,file,cb)=>{
        const extension = file.mimetype.split('/')[1];
        cb(null,`user-${req.user.id}-${Date.now()}.${extension}`)
    }
});*/

//Es mejor manejar la imagen en la memoria
const multerStorage = multer.memoryStorage();
//Comprobar si el archivo subido es una imagen
const multerFilter = (req,file,cb)=>{
    console.log(file)
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }else{
        //Le pasamos un error
        cb(new AppError("No es una imagen. Porfavor cargue solo imagenes",400),false)
    }
}

const upload = multer({
    storage : multerStorage,
    fileFilter : multerFilter
})
//User
const uploadUserPhoto = upload.single('photo');
//Procesamiento de imagenes
const tamañoPhotoUser =catchAsync( async(req,res,next)=>{
    if(!req.file) return next();
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`
    await sharp(req.file.buffer).resize(500,500).toFormat('jpeg').jpeg({quality: 90}).toFile(`public/cliente/img/users/photo/${req.file.filename}`)
    next();
})
//Capacitador
const uploadCapacitadorFirma = upload.single('firmaElectronica');
const tamañoFirmaCapacitador =catchAsync( async(req,res,next)=>{
    if(!req.file) return next();
    req.file.filename = `user-${req.user.id}-${Date.now()}.png`
    await sharp(req.file.buffer).resize(310,93).toFormat('png').toFile(`public/servidor/firmasElectronicas/${req.file.filename}`)
    next();
})

const filtrarObj = (obj,...parametrosPermitidos) =>{
    const newObj ={};
    Object.keys(obj).forEach(el =>{
        if(parametrosPermitidos.includes(el)) newObj[el]= obj[el]
    });
    return newObj;
}

///////Controladores de usuarios/////////77

//Acualizar usuario que esta autenticado por el mismo
//Comun mente las aplicaciones web usan una ruta solo para cambiar usuario y contraseña y tra ruta para modificar sus datos generales
const updateMe = catchAsync(async(req,res,next)=>{
    //1)Crear un error si el usuario intenta actualizar su contraseña
    const contraseña = req.body.contraseña;
    const confirmarContraseña = req.body.confirmarContraseña;
    if(contraseña || confirmarContraseña){
        return next(new AppError("Esta ruta no es para actualizar contraseñas.Porfavor use /actualizarMiPassword",400))
    } 
    //2)Actualizar documento
    //New: true actualiza el nuevo documento con la informacion que le vamos a pasar
    const filtrarBody = filtrarObj(req.body,"correo","nombre","apellidoMaterno","apellidoPaterno");
    if(req.file) filtrarBody.photo = req.file.filename;
    const updateUser = await User.findByIdAndUpdate(req.user.id,filtrarBody,
        {new : true, runValidators: true})
    res.status(200).json({
        status: "successful",
        data:{
            user: updateUser
        }
    })
});


const deleteMe = catchAsync(async(req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id,{activo: false});
    res.status(204).json({
        status: "successful",
        data: null
    })
});

const getMe = (req,res,next)=>{
    req.params.id = req.user.id;
    next();
}

const updateMeDatesConstancias = catchAsync(async(req,res,next)=>{
     //1)Crear un error si el usuario intenta actualizar su contraseñac onfirmar contraseña, correo, nombre etc..
     const contraseña = req.body.contraseña;
     const confirmarContraseña = req.body.confirmarContraseña;
     const correo = req.body.correo;
     const apellidoMaterno = req.body.apellidoMaterno;
     const apellidoPaterno = req.body.apellidoPaterno;
     const nombre = req.body.nombre;
     if(contraseña || confirmarContraseña || correo || apellidoMaterno || apellidoPaterno || nombre){
         return next(new AppError("Esta ruta no es para actualizar contraseñas o datos generales .Porfavor use /actualizarMiPassword o /updateMe",400))
     } 
     //2)Actualizar documento
     //New: true actualiza el nuevo documento con la informacion que le vamos a pasar
     const filtrarBody = filtrarObj(req.body,"curp","ocupacionEspecifica","razonSocialEmpresa",
     "shcp", "representanteLegal", "representanteTrabajadores")
     const updateUser = await User.findByIdAndUpdate(req.user.id,filtrarBody,
        {new : true, runValidators: true})
     res.status(200).json({
         status: "successful",
         data:{
             user: updateUser
         }
     })
})

const updateMeDatesCapacitador = catchAsync(async(req,res,next)=>{
    //1)Crear un error si el usuario intenta actualizar su contraseñac onfirmar contraseña, correo, nombre etc..
    const contraseña = req.body.contraseña;
    const confirmarContraseña = req.body.confirmarContraseña;
    const correo = req.body.correo;
    const apellidoMaterno = req.body.apellidoMaterno;
    const apellidoPaterno = req.body.apellidoPaterno;
    const nombre = req.body.nombre;
    const curp = req.body.curp;
    const ocupacionEspecifica = req.body.ocupacionEspecifica;
    const razonSocialEmpresa = req.body.razonSocialEmpresa;
    const shcp = req.body.shcp;
    const representanteLegal = req.body.representanteLegal;
    const representanteTrabajadores = req.representanteTrabajadores;
    if(contraseña || confirmarContraseña || correo || apellidoMaterno || apellidoPaterno || nombre ||
        curp || ocupacionEspecifica || razonSocialEmpresa || shcp || representanteLegal || representanteTrabajadores){
        return next(new AppError("Esta ruta no es para actualizar contraseñas o datos generales .Porfavor use /actualizarMiPassword o /updateMe",400))
    } 
    //2)Actualizar documento
    //New: true actualiza el nuevo documento con la informacion que le vamos a pasar
    const filtrarBody = filtrarObj(req.body,"puestoCapacitador","empresaCapacitador")
    if(req.file) filtrarBody.firmaElectronica = req.file.filename;
    const updateUser = await User.findByIdAndUpdate(req.user.id,filtrarBody,
        {new : true, runValidators: true})
    res.status(200).json({
        status: "successful",
        data:{
            user: updateUser
        }
    })
})


const createUser=catchAsync(async(req,res,next)=>{
    res.status(200).json({
        message: "Este ruta no esta disponible, Porfavor use la ruta de users/registro"
    }) 
});

const allUsers = getAll(User);

const oneUser = getOne(User);

const updateUser = updateOne(User);

const deleteUser = deleteOne(User);

module.exports = {createUser, oneUser,allUsers,deleteUser,updateUser,updateMe,deleteMe, getMe,
     updateMeDatesConstancias, updateMeDatesCapacitador, uploadUserPhoto, tamañoPhotoUser,
    uploadCapacitadorFirma, tamañoFirmaCapacitador};