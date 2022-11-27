const {deleteOne, updateOne, createOne, getOne, getAll} = require('./handleFactory');
const EvaluacionInicial = require('../models/EvaluacionInicial')
const RespuestaEI = require('../models/RespuestaEI')
const AppError = require('../utils/AppError')
const Curso = require('../models/Curso')

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
    const evaluacionInicial = await EvaluacionInicial.findById(req.body.evaluacionInicial);
    if(!evaluacionInicial) return next(new AppError("La evaluacion inicial ni existe. Porfavor inserte una evaluacion valida"));
    let contador =0;
    let promedio = 0;
        //console.log(newDoc.preguntasCerradas[2].respuestaCorrecta)
        //console.log(evaluacionInicial)
    for (var i = 0; i < evaluacionInicial.preguntasCerradas.length; i++) {
        if(evaluacionInicial.preguntasCerradas[i].respuestaCorrecta === req.body.preguntasCerradas[i].respuestaCorrecta){
            contador = contador +1;
        }
        promedio = contador/evaluacionInicial.preguntasCerradas.length
        req.body.calificacion = promedio * 10
      }
      //console.log(req.body.calificacion)
      next();
}

const createRespuestaEI = createOne(RespuestaEI);
const oneRespuestaEI = getOne(RespuestaEI);
const allRespuestaEI = getAll(RespuestaEI);
const updateRespuestaEI = updateOne(RespuestaEI);
const deleteRespuestaEI = deleteOne(RespuestaEI);

module.exports = {createRespuestaEI, oneRespuestaEI, allRespuestaEI, updateRespuestaEI, 
    deleteRespuestaEI, setCursoUserIds, validarCurso, asignarCalificacion};



