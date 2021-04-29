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
    const jsonId = [];
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
        Swal.fire({  
            title: 'Do you want to save the changes?',  
            showDenyButton: true,  showCancelButton: true,  
            confirmButtonText: `Save`,  
            denyButtonText: `Don't save`,
          }).then((result) => {  
              /* Read more about isConfirmed, isDenied below */  
              if (result.isConfirmed) {    
                  Swal.fire('Saved!', '', 'success')  
              } else if (result.isDenied) {    
                  Swal.fire('Changes are not saved', '', 'info')  
               }
          });
    }
}

