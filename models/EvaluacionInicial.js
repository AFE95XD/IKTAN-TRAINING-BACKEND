const mongoose = require('mongoose');
const Curso = require('../models/Curso');
const AppError = require('../utils/AppError')
const evaluacionInicialSchema = new mongoose.Schema({
    tipoEvaluacion:{
        type: String,
        default: "Evaluacion Diagnostica"
    },
    curso:{
        type: mongoose.Schema.ObjectId,
        ref: 'Cursos',
        required: [true,"Una evaluacion inicial necesita un curso"],
        unique: true,
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

evaluacionInicialSchema.index({curso:1},{unique: true});

evaluacionInicialSchema.pre(/^find/, function(next){
    this.populate({
        path: 'curso',
        select: '-__v -descripcion -duracion -precio -tamañoMaximoGrupo -areaTematica -calificacionPromedio -cantidadCalificaciones -startDates -createAt -cursoSecreto -capacitadores' 
    })
    next();
})

evaluacionInicialSchema.pre('save',async function(){
    await Curso.findByIdAndUpdate(this.curso,{
        evaluacionInicial: `${process.env.FRONTEND_URL}/evaluacion-inicial/${this.id}` ,
    });
    
})

const EvaluacionInicial = mongoose.model("Evaluaciones Iniciales", evaluacionInicialSchema);

module.exports = EvaluacionInicial;