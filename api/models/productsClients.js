import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
  
      platos: [
        {
          articulo: String,
          precioUnitarioAlquiler: Number,
          precioUnitarioReposicion: Number,
        },
      ],
      copas: [
        {
          articulo: String,
          precioUnitarioAlquiler: Number,
          precioUnitarioReposicion: Number,
        },
      ],
      juegoDeTe: [
        {
          articulo: String,
          precioUnitarioAlquiler: Number,
          precioUnitarioReposicion: Number,
        },
      ],
      juegoDeCafe: [
        {
          articulo: String,
          precioUnitarioAlquiler: Number,
          precioUnitarioReposicion: Number,
        },
      ],
      varios: [
        {
          articulo: String,
          precioUnitarioAlquiler: Number,
          precioUnitarioReposicion: mongoose.Schema.Types.Mixed,
        },
      ],
      manteleria: [
        {
          articulo: String,
          precioUnitarioAlquiler: Number,
          precioUnitarioReposicion: mongoose.Schema.Types.Mixed,
        },
      ],
      mesasYSillas: [
        {
          articulo: String,
          precioUnitarioAlquiler: Number,
          precioUnitarioReposicion: mongoose.Schema.Types.Mixed,
        },
      ],
    
  });
  
  const ProductsClients = mongoose.model("ProductsClients", productsSchema);
  
  export default ProductsClients;

