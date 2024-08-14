import subletsToReturn from "../models/subletsToReturn.js"
import { incrementStockJustInOneProduct } from "./orders.controllers.js";

export const addNewArticlesToReturnSublet = async (req, res) => {
    try {
        const products = req.body;
        console.log("PARA AGREGAR AL MODULO NUEVO", products)

        for (const product of products) {
            const filter = { productId: product.productId };
            const update = {
                $inc: { quantity: product.quantity } 
            };

            const updatedDocument = await subletsToReturn.findOneAndUpdate(filter, update, {
                new: true, 
                upsert: false 
            });

            if (!updatedDocument) {
                const newProduct = new subletsToReturn({
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
        const subletsArticles = await subletsToReturn.find()
        if(!subletsArticles) { 
            return res.status(404).json({ message: 'No hay articulos' });
        }
        res.status(200).json(subletsArticles);

    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos subalquilados' });
    }
}

export const returnToProvider = async (req, res) => { 
    const {productId} = req.params;
    console.log(req.body)
    console.log(req.body.quantity)

    try {
        const productSelected = await subletsToReturn.findOne({productId: productId})
        if(productSelected) { 
            const actualQuantity = productSelected.quantity
            productSelected.quantity = actualQuantity - req.body.quantity
            await productSelected.save()
            res.status(200).send('actualizado');
            console.log("producto encontrado")
        }  else { 
            console.log("producto no encontrado")
        }    
       
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al actualizar los datos de devolucion de subalquileres' });
    }
}





