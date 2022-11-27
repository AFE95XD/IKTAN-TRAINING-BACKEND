const Curso = require('../models/Curso');
const catchAsync = require('../utils/catchAsync');
//Fabrica de funciones
const {deleteOne, updateOne, createOne, getOne, getAll} = require("../controllers/handleFactory");
const AppError = require('../utils/AppError');
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

const uploadCursoImages = upload.fields([
    {name: "imagenCover", maxCount: 1},
    {name:"imagenes", maxCount:3}
])
//upload.single('imagenes') req.file
//upload.array('imagenes',5) req.files

//Procesamiento de imagenes
const tamañoImagenesCurso = catchAsync(async(req,res,next)=>{
    console.log(req.files)
    if(req.files.imagenCover){
        const imagenCover= `curso-${req.params.id}-${Date.now()}.jpeg`
        await sharp(req.files.imagenCover[0].buffer).resize(2000,1300).toFormat('jpeg').jpeg({quality: 90}).toFile(`public/cliente/img/cursos/imagenCover/${imagenCover}`)
        req.body.imagenCover = imagenCover;
    }

    if(req.files.imagenes){
        req.body.imagenes= []
        await Promise.all( req.files.imagenes.map(async(file,i)=>{
            const imagenes= `curso-${req.params.id}-${Date.now()}-${i + 1}.jpeg`
            await sharp(file.buffer).resize(2000,1300).toFormat('jpeg').jpeg({quality: 90}).toFile(`public/cliente/img/cursos/imagenes/${imagenes}`)
             req.body.imagenes.push(imagenes)
        }));
    }
    next();
});


//middelware
//Tours con mejor promedio y mas baratos
const aliasTopCurso =(req,res,next)=>{
    req.query.limit = "5";
    req.query.sort ="-calificacionPromedio,precio";
    req.query.fields = "nombre,precio,descripcion,calificacionPromedio"
    next();
}



//Api, version de la api
//usaremos el formato estandar jsend JSON para enviar la respuesta
const allCursos = getAll(Curso);

const oneCurso = getOne(Curso,{path: "reviews"})

const createCurso = createOne(Curso);

const updateCurso = updateOne(Curso);

const deleteCurso = deleteOne(Curso);

//Calcular estadisticas sobre los cursos

const getCursoEstadisticas = catchAsync(async(req,res) =>{
    
        //El aggregate es una consulta normal(regular) y tiene etapas las estapas, recibe como parametro un array y dentro van las etapas
        //Manipulqamos los datos en pasos diferentes
        //Los documentos pasan etapa por etapa
        //Match nos permite filtrar determinados documentos
        //Lo usaremos para que seleccione calificaciones >= a 4.5
        //group nos permite agrupar documentos atraves de acumuladores
        //Siempre tenemos que especificar el _id porque queremos agrupar
        //Lo colocamos nulo porque queremos tener todo en un grupo para poder sacar el promedio
        //$avg calcula el promedio
        //$min calcula el minimo
        //$max calcula el maximo
        //$suma
        //$toUpper convierte en mayusculas
        //$ne excepto
        /*
            En la primera capa hacemos la busqueda de lo que queremos eso nos devuelve los documentos
            En la segunda capa agrupamos y realizamos las operaciones que necesitemos
            En la tercera capa clasificamos de menor a mayor o mayor a menor
        */
        const estadisticas =await Curso.aggregate([
            {
                  $match : {calificacionPromedio: {$gte:4.5}}

            },
            {
                $group:{
                    _id:{ $toUpper: "$areaTematica"},
                    cantidadCursos: { $sum: 1},
                    cantidadDeCalificaciones: { $sum: '$cantidadCalificaciones'},
                    calificacionPromedio: { $avg: '$calificacionPromedio'},
                    precioPromedio: { $avg: '$precio'},
                    precioMinimo: {$min : '$precio'},
                    precioMaximo:{$max : '$precio'}
                }
            },
            {
                $sort:{
                    precio:1
                }
            },
            /*
            {
                $match:{
                    _id : {$ne: 'EASY'}
                }
            } */
        ])
        res.status(200).json({
            status: "successful",
            data: estadisticas
        });
});

const getPlanMensual = catchAsync( async(req,res)=>{
    
        const year = req.params.year;
        //$unwind descontruye un campo de matriz
        //Lo que hara sera que destructurara el arreglo y creara un docuemnto por cada fecha que tenga ese arreglo
        //usaremos match para selecionar aquellas fechas del year-01-01 year-12-31
        //Despues agruparemos por mes
        //sacamos la cantidad de tours por mes que hay
        //Agregamos el nombre por cada tour
        //addField se usa para agregar campos
        //Agregamos un campo para mes
        //$project elimina campos
        //En este caso el :id ya no aparecera
        //$sort
        //Ordenaremos los datos en orden decendente  a partir de la cantidad de tour start
        //-1 = descendente, 1 ascendente
        //$limit
        //Nos dara solo 12 documentos
        const plan = await Curso.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates:{
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    }
                }
            },
            {
                $group:{
                    _id: {$month: '$startDates'},
                    cantidadCursoStar:{$sum:1},
                    curso: {$push: '$nombre'}

                }
            },
            {
                $addFields:{
                    mes:'$_id'
                }
            },
            {
                $project:{
                    _id:0
                }
            },
            {
                $sort:{
                    cantidadCursoStar: -1
                }
            },{
                $limit:12
            }
        ]);
        res.status(200).json({
            status: "successful",
            data: plan
        })
});



module.exports = {allCursos,oneCurso,createCurso,updateCurso,deleteCurso, aliasTopCurso, getCursoEstadisticas,
     getPlanMensual, uploadCursoImages, tamañoImagenesCurso}