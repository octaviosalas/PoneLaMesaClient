export const getCurrentDate = () => {
    const fecha = new Date();
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; 
    const año = fecha.getFullYear();
    const diaFormateado = dia < 10 ? `0${dia}` : dia;
    const mesFormateado = mes < 10 ? `0${mes}` : mes;
    return `${año}-${mesFormateado}-${diaFormateado}`;
}

export const getFutureDate = (daysToAdd) => {
    console.log("diassssssssssss", daysToAdd)
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + daysToAdd);
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; 
    const año = fecha.getFullYear();
    const diaFormateado = dia < 10 ? `0${dia}` : dia;
    const mesFormateado = mes < 10 ? `0${mes}` : mes;
    return `${año}-${mesFormateado}-${diaFormateado}`;
}

