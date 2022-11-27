const mongoose = require('mongoose');
const Curso = require('../models/Curso')
const evaluacionFinalSchema = new mongoose.Schema({
    tipoEvaluacion:{
        type: String,
        default: "Evaluacion Final"
    },
    curso:{
        type: mongoose.Schema.ObjectId,
        ref: 'Cursos',
        required: [true, "La evaluacion Final debe de tener un curso"],
        unique: true
    },
    preguntasCerradas:[
        {
            pregunta:{
                type: String,
                trim: true,
            },
            respuestaA:{
                type: String,
                trim: true
            },
            respuestaB:{
                type: String,
                trim: true
            },
            respuestaC:{
                type: String,
                trim: true
            },
            respuestaD:{
                type: String,
                trim: true
            },
            respuestaCorrecta:{
                type: String,
                trim: true,
                required: [true, "Un pregunta debe de tener una respuesta correcta"]
            }
        },
    ],
    preguntasAbiertas:[{
        pregunta:{
            type: String,
            trim: true,
        }
}]
});
evaluacionFinalSchema.index({curso:1},{unique: true});

evaluacionFinalSchema.pre(/^find/, function(next){
    this.populate({
        path: 'curso',
        select: '-__v -descripcion -duracion -precio -tamañoMaximoGrupo -areaTematica -calificacionPromedio -cantidadCalificaciones -startDates -createAt -cursoSecreto -capacitadores -slug -evaluacionInicial ' 
    })
    next();
})

evaluacionFinalSchema.pre('save',async function(){
    await Curso.findByIdAndUpdate(this.curso,{
        evaluacionFinal: `${process.env.FRONTEND_URL}/evaluacion-final/${this.id}` ,
    })
})
const EvaluacionFinal = mongoose.model("Evaluaciones Finales", evaluacionFinalSchema);
module.exports = EvaluacionFinal;