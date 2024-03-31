import Deposit from "../models/depositDay.js"

export const getDepositData = async (req, res) => { 
    try {
        const depositData = await Deposit.find()
        if(!depositData) { 
            return res.status(404).json({ message: 'No hay articulos en deposito' });
        }
        res.status(200).json(depositData);

    } catch (error) {
        res.status(500).json({ error: 'Error al obtener arituclos de deposito' });
    }
}

export const addNewArticlesToDeposit = async (req, res) => { 
    try {
        const products = req.body;

        for (const product of products) {
            const filter = { productId: product.productId };
            const update = {
                $inc: { quantity: product.quantityToPassToWash } 
            };

            const updatedDocument = await Deposit.findOneAndUpdate(filter, update, {
                new: true, 
                upsert: false 
            });

            if (!updatedDocument) {
                const newProduct = new Deposit({
                    productId: product.productId,
                    productName: product.productName,
                    quantity: product.quantityToPassToWash 
                });
                await newProduct.save();
            }
        }

        res.status(200).send('Productos procesados exitosamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al procesar los productos');
    }
}

export const updateDepositData = async (req, res) => { 
    const {productId} = req.params;
    console.log(req.body)
    
    try {
        const findTheProduct = await Deposit.findOneAndUpdate(
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