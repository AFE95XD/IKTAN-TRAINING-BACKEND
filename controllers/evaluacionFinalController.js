const {deleteOne, updateOne, createOne, getOne, getAll} = require('./handleFactory');
const EvaluacionFinal = require('../models/EvaluacionFinal')
const AppError = require('../utils/AppError')
const Curso = require('../models/Curso')
const catchAsync = require('../utils/catchAsync')

//Es parte de createReview-----midlware
const setCursoUserIds = (req,res,next)=>{
    if(!req.body.curso) req.body.curso = req.params.cursoId
    if(!req.body.user) req.body.user = req.user.id
    next();
}
const validarCurso = catchAsync(async(req,res,next)=>{
    const curso =await Curso.findById(req.body.curso)
    if(!curso) next(new AppError("El curso no existe. Porfavor inserte un curso valido",404));
    next();
});

const createEvaluacionFinal = createOne(EvaluacionFinal);
const oneEvaluacionFinal = getOne(EvaluacionFinal);
const allEvaluacionFinal = getAll(EvaluacionFinal);
const updateEvaluacionFinal = updateOne(EvaluacionFinal);
const deleteEvaluacionFinal = deleteOne(EvaluacionFinal);

module.exports = {createEvaluacionFinal, oneEvaluacionFinal, allEvaluacionFinal, updateEvaluacionFinal, deleteEvaluacionFinal, setCursoUserIds, validarCurso};