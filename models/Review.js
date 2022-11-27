const mongoose = require('mongoose');
const Curso = require('../models/Curso')
const reviewSchema = new mongoose.Schema({
    review:{
        type: String,
        required : [true,'Un review debe de tener una reseña'],
        maxlength: [150, 'La reseña debe de tener como maximo 100 caracteres'],
        minlength: [3,'La reseña debe de tener como minimo  3 caracteres']
    },
   
    calificacion:{
        type: Number,
        required: [true,'Un review debe de tener una calificacion'],
        min: 1,
        max: 5,
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'Usuarios',
        required: [true,'Un review debe de pertenecer a un usuario']
    },
    curso:{
        type: mongoose.Schema.ObjectId,
        ref: 'Curso',
        required: [true,'Un review debe de pertenecer a un curso'],
    },
    createAt:{
        type: Date,
        default: Date.now(),
        select: false

    },
},
{
    toJSON:{virtuals: true},
    toObject:{virtuals:true}
}
);

reviewSchema.index({curso: 1, user: 1},{unique: true});

//QUERY MIDDLEWARE
reviewSchema.pre(/^find/,function(next){
    /*this.populate({
        path: "user",
        select: "nombre foto "
    }).populate({
        path: "tour",
        select: "name"
}) */
this.populate({
    path: "user",
    select: "nombre foto "
})
next();
})


//Metodo estatico para calcular las csalificaciones Promedio

reviewSchema.statics.calAverageRatings = async function(cursoId){
    const estadisticas = await this.aggregate([
        {
            $match : {curso: cursoId}
        },
        {
            $group: {
                _id: "$curso",
                numRating: {$sum: 1},
                avgRating: {$avg: "$calificacion"}
            }
        }
    ])
    console.log(estadisticas)
    
    if(estadisticas.length > 0){
        await Curso.findByIdAndUpdate(cursoId,{
            calificacionPromedio: estadisticas[0].avgRating,
            cantidadCalificaciones: estadisticas[0].numRating,

        })
    }else{
        //Si noay ninguna review vuelve a los datos por default como cuando se crea el curso
        await Curso.findByIdAndUpdate(cursoId,{
            calificacionPromedio: 4.0,
            cantidadCalificaciones: 0
        })
    }
   
}


reviewSchema.post("save", function(){
    this.constructor.calAverageRatings(this.curso);
})

//Para actualizar y eliminar review cambien las estadisticas
//findByIdAndDelete
//findByIdAnd
reviewSchema.pre(/^findOneAnd/,async function(next){
    this.r = await this.clone().findOne();
    console.log(this.r)
    next()

})

reviewSchema.post(/^findOneAnd/,async function(){
   await this.r.constructor.calAverageRatings(this.r.curso)
})

const Review = mongoose.model("reviews", reviewSchema);


module.exports = Review;