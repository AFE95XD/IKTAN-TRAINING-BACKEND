const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true,"Un usuario debe de tener un nombre"],
        minlength: [3,"Un nombre debe de tener como minimo 3 caracteres"],
        maxlength: [30,"Un nombre debe de tener como maximo 30 caracteres"],
        trim: true,
    },
    apellidoPaterno: {
        type: String,
        required: [true,"Un usuario debe de tener un apellido paterno"],
        minlength: [3,"Un apellido paterno debe de tener como minimo 3 caracteres"],
        maxlength: [30, "Un apellido paterno debe de tener como maximo 30 caracteres"],
        trim: true,
    },
    apellidoMaterno: {
        type: String,
        required: [true,"Un usuario debe de tener un apellido materno"],
        minlength: [3,"Un apellido materno debe de tener como minimo 3 caracteres"],
        maxlength: [30,"Un apellido materno debe de tener como maximo 30 caracteres"],
        trim: true,
    },
    correo: {
        type: String,
        required: [true, "Un usuario debe de tener un correo electronico"],
        minlength: [10,"Un correo debe de tener como minimo 10 caracteres"],
        maxlength: [40,"Un correo debe de tener como maximo 40 caracteres"],
        trim: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail,"Porfavor ingrese un email valido"],

    },
    contraseña: {
        type: String,
        required: [true,"Un usuario debe de tener una contraseña"],
        minlength: [8,"Una contraseña debe de tener como minimo 8 caracteres"],
        maxlength: [64,"Una contraseña debe de tener como maximo 64 caracteres"],
        select: false
    },
    confirmarContraseña: {
        type: String,
        required: [true,"Porfavor confirma tu contraseña"],
        //Solo sirve para save o create esta validacion
        validate: {
            validator: function(val){
                return val === this.contraseña;
            },
        message: "Las constraseñas no coinciden"
        }
    },
    photo:{
        type: String,
        default: "default.png"
    },
    role: {
        type: String,
        trim: true,
        default: "user",
        enum: ["user", "capacitador","recursosHumanos", "administrador"],
    },
    //-------------Datos user ---------------//
    curp: {
        type: String,
        minlength: [18,"Un curp debe de tener como minimo 18 caracteres"],
        maxlength: [18, "Un curp debe de tener como maximo 18 caracteres"],
        uppercase: true,
    },
    ocupacionEspecifica: {
        type: String,
        minlength: [3,"Una ocupacion especifica debe de tener como minimo 3 caracteres"],
        maxlength: [120,"Una ocupacion especifica debe de tener como maximo 30 caracteres"],
        uppercase: true,
    },
    razonSocialEmpresa: {
        type: String,
        minlength: [3,"La razon social de la empresa debe de tener como minimo 3 caracteres"],
        maxlength: [200,"La razon social de la empresa debe de tener como minimo 60 caracteres"],
    },
    shcp: {
        type: String,
        minlength: [14,"El SHCP debe de tener como minimo 14 caracteres"],
        maxlength: [15,"El SHCP debe de tener como maximo 15 caracteres"],
        uppercase: true,
    },
    representanteLegal: {
        type: String,
        minlength: [3,"Un representante legal como minimo debe de tener 3 caracteres"],
        maxlength: [60,"Un representante legal como maximo debe de tener 60 caracteres"]
    },
    representanteTrabajadores: {
        type: String,
        minlength: [3,"Un representante legal como minimo debe de tener 3 caracteres"],
        maxlength: [60,"Un representante legal como maximo debe de tener 60 caracteres"]
    },
    //----------------Datos Capacitador----------------------//
    puestoCapacitador: {
        type: String,
        minlength: [3,"El puesto del capacitador como minimo debe de tener 3 caracteres"],
        maxlength: [60, "El puesto del capacitador como maximo debe de tener 60 caracteres"]
    },
    empresaCapacitador:{
        type: String,
        minlength: [3,"La empresa del capacitador como minimo debe de tener 3 caracteres"],
        maxlength: [60, "La empresa del capacitador como maximo debe de tener 60 caracteres"]
    },
    firmaElectronica: String,
    contraseñaActualizadaAt: {
        type:Date,
    },
    contraseñaResetToken: String,
    contraseñaResetExpires: Date,
    activo:{
        type: Boolean,
        default: true,
        select: false
    },
    confirmar:{
        type: Boolean,
        default: false,
    },
    token:String
});

//Hashando contraseña antes de que se guarde

userSchema.pre('save',async function(next){
    if(!this.isModified('contraseña')) return next();

    this.contraseña = await bcrypt.hash(this.contraseña,12);
    this.confirmarContraseña = undefined;
    next();
})

userSchema.pre('save',function(next){
    this.token = Date.now().toString(32) + Math.random().toString(32).substring(2);
    next();
})

userSchema.pre('save', function(next){
    //isNew si es nuevo el documento o si no se modifico la contraseña
    if(!this.isModified('contraseña') || this.isNew) return next();
    this.contraseñaActualizadaAt = Date.now() -1000;
    next();
})

userSchema.pre(/^find/, function(next){
    this.find({ activo :{$ne:false}});
    next();
})

//Comparar contraseñas cunado se login user

userSchema.methods.correctaContraseña =async function(candidatoContraseña, userContraseña){
    return await bcrypt.compare(candidatoContraseña,userContraseña);
}

//Verificar si el usuario cambio la contraseña depsues de que se genero el token
userSchema.methods.actualizoContraseñaDespues = function(JWTTimesTamp){
    if(this.contraseñaActualizadaAt){
        const changedTimestamp = parseInt(this.contraseñaActualizadaAt.getTime()/1000,10);
        //console.log(changedTimestamp, JWTTimesTamp);
        return JWTTimesTamp < changedTimestamp // 100 < 200
    }
    return false;
}

userSchema.methods.createContraseñaResetToken = function(){
    resetToken = crypto.randomBytes(32).toString("hex");
    //console.log(resetToken)

    //Lo encriptamos por seguridad en la dataBase
    this.contraseñaResetToken = crypto.createHash('sha256').update(resetToken).digest("hex");
    //10 minutos expirara
    this.contraseñaResetExpires = Date.now() + (10*60*1000);
    return resetToken;
}
const User = mongoose.model("Usuarios",userSchema);
module.exports = User;