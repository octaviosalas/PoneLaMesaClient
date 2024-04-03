import axios from 'axios';

export const getProductsClients = async () => {
  try {
    const response = await axios.get("http://localhost:4000/products/productsClients");
    const productsClients = response.data;
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

  export const getEveryOrders = async () => {
    try {
      const response = await axios.get("http://localhost:4000/orders");
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  

  export const getEveryPurchases = async () => {
    try {
      const response = await axios.get("http://localhost:4000/purchases");
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  export const getSublets = async () => {
    try {
      const response = await axios.get("http://localhost:4000/sublets");
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  export const getEveryProviders = async () => {
    try {
      const response = await axios.get("http://localhost:4000/providers");
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  export const getEveryExpenses = async () => {
    try {
      const response = await axios.get("http://localhost:4000/expenses");
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  


export const getDate = () => {
    const fecha = new Date();
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; 
    const año = fecha.getFullYear();
    const diaFormateado = dia < 10 ? `0${dia}` : dia;
    const mesFormateado = mes < 10 ? `0${mes}` : mes;
    return `${año}-${mesFormateado}-${diaFormateado}`;
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
  const roundedPrice = Math.round(price);
  const priceFormated = '$' + roundedPrice.toLocaleString('es-AR');
  return priceFormated;
}

export const formateInputPrice = (price) => { 
  const roundedPrice = Math.round(price);
  const priceFormated = roundedPrice.toLocaleString('es-AR');
  return priceFormated;
}


export const typeOfClientsAvailables = [
  { label: 'Bonificado', value: 'Bonificado' },
  { label: 'No Bonificado', value: 'No Bonificado' }
];

export const diferentOrdersStatus = [
  { label: 'A Confirmar', value: 'A Confirmar' },
  { label: 'Armado', value: 'Armado' },
  { label: 'Entregado', value: 'Entregado' },
  { label: 'Devuelto', value: 'Devuelto'},
  { label: 'Lavado', value: 'Lavado'},
];

export const paidOrNotPaid = [
  { label: 'Abonados', value: true },
  { label: 'No Abonados', value: false },
];

export const everyMonthsOfTheYear = [
  { key: "enero", label: "enero"},
  { key: "febrero", label: "febrero"},
  { key: "marzo", label: "marzo"},
  {key: "abril", label: "abril"},
  {key: "mayo", label: "mayo"},
  {key: "junio", label: "junio"},
  {key: "julio", label: "julio"},
  {key: "agosto", label: "agosto"},
  {key: "septiembre", label: "septiembre"},
  {key: "octubre", label: "octubre"},
  {key: "noviembre", label: "noviembre"},
  {key: "diciembre", label: "diciembre"},
];

export const everyYears = [
  { value: 2022, label: 2022},
  { value: 2023, label: 2023},
  { value: 2024, label: 2024},
  {value: 2025, label: 2025},
  {value: 2026, label: 2026},
  {value: 2027, label: 2027},
  {value: 2028, label: 2028},
];

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

export const accounts = [
  { key: "Cuenta Nacho", label: "Cuenta Nacho"},
  { key: "Cuenta Felipe", label: "Cuenta Felipe"},
  { key: "Efectivo", label: "Efectivo"},
];

export const typesOfCollections = [
  { label: "Alquiler", value: "Alquiler"},
  { label: "Reposicion", value: "Reposicion"},
  { label: "Seña", value: "Seña"},
];


export const everyClients = async () => { 
  try {
    const getData = await axios.get(`http://localhost:4000/clients`)
    const response = getData.data
    console.log("Todos los clientes", response)
    return response   
  } catch (error) {
     console.log(error)
  }
}

export const everyEmployees = async () => { 
  try {
    const getData = await axios.get(`http://localhost:4000/employees`)
    const response = getData.data
    console.log("Todos los empleados", response)
    return response   
  } catch (error) {
     console.log(error)
  }
}


export const convertTo12HourFormat = (time24) => {
  const [hour, minute] = time24.split(':').map(Number);
  let period = 'AM';
  let hour12 = hour;
  if (hour >= 12) {
      period = 'PM';
      if (hour > 12) {
          hour12 = hour - 12;
      }
  }
  if (hour12 === 0) {
      hour12 = 12; 
  }
  return `${hour12.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
}


export const everyActivities = [ 
  { label: 'Lavado', value: 'Lavado' },
  { label: 'Armado de Pedidos', value: 'Armado de Pedidos' },
  { label: 'Atencion Local', value: 'Atencion Local' },
  { label: 'Reparto', value: 'Reparto' },
  { label: 'Horas Extras', value: 'Horas Extras'}

]



export const obtenerHoraActualArgentina = () => {
  const fecha = new Date();
  const opciones = { hour: '2-digit', minute: '2-digit', hour12: true };
  const horaArgentina = fecha.toLocaleTimeString('es-AR', opciones);
  return horaArgentina;
}

