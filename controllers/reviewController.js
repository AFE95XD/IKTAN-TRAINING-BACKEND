const Review = require('../models/review');
//const catchAsync = require('../utils/catchAsync')

const {deleteOne, updateOne, createOne, getOne, getAll} = require('../controllers/handleFactory')

//Es parte de createReview-----midlware
const setCursoUserIds = (req,res,next)=>{
    if(!req.body.curso) req.body.curso = req.params.cursoId
    if(!req.body.user) req.body.user = req.user.id
    next();
}

const createReview = createOne(Review);

const allReviews = getAll(Review);

const oneReview = getOne(Review);

const deleteReview = deleteOne(Review);

const updateReview = updateOne(Review);

module.exports = {createReview, allReviews,deleteReview, updateReview, setCursoUserIds, oneReview}