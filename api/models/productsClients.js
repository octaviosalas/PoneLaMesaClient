import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
  
      platos: [
        {
          articulo: String,
          precioUnitarioAlquiler: Number,
          precioUnitarioReposicion: Number,
          precioUnitarioAlquilerBonificados: Number,
          stock: Number,
        },
      ],
      copas: [
        {
          articulo: String,
          precioUnitarioAlquiler: Number,
          precioUnitarioReposicion: Number,
          precioUnitarioAlquilerBonificados: Number,
          stock: Number,
        },
      ],
      juegoDeTe: [
        {
          articulo: String,
          precioUnitarioAlquiler: Number,
          precioUnitarioReposicion: Number,
          precioUnitarioAlquilerBonificados: Number,
          stock: Number,
        },
      ],
      juegoDeCafe: [
        {
          articulo: String,
          precioUnitarioAlquiler: Number,
          precioUnitarioReposicion: Number,
          precioUnitarioAlquilerBonificados: Number,
          stock: Number,
        },
      ],
      varios: [
        {
          articulo: String,
          precioUnitarioAlquiler: Number,
          precioUnitarioReposicion: mongoose.Schema.Types.Mixed,
          precioUnitarioAlquilerBonificados: Number,
          stock: Number,
        },
      ],
      manteleria: [
        {
          articulo: String,
          precioUnitarioAlquiler: Number,
          precioUnitarioReposicion: mongoose.Schema.Types.Mixed,
          precioUnitarioAlquilerBonificados: Number,
          stock: Number,
        },
      ],
      mesasYSillas: [
        {
          articulo: String,
          precioUnitarioAlquiler: Number,
          precioUnitarioReposicion: mongoose.Schema.Types.Mixed,
          precioUnitarioAlquilerBonificados: Number,
          stock: Number,
        },
      ],
    
  });
  
  const ProductsClients = mongoose.model("ProductsClients", productsSchema);
  
  export default ProductsClients;

