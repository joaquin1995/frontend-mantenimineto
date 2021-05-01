/* instancias */
const cnx = new Conexion();

/* variables */
const colegio = document.querySelector('#colegio');
const dir = document.querySelector('#dir');
const dis = document.querySelector('#dis');
const unidad = document.querySelector('#uv');
const nv = document.querySelector('#nivel');
const fecha = document.querySelector('#fecha');
const tbody = document.querySelector('#tbody');
const presupuesto = document.querySelector('#presupuesto');
let contador;
/* addEventListener */

document.addEventListener("DOMContentLoaded", ()=> {
    const id = localStorage.getItem('idSolicitud');
    obtenerDetalle(id);
    llenarTipos(id);
    fechaActual();
    obtenerPresupuesto();
});

/* funciones */

const obtenerPresupuesto = async ()=>{
    let uri = cnx.getUrl();
    uri += `presupuesto`;
    try {
        const res = await cnx.get(uri);
        console.log(res[0].monto);
        const total = Number(res[0].monto);
       presupuesto.textContent = "PRESUPUESTO: " + total;
    } catch (error) {
        console.log(error);        
    }
}

const obtenerDetalle = async (id)=>{
    let uri = cnx.getUrl();
    uri += `lista-detalle/${id}`;
    try {
        const res = await cnx.get(uri);
        console.log(res);
        for (const x of res) {
            llenarDatos(x.distrito,x.uv,x.nombre,x.direccion,x.nro_aulas,x.nivel);
        }
    } catch (error) {
        console.log(error);        
    }
}

const llenarDatos = (distrito,uv,nombre,direccion,nro_aulas,nivel)=>{
    colegio.textContent = nombre;
    unidad.textContent = uv;
    dir.textContent = direccion;
    dis.textContent = distrito;
    nv.textContent = nivel;
}


const fechaActual = ()=>{
    const date = new Date();
    const fechaA = date.getFullYear() + "-" + (date.getMonth() + 1) + "-"  + date.getDate(); 
    fecha.textContent = fechaA;
}

const llenarTipos = async (id)=>{
    let body = '';
    contador = 0;
    let uri = cnx.getUrl();
    uri += `lista-tipo/${id}`;
    try {
        const res = await cnx.get(uri);
        console.log(res);
        if(res.length > 0){
            for (const x of res) {
                body += `<tr>
                <td>${x.id}</td>
                <td class="mdl-data-table__cell--non-numeric">${x.nombre}</td>
                <td >${x.monto}</td>
                </tr>`;
                contador += Number(x.monto);
            };
            body +=`<tr>
                    <td class="" colspan="2">TOTAL</td>
                    <td >${contador}</td>
                    </tr>
                    <tr>
                    <td class="" colspan="2">MONTO A DESPACHAR</td>
                    <td ><input type="number" id="monto" value="${contador}"></input></td>
                    </tr>
                    <tr>

                    <tr>
                    <td class="centrado" colspan="3"><a>NOMBRE DEL PROYECTO</a> : <input type="text" id="proyecto" value=""></input></td>
                    </tr>

                    <td class="centrado" colspan="3">
                    <button onClick="aprobar()" class="mdl-button1 mdl-js-button mdl-button--raised mdl-button--colored">
                    APROBAR
                    </button>
                    </td>

                    </tr>
                    `
        }else{
            body = `<tr>
                    <td class="centrado" colspan="3">No hay datos</td>
                    </tr>`;
        }
        tbody.innerHTML =body;
    } catch (error) {
        console.log(error);        
    }
};

const aprobar = ()=>{
    const json = JsonAprobar();
    insertarAprobacion(json);
}

const JsonAprobar = ()=> {
    const monto = document.querySelector('#monto');
    const proyecto = document.querySelector('#proyecto');
    let json  ={};
    json.proyecto = proyecto.value;
    json.monto_bruto = contador;
    json.monto_total = monto.value;
    json.estado = 'A';
    json.id_u_presupuesto = 1;
    json.id_solicitud = localStorage.getItem('idSolicitud');
    return json;
};

const insertarAprobacion = async (json)=>{
    let uri = cnx.getUrl();
    uri += `aprobacion`;
    try {
        const res = await cnx.post(json,uri);
        console.log(res);
        alerta();
        setTimeout(() => {
            location.href = '/presupuseto.html';
        }, 3000);
        
    } catch (error) {
        console.log(error);
    }
}

const alerta = ()=>{
    Swal.fire({
        position: 'top-center',
        icon: 'success',
        title: 'REGISTRADO CORRECTAMENTE',
        showConfirmButton: false,
        timer: 1500
      })
}
