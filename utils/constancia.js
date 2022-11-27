const pug = require('pug');
const pdf = require('html-pdf');
class Constancia{
    constructor(user,curso,calificacion){
        user.curp = this.descomponerPalabra(user.curp);
        user.shcp = this.descomponerPalabra(user.shcp);
        this.id = user.id;
        this.user = user;
        this.curso = curso;  
        this.calificacion = calificacion;
        this.capacitadores = curso.capacitadores[0];
        this.capacitadorPrincipal = curso.capacitadorPrincipal;
        
    }

    descomponerPalabra(dato){
        let datos=[];
        for (var i = 0; i < dato.length; i++) {
            datos[i] = dato.charAt(i)
          }
        return datos;
    }

    async createPDF(template,orientation,carpeta,format){
        //console.log(this.capacitadorPrincipal)
        //1)Renderizar el html para le correo basado en una plantilla pug
        const html = pug.renderFile(`${__dirname}/../views/constancias/${template}.pug`,{
            user: this.user,
            curso: this.curso,
            calificacion: this.calificacion,
            capacitadores: this.capacitadores,
            capacitadorPrincipal: this.capacitadorPrincipal,
        });
        //2)Opciones de pdf
        const opciones={
            format, // A3, A4, A5, Legal, Letter
            orientation, // horizontal // portrait or landscape
            "border": {
                "top": ".3cm", //   default is 0, units: mm, cm, in, px
                "right": ".3cm",
                "bottom": ".3cm",
                "left": ".3cm",
              },
        }
        //3)Crear el pdf
        //let fileName = `${carpeta}-${this.id}-${Date.now()}`
        let fileName = `${this.user.nombre} ${this.user.apellidoPaterno} ${this.user.apellidoMaterno}`
        let directorio = `public/cliente/constancias/${carpeta}/${fileName}.pdf`;
        await pdf.create(html,opciones).toFile(directorio,function(err,res){
            if(err){
                console.log(err);
            }else{     
            }});
        }     
    async createIktan(){
        await this.createPDF('iktan','landscape','Iktan','Letter')
     }
     async createDC3(){
        await this.createPDF('dc-3','portrait','DC-3','A4')
     }
}


module.exports = Constancia;