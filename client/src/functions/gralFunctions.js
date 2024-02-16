import axios from 'axios';

export const getProductsClients = async () => {
  try {
    const response = await axios.get("http://localhost:4000/products/productsClients");
    const productsClients = response.data[0];
    console.log( productsClients);
    return productsClients;
  } catch (error) {
    console.error(error);
    throw error; 
  }
}

export const getProductsBonusClients = async () => {
    try {
      const response = await axios.get("http://localhost:4000/products/productsBonusClients");
      const productsBonusClients = response.data[0];
      console.log(productsBonusClients);
      return productsBonusClients;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

export const getDate = () => {
    const fecha = new Date();
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; 
    const año = fecha.getFullYear();
    const diaFormateado = dia < 10 ? `0${dia}` : dia;
    const mesFormateado = mes < 10 ? `0${mes}` : mes;
    return `${diaFormateado}/${mesFormateado}/${año}`;
  }
 

export const getMonth = () => { 
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ]
  const fechaActual = new Date();
  const nombreMes = meses[fechaActual.getMonth()];
  return nombreMes;
}


export const getYear = () => {
  const fechaActual = new Date();
  const anioActual = fechaActual.getFullYear();
  return anioActual;
}

export const getDay = () => { 
  const fechaActual = new Date();
  const diaActual = parseInt(fechaActual.getDate(), 10); 
  return diaActual;
 }
 
 export const formatePrice = (price) => { 
  const priceFormated =   '$' + (price).toLocaleString('es-AR') ;
  return priceFormated
}

export const months = [
  { label: 'Enero', value: 'enero' },
  { label: 'Febrero', value: 'febrero' },
  { label: 'Marzo', value: 'marzo' },
  { label: 'Abril', value: 'abril' },
  { label: 'Mayo', value: 'mayo' },
  { label: 'Junio', value: 'junio' },
  { label: 'Julio', value: 'julio' },
  { label: 'Agosto', value: 'agosto' },
  { label: 'Septiembre', value: 'septiembre' },
  { label: 'Octubre', value: 'octubre' },
  { label: 'Noviembre', value: 'noviembre' },
  { label: 'Diciembre', value: 'diciembre' },
];

export const typeOfClientsAvailables = [
  { label: 'Bonificado', value: 'Bonificado' },
  { label: 'No Bonificado', value: 'No Bonificado' }
];

export const diferentOrdersStatus = [
  { label: 'No Entregado', value: 'No Entregado' },
  { label: 'Entregado', value: 'Entregado' },
  { label: 'Devuelto', value: 'Devuelto' },
  { label: 'Suspendido', value: 'Suspendido' },
];


