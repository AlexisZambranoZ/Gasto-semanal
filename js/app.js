//variables y selectores
    const formulario = document.querySelector(`#agregar-gasto`)
    const gastoListado = document.querySelector(`#gastos ul`)
    

//Eventos
eventElister()
function eventElister(){
    document.addEventListener(`DOMContentLoaded`, preguntarPresupuesto)

    formulario.addEventListener(`submit`, agregarGasto)
}


//Clases
class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto)
        this.restante = Number(presupuesto)
        this.gastos = []
    }

    nuevoGasto(gasto){
      this.gastos = [...this.gastos,gasto]
      /* console.log(this.gastos); */
        this.calcularRestante()
    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total , gasto) => total + gasto.cantidad, 0)
        this.restante = this.presupuesto - gastado
        console.log(this.restante);
    }
    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id )
        console.log(this.gastos);
        this.calcularRestante()
    }
}

class UI {
    insertarPresupuesto(cantidad){
        
    //Agregar HTML    
    const {presupuesto , restante} = cantidad
    document.querySelector(`#total`).textContent = presupuesto
    document.querySelector(`#restante`).textContent = restante      
}
    imprimirAlerta(mensaje , tipo){
       //crear el div
       const divMensaje = document.createElement(`div`)
       divMensaje.classList.add(`text-center` , `alert`)
       
       if(tipo ===`error`){
        divMensaje.classList.add(`alert-danger`)
    }else{
        divMensaje.classList.add(`alert-success`)
    }
       
    //Mensaje de error
    divMensaje.textContent = mensaje

    //Insertar en el HTML
    document.querySelector(`.primario`).insertBefore(divMensaje, formulario)
    setTimeout(() => {
        //Quitar la alerta
        divMensaje.remove()
       }, 3000);

    }

    mostrarGastos(gastos){

        this.limpiarHTML()//Elimina el HTML Previo
        
        //Iterar sobre los gastos
        gastos.forEach(gasto => {
            const { cantidad , nombre,  id} = gasto
            
            //Crear LI
            const nuevoGasto = document.createElement(`li`)
            nuevoGasto.className = `list-group-item d-flex justify-content-between align-items-center`
            nuevoGasto.dataset.id = id
            
            //Agregar el HTML
            nuevoGasto.innerHTML = `${nombre} <span class = "badge badge-primary badge-pill">$ ${cantidad} </span> `

            //Boton para borrar el gasto

            const btnBorrar = document.createElement(`button`)
            btnBorrar.classList.add(`btn`, `btn-danger`, `btn-gasto` )
            btnBorrar.textContent = `Borrar X`
            btnBorrar.onclick = () => {
                eliminarGasto(id)
            }
            nuevoGasto.appendChild(btnBorrar)
        
            //Agregar al HTML

            gastoListado.appendChild(nuevoGasto)
        });

        //Agregar Gastos a Local Storage
        sincronizarStorage()
    }

     sincronizarStorage(){
        localStorage.setItem(`gastos-ul`, JSON.stringify(gastos))
    }
    

    limpiarHTML(){
        while( gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild)
        }
    }
   
    actualizarRestante(restante){
        document.querySelector(`#restante`).textContent = restante      

    }

        comprobarPresupuesto(presupuestObj){
            const { presupuesto , restante } = presupuestObj
            const restanteDiv = document.querySelector(`.restante`)

            //Comprobar 25%
            if((presupuesto / 4) > restante){
                console.log(`Gastando mas del 75%`);
                restanteDiv.classList.remove(`alert-sucess` , `alert-warning`)
                restanteDiv.classList.add(`alert-danger`)
                
            }else if((presupuesto / 2) > restante){
                console.log(`Gastando mas del 50%`);
                restanteDiv.classList.remove(`alert-sucess`)
                restanteDiv.classList.add(`alert-warning`)

            }else{
                restanteDiv.classList.remove(`alert-danger`, `alert-warning`)
                restanteDiv.classList.add(`alert-sucess`)
            }
                
            //Si el total es 0 o menor
            if(restante <= 0) {
                ui.imprimirAlerta(`El presupuesto se ha agotado`, `error`)
                formulario.querySelector(`button[type = "submit"]`).disabled = true
            }
        }

}



///Instanciar
const ui = new UI()

let presupuesto

//Funciones
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt(`cual es tu presupuesto`)
    console.log(Number(presupuestoUsuario))

    if(presupuestoUsuario === `` || presupuestoUsuario === null || isNaN(presupuestoUsuario)|| presupuestoUsuario <= 0 ){
        window.location.reload()
    }
 
//presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario)
   /*  console.log(presupuesto) */

    ui.insertarPresupuesto(presupuesto)

    
}

//Añade Gastos
function agregarGasto(e){
    e.preventDefault()

    //Leer los datos del formulario
    const nombre = document.querySelector(`#gasto`).value
    const cantidad = Number(document.querySelector(`#cantidad`).value)

    if(nombre === `` || cantidad ===``){
        ui.imprimirAlerta(`Ambos campos son obligatorios` , `error` )
        return
    }else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta(`Cantidad no valida`, `error`)
        return
    } 

   //Generar un objeto con el gasto
   const gasto = { nombre , cantidad , id:Date.now()}

   //Añade un nuevo gasto
   presupuesto.nuevoGasto(gasto)
   
   ui.imprimirAlerta(`Gasto agregado correctamente`)
   
    //Imprimir los gastos
    const { gastos , restante } = presupuesto
    ui.mostrarGastos(gastos)

    ui.actualizarRestante ( restante )

    ui.comprobarPresupuesto( presupuesto )

   //reinicia el formulario
   formulario.reset()
}

function eliminarGasto(id){
   /*  console.log(id); */

   //Elimina los gastos de la clase
   presupuesto.eliminarGasto(id)

   //Elimina los gastos del HTML
    const { gastos  , restante } = presupuesto
   ui.mostrarGastos(gastos)

   ui.actualizarRestante ( restante )

    ui.comprobarPresupuesto( presupuesto )

}