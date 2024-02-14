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