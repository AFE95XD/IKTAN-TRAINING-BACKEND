const {deleteOne, updateOne, createOne, getOne, getAll} = require('./handleFactory');
const EvaluacionInicial = require('../models/EvaluacionInicial')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')
const Curso = require('../models/Curso')

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
const createEvaluacionInicial = createOne(EvaluacionInicial);
const oneEvaluacionInicial = getOne(EvaluacionInicial);
const allEvaluacionInicial = getAll(EvaluacionInicial);
const updateEvaluacionInicial = updateOne(EvaluacionInicial);
const deleteEvaluacionInicial = deleteOne(EvaluacionInicial);

module.exports = {createEvaluacionInicial, oneEvaluacionInicial, allEvaluacionInicial, updateEvaluacionInicial, deleteEvaluacionInicial, setCursoUserIds, validarCurso};