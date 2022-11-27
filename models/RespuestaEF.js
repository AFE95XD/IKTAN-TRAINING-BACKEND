const mongoose = require('mongoose');
const respuestaEFSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "Usuarios"
    },
    curso: {
        type: mongoose.Schema.ObjectId,
        ref: "Cursos"
    },
    evaluacionFinal: {
        type: mongoose.Schema.ObjectId,
        ref: "Evaluaciones Finales"
    },
    calificacion:{
        type: Number,
        required: [true,"Debe de tener una calificacion"]
    }
})
respuestaEFSchema.index({user:1},{unique: true});


const  RespuestaEI = mongoose.model("calificaciones ef", respuestaEFSchema);
module.exports = RespuestaEI;