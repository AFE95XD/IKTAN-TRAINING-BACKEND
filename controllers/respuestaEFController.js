const {deleteOne, updateOne, createOne, getOne, getAll} = require('./handleFactory');
const EvaluacionFinal = require('../models/EvaluacionFinal')
const RespuestaEF = require('../models/RespuestaEF')
const AppError = require('../utils/AppError')
const Curso = require('../models/Curso')
const User = require('../models/User')
const Constancia = require('../utils/constancia')

//Es parte de createReview-----midlware
const setCursoUserIds = (req,res,next)=>{
    if(!req.body.curso) req.body.curso = req.params.cursoId
    if(!req.body.user) req.body.user = req.user.id
    next();
}
const validarCurso = async(req,res,next)=>{
    const curso =await Curso.findById(req.body.curso)
    if(!curso) next(new AppError("El curso no existe. Porfavor inserte un curso valido",404));
    next();
}
//Cuando envien las repsuestas de una evaluacion debe de ir dentro de un array llamdo preguntasCerras:[{respuestaCorrecta: 'd'}]
const asignarCalificacion = async(req,res,next)=>{
    const evaluacionFinal = await EvaluacionFinal.findById(req.body.evaluacionFinal);
    if(!evaluacionFinal) return next(new AppError("La evaluacion inicial ni existe. Porfavor inserte una evaluacion valida"));
    let contador =0;
    let promedio = 0;
        //console.log(newDoc.preguntasCerradas[2].respuestaCorrecta)
        //console.log(evaluacionFinal)
    for (var i = 0; i < evaluacionFinal.preguntasCerradas.length; i++) {
        if(evaluacionFinal.preguntasCerradas[i].respuestaCorrecta === req.body.preguntasCerradas[i].respuestaCorrecta){
            contador = contador +1;
        }
        promedio = contador/evaluacionFinal.preguntasCerradas.length
        req.body.calificacion = promedio * 10
      }
      //console.log(req.body.calificacion)
      next();
}

const validarCalificacion = async(req,res,next)=>{
    const user = await User.findById({_id: req.body.user});
    const curso = await Curso.findById({_id: req.body.curso})
    calificacion = req.body.calificacion;
     //DEBES DE BORRAR ESTO
     user.folio = req.body.folio;
     console.log(user)

    //console.log(curso.capacitadorPrincipal)
    if(calificacion >= 8){
        //1)Generar constancia
        calificacion = '10:00';
        //Condiciones
        //Tres ves de intento, despues de los  3 veces de intento ya no le permitira
        //Generar la constancia De iktan y dc-3
        //Si la calificacion es mayor o igual a 8 se genera la constancia de iktan y la dc-3
        await new Constancia(user,curso,calificacion).createIktan();
        await new Constancia(user,curso,calificacion).createDC3();
        next();
    }else{
        next(new AppError("La calificacion no es aprobatoria. Vuelve a intentarlo",400));
    }
}

const createRespuestaEF = createOne(RespuestaEF);
const oneRespuestaEF = getOne(RespuestaEF);
const allRespuestaEF = getAll(RespuestaEF);
const updateRespuestaEF = updateOne(RespuestaEF);
const deleteRespuestaEF = deleteOne(RespuestaEF);

module.exports = {createRespuestaEF, oneRespuestaEF, allRespuestaEF, updateRespuestaEF, 
    deleteRespuestaEF, setCursoUserIds, validarCurso, asignarCalificacion, validarCalificacion};





