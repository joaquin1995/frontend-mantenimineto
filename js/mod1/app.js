/* instancia */
const cnx = new Conexion();

/* variables */
const selectEducativas = document.querySelector('#id_label_single');
const selectMantenimiento = document.querySelector('#id_label_multiple');
const distrito = document.querySelector('#distrito');
const uv = document.querySelector('#uv');
const colegio = document.querySelector('#colegio');
const direccion = document.querySelector('#direccion');
const aulas = document.querySelector('#aulas');
const nivel = document.querySelector('#nivel');
const total = document.querySelector('#total');
const enviar = document.querySelector('#enviar');
const txtDescripcion = document.querySelector('#txtDescripcion');
let jsonId = [];
/* addEventListener */
$('#id_label_single').on('change', function (e) {
  console.log(selectEducativas.value);
  const valor = selectEducativas.value;
  if(valor === '')
  limpiar()
  else
  obtenerInfo(valor);
});

$('#id_label_multiple').on('change', function (e) {
    jsonId = [];
    let cantidad = 0;
    var selected = $('#id_label_multiple').select2("data");
    for (var i = 0; i <= selected.length-1; i++) {
        jsonId.push({id_tipo_mantenimientos : selected[i].id});
        console.log(selected[i].id);
        console.log(selected[i].text);
        cantidad += Number(selected[i].text.split("-")[1]);

    }
    console.log(jsonId);
    if(selectMantenimiento.value === "")
    total.textContent = "S/N";
    else
    total.textContent = cantidad;
    
  });


document.addEventListener("DOMContentLoaded", ()=> {
    llenarColegios();
    llenarMantenimientos();
});

enviar.addEventListener('click',()=>{
    enviarSolicitud();
});

/* funciones */

const llenarColegios = async ()=>{
    let uri = cnx.getUrl();
    uri += 'educativas';
    try {
        const res = await cnx.get(uri);
        console.log(res);
        for (const x of res) {
            console.log(x.id);
            console.log(x.nombre);
            let option = document.createElement("option");
            option.text = x.nombre;
            option.value = x.id;
            selectEducativas.appendChild(option);

        }
    } catch (error) {
        console.log(error);        
    }
}


const llenarMantenimientos = async ()=>{
    let uri = cnx.getUrl();
    uri += 'tipo-mantenimiento';
    try {
        const res = await cnx.get(uri);
        console.log(res);
        for (const x of res) {
            console.log(x.id);
            console.log(x.nombre);
            let option = document.createElement("option");
            option.text = x.nombre +  " - " + x.monto;
            option.value = x.id;
            selectMantenimiento.appendChild(option);

        }
    } catch (error) {
        console.log(error);        
    }
}


const obtenerInfo = async (id)=>{
    let uri = cnx.getUrl();
    uri += `educativas/${id}`;
    try {
        const res = await cnx.get(uri);
        console.log(res);
        for (const x of res) {
            console.log(x);
            distrito.textContent =  x.distrito;
            nivel.textContent = x.nivel;
            colegio.textContent = x.nombre;
            aulas.textContent = x.nro_aulas;
            uv.textContent = x.uv;
            direccion.textContent = x.direccion;

        }
    } catch (error) {
        console.log(error);        
    }
}

const limpiar = ()=>{
    distrito.textContent =  "S/N";
    nivel.textContent = "S/N";
    colegio.textContent = "S/N";
    aulas.textContent = "S/N";
    uv.textContent = "S/N";
    direccion.textContent = "S/N";
}

const enviarSolicitud = ()=>{
    if(selectEducativas.value === "" || selectMantenimiento.value === ""){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'SELECCIONE LA UNIDAD EDUCATIVA Y LOS TIPO DE MANTENIMIENTOS!',
          })
    }else{
        const json = josnSolicitud();
        console.log(json);
        insertar(json);
    }
}


const josnSolicitud = ()=>{
    const date = new Date();
    const fecha = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    const hora = date.getHours() + ":" + date.getMinutes(); 
    let json = {};
    json.descripcion = txtDescripcion.value;
    json.fecha = fecha;
    json.hora = hora;
    json.id_educativa  = selectEducativas.value;
    json.id_mantenimiento = 1;
    return json;
};

const insertar = async (json)=>{
    let url = cnx.getUrl();
    url += 'solicitud';
    
    try {
        const res = await cnx.post(json,url);
        console.log(res);
        const id = res[0].id;
        console.log('este',id);
        let uri = cnx.getUrl();
        uri += 'dt-solicitudes';
        for (const x of jsonId) {
            let dtJson = {};
            dtJson.id_tipo_mantenimientos = x.id_tipo_mantenimientos;
            dtJson.id_solicitud = id;
            cnx.post(dtJson,uri);
        }
        alerta();
        limpiar();
        $("#id_label_multiple").val([]).change();
        $("#id_label_single").val('').trigger('change');
        jsonId = [];
        total.value = "";
        txtDescripcion.value = "";
    } catch (error) {
        console.log(error);
    }
}

const alerta = ()=>{
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'REGISTRADO CORRECTAMENTE',
        showConfirmButton: false,
        timer: 1500
      })
}

