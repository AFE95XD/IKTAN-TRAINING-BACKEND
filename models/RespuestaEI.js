const mongoose = require('mongoose');
const respuestaEISchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "Usuarios"
    },
    curso: {
        type: mongoose.Schema.ObjectId,
        ref: "Cursos"
    },
    evaluacionInicial: {
        type: mongoose.Schema.ObjectId,
        ref: "Evaluaciones Iniciales"
    },
    calificacion:{
        type: Number,
        required: [true,"Debe de tener una calificacion"]
    }
})
respuestaEISchema.index({user:1},{unique: true});


const  RespuestaEI = mongoose.model("calificaciones ei", respuestaEISchema);
module.exports = RespuestaEI;