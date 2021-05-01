/* instancia */

const cnx = new Conexion();

/* variables */

const tbody = document.querySelector('#tbody');
/* addEventListener */

document.addEventListener("DOMContentLoaded", ()=> {
    llenarColegios();

});


/* funciones  */


const llenarColegios = async ()=>{
    let body = '';
    let uri = cnx.getUrl();
    uri += 'lista-pre';
    try {
        const res = await cnx.get(uri);
        console.log(res);
        if(res.length > 0){
            for (const x of res) {
                body += `<tr>
                <td>${x.id}</td>
                <td class="mdl-data-table__cell--non-numeric">${x.nombre}</td>
                <td class="mdl-data-table__cell--non-numeric">${x.nivel}</td>
                <td class="mdl-data-table__cell--non-numeric">${x.direccion}</td>
                <td>
                    <button  data-id="${x.id}" onClick="derivar(this)"  class="mdl-button1 mdl-js-button mdl-button--raised mdl-button--colored">
                    APROBAR
                    </button>
                </td>
            </tr>`;
            };
        }else{
            body = `<tr>
                    <td class="centrado" colspan="5">No hay daos</td>
                    </tr>`;
        }
        tbody.innerHTML = body;
    } catch (error) {
        console.log(error);        
    }
};


const derivar = (e)=>{
    console.log('derivar');
    localStorage.setItem('idSolicitud',e.getAttribute('data-id'))
    location.href = './presupuesto-datelle.html';
}