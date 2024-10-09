import Cleaning from "../models/cleaningDay.js"
import { incrementStockJustInOneProduct } from "./orders.controllers.js";

export const addNewArticlesToWash = async (req, res) => {
    try {
        const products = req.body;
        console.log("me llego esto para pasar a lavado!", products)

        for (const product of products) {
            const filter = { productId: product.productId };
            const update = {
                $inc: { quantity: product.quantity } 
            };

            const updatedDocument = await Cleaning.findOneAndUpdate(filter, update, {
                new: true, 
                upsert: false 
            });

            if (!updatedDocument) {
                const newProduct = new Cleaning({
                    productId: product.productId,
                    productName: product.productName,
                    quantity: product.quantity,
                    productPrice: product.productPrice  
                });
                await newProduct.save();
            }
        }

        res.status(200).send('Productos procesados exitosamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al procesar los productos');
    }
};

export const getCleaningData = async (req, res) => { 
    try {
        const cleaningData = await Cleaning.find()
        if(!cleaningData) { 
            return res.status(404).json({ message: 'No hay lavado' });
        }
        res.status(200).json(cleaningData);

    } catch (error) {
        res.status(500).json({ error: 'Error al obtener lavados' });
    }
}

export const updateCleaningData = async (req, res) => { 
    const {productId} = req.params;
    console.log(req.body)
    
    try {
        const findTheProduct = await Cleaning.findOneAndUpdate(
            {productId: productId}, 
            { $set: { quantity: req.body.newQuantity } },
            { new: true } 
        );
        await incrementStockJustInOneProduct(req.body);
        if(!findTheProduct) { 
            return res.status(404).json({ message: 'No se encontro el producto' });
        }
        res.status(200).json(findTheProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al actualizar los datos de limpieza' });
    }
}





