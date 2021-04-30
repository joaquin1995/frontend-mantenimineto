/* isntancias */
const cnx = new Conexion();


/* variables */

const tbody = document.querySelector('#tbody');


/* addEventListener */


document.addEventListener("DOMContentLoaded", ()=> {
    llenarColegios();

});


/* funciones */

const llenarColegios = async ()=>{
    let body = '';
    let uri = cnx.getUrl();
    uri += 'lista-mante';
    try {
        const res = await cnx.get(uri);
        console.log(res);
        for (const x of res) {
            body += `<tr>
            <td>${x.id}</td>
            <td class="mdl-data-table__cell--non-numeric">${x.nombre}</td>
            <td class="mdl-data-table__cell--non-numeric">${x.nivel}</td>
            <td class="mdl-data-table__cell--non-numeric">${x.direccion}</td>
            <td>
                <button data-id="${x.id}" onClick="detalle(this)" class="mdl-button1 mdl-js-button mdl-button--raised mdl-button--colored">
                    Detalle
                </button>
                <button data-id="${x.id}" onClick="derivar(this)" class="mdl-button1 mdl-js-button mdl-button--raised mdl-button--accent verde">
                    Derivar
                </button>
                <button data-id="${x.id}" onClick="observar(this)"
                    class="mdl-button1 mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                    Observar
                </button>
            </td>
        </tr>`;
        };

        tbody.innerHTML = body;
    } catch (error) {
        console.log(error);        
    }
};

const detalle = (e)=>{
    console.log('detalle');
    obtenerDetalle(e.getAttribute('data-id'));
    
}

const derivar = (e)=>{
    console.log('derivar');
    console.log(e.getAttribute('data-id'));
    actualizarSeguimiento(e.getAttribute('data-id'));

}


const observar = (e)=>{
    console.log('observar');
    console.log(e.getAttribute('data-id'));
}

const alertInfo = (distrito,uv,nombre,direccion,nro_aulas,nivel)=>{
    Swal.fire({
        title: '<strong>DETALLE</strong>',
        icon: 'info',
        html:
           `Distrito: ${distrito}<br/>
            Unidad Vecinal: ${uv}<br/>
            unidad Educativa: ${nombre}<br/>
            Direccion: ${direccion}<br/>
            Numero de aulas: ${nro_aulas}<br/>
            Nivel: ${nivel}<br/>
           `,
        showCloseButton: true,
        focusConfirm: false
      })
};


const obtenerDetalle = async (id)=>{
    let uri = cnx.getUrl();
    uri += `lista-detalle/${id}`;
    try {
        const res = await cnx.get(uri);
        console.log(res);
        for (const x of res) {
            alertInfo(x.distrito,x.uv,x.nombre,x.direccion,x.nro_aulas,x.nivel);
        }
    } catch (error) {
        console.log(error);        
    }
}

const actualizarSeguimiento = async (id) => {
    let uri = cnx.getUrl();
    uri += `seguimiento/${id}`;
    try {
        const res = await cnx.get(uri);
        console.log(res);
        alertExito();
        llenarColegios();
    } catch (error) {
        console.log(error);        

    }
};

const alertExito = ()=>{
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'DERIVADO CORRECTAMENTE',
        showConfirmButton: false,
        timer: 1500
      })
}