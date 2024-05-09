export const formatePriceBackend= (price) => { 
    const roundedPrice = Math.round(price);
    const priceFormated = '$' + roundedPrice.toLocaleString('es-AR');
    return priceFormated;
  }