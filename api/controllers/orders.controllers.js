import Orders from "../models/orders.js";
import DownPayments from "../models/downPayment.js"
import Collections from "../models/collections.js";
import ProductsClients from "../models/productsClients.js";
import PDFDocument from "pdfkit";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { formatePriceBackend } from "../utils/formatePriceBackend.js";
import { getCurrentDate, getFutureDate } from "../utils/dateFunctios.js";
import Clients from "../models/clients.js"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagePath = path.join(__dirname, '..', 'imagesApi', 'logo.png');


const getPreviousMonth = (currentMonth) => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1); // Retrocede un mes
  const previousMonth = date.toLocaleString('default', { month: 'long' }).toLowerCase();
  return previousMonth;
};

const getCurrentMonth = () => {
  return new Date().toLocaleString('default', { month: 'long' }).toLowerCase();
};




export const incrementarStock = async (productosComprados) => { 
  try {
    for (const productoCompra of productosComprados) {
      const { productId, quantity } = productoCompra;
      const cantidad = parseInt(quantity, 10); // Convertir a entero
      console.log("Me llego:", productId, cantidad);
      await ProductsClients.findByIdAndUpdate(
        productId,
        { $inc: { stock: cantidad }},
        { new: true }
      );
    }
  } catch (error) {
    throw new Error(`Error al incrementar el stock: ${error.message}`);
  }
};

export const incrementStockJustInOneProduct = async (productoCompra) => { 
  try {
     const { productId, quantity } = productoCompra;
     const cantidad = quantity; 
     console.log("Me llego:", productId, cantidad);
     await ProductsClients.findByIdAndUpdate(
       productId, // Pasar directamente el productId
       { $inc: { stock: cantidad }},
       { new: true }
     );
  } catch (error) {
     throw new Error(`Error al incrementar el stock: ${error.message}`);
  }
 };

export const decrementarStock = async (productosComprados) => { 
  try {
    for (const productoCompra of productosComprados) {
      const { productId, quantity } = productoCompra;
      const cantidad = parseInt(quantity, 10); // Convertir a entero
      console.log("Antes de la actualización:", productId, cantidad);
      await ProductsClients.findByIdAndUpdate(
        productId,
        { $inc: { stock: -cantidad }},
        { new: true }
      );
      console.log("Después de la actualización:", productId, cantidad);
    }
  } catch (error) {
    throw new Error(`Error al decrementar el stock: ${error.message}`);
  }
};

/*export const getOrders = async (req, res) => { 
  console.log("eee");
  
  // Obtener el mes actual y el mes previo
  const currentMonth = getCurrentMonth();
  const previousMonth = getPreviousMonth(currentMonth);
  
  try {
    // Buscar órdenes en el mes actual o el mes previo
    const orders = await Orders.find({ month: { $in: [currentMonth, previousMonth] } }).limit(300);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las ordenes' });
    console.log(error);
  }
}; */

export const getOrders = async (req, res) => { 

  const currentMonth = getCurrentMonth();
  const previousMonth = getPreviousMonth(currentMonth);

  try {
    // Buscar todas las órdenes del mes actual y ordenarlas desde la más reciente (número de orden más alto)
    const currentMonthOrders = await Orders.find({ month: currentMonth }).sort({ orderNumber: -1 });

    let orders = [];

    // Si el número de órdenes del mes actual es menor a 300, añadir órdenes del mes anterior
    if (currentMonthOrders.length < 300) {
      // Calcular cuántas órdenes faltan para llegar a 300
      const remaining = 300 - currentMonthOrders.length;
      
      // Buscar órdenes del mes anterior hasta completar el límite de 300 y ordenarlas
      const previousMonthOrders = await Orders.find({ month: previousMonth })
        .sort({ orderNumber: -1 }) // Ordenar también del más alto al más bajo
        .limit(remaining);

      // Combinar órdenes del mes actual y las que faltan del mes anterior
      orders = [...currentMonthOrders, ...previousMonthOrders];
    } else {
      // Si ya hay 300 o más órdenes del mes actual, solo devolver esas
      orders = currentMonthOrders.slice(0, 300);
    }

    // Devolver las órdenes combinadas o las del mes actual hasta el máximo de 300
    res.status(200).json(orders.reverse());
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las ordenes' });
    console.log(error);
  }
};

export const getOrderById = async (req, res) => { 
  const {orderId} = req.params
  try {
    const findOrderNow = await Orders.findById({_id: orderId})
    if(!findOrderNow) { 
      return res.status(500).json({message: "No encontre la orden"});
    }
    return res.status(200).json(findOrderNow);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las ordenes' });
    console.log(error)
  }   
}

export const getOrdersByClient = async (req, res) => { 
  const {clientId} = req.params
  try {
    const findClientsOrders = await Orders.find({clientId: clientId})
    if(!findClientsOrders) { 
      return res.status(500).json({message: "No encontre ordenes del cliente"});
    }
    return res.status(200).json(findClientsOrders);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las ordenes' });
    console.log(error)
  }   
}

export const getMonthlyOrders = async (req, res) => { 
  const {month} = req.params
  console.log(month)
  console.log("me llego algo")
  try {
     const justThisMonthOrders = await Orders.find({month: month})
     res.status(200).json(justThisMonthOrders);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las ordenes del mes' });
    console.log(error)
  }
}



export const createOrder = async (req, res) => { 
  console.log(req.body)
  try {
      if (req.body.orderStatus === "A Confirmar") {
          const newOrder = new Orders(req.body);
          const orderSaved = await newOrder.save();
          res.status(201).json(orderSaved);
      } else {
          const newOrder = new Orders(req.body);
          const orderSaved = await newOrder.save();
          await decrementarStock(req.body.orderDetail);
          res.status(200).json(orderSaved);
      }
  } catch (error) {
      res.status(500).json({ error: 'Error al crear la orden' });
      console.log(error);
  }
}



export const changeOrderToConfirmedAndDiscountStock = async (req, res) => { 
  try {
     const { orderId } = req.params;
     const { detailOrder } = req.body;
     console.log(detailOrder);

     const foundOrder = await Orders.findById({_id: orderId});
 
     if (!foundOrder) {
       return res.status(404).json({ error: 'No se encontró la orden correspondiente.' });
     }
 
    
     detailOrder.subletDetail.forEach(sublet => {
       foundOrder.subletsDetail.push(sublet);
     });
 
     await foundOrder.save();
 
     res.status(200).json({ message: 'La orden se ha confirmado, el stock se ha descontado, y se han actualizado los detalles correctamente.' });
  } catch (error) {
     console.error(error);
     res.status(500).json({ error: 'Error al procesar la solicitud.' });
  }
 };


export const changeOrderState = async (req, res) => { 
  const { orderId } = req.params;
  const {newStatus} = req.body
  console.log("change order state:",  newStatus )

  try {
    const orderUpdated= await Orders.findByIdAndUpdate(
        { _id: orderId },
        { orderStatus: newStatus },
        { new: true } 
    );

    await orderUpdated.save()

    if (!orderUpdated) {
        return res.status(404).json({ error: "No se encontró el estado" });
    }

    if(newStatus === "Armado") { 
      await decrementarStock(orderUpdated.orderDetail)
      console.log("Voy a decrementar stock")
    }

    res.status(200).json(orderUpdated);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    } 
}

export const deleteOrder = async (req, res) => { 
  const {orderId} = req.params
  console.log(orderId)
  try {
    const deletedOrder = await Orders.findByIdAndDelete({_id: orderId});
    if (deletedOrder) {
      res.status(200).json({ message: 'Pedido eliminado correctamente', deleted: deletedOrder });
    } else {
      res.status(404).json({ message: 'Pedido no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la recomendacion' });
  }
}

export const addPaid = async (req, res) => { 
  const { orderId } = req.params;
  try {
    const orderUpdated= await Orders.findByIdAndUpdate(
        { _id: orderId },
        { paid: true },
        { new: true } 
    );

    if (!orderUpdated) {
        return res.status(404).json({ error: "No se encontró el pedido" });
    }

    res.status(200).json(orderUpdated);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Error interno del servidor" });
    } 
}


export const deleteAndReplenishArticles = async (req, res) => { 

  const { orderId } = req.params;
  try {
    const order = await Orders.findById({_id: orderId});
    if (!order) {
      return res.status(404).json({ mensaje: 'Orden no encontrada' });
    }

    const rentedProducts = order.orderDetail;

    if (order.downPaymentData && order.downPaymentData.length > 0) {
      const downPaymentId = order.downPaymentData[0].downPaymentId;
      await DownPayments.findOneAndDelete({ downPaymentId: downPaymentId });
    }

    if(order.orderStatus === "A Confirmar" || order.orderStatus === "Confirmado") { 
      await Orders.findByIdAndDelete(orderId);
      res.status(200).json({ mensaje: 'Alquiler eliminada y sin afectar el stock' });
      console.log(`No voy a hacer nada con el stock porque la orden está en ${order.orderStatus}`);
  } else { 
      // Se descuenta el stock
      await Promise.all(
        rentedProducts.map(async (productRented) => {
        const { productId, quantity } = productRented;
        const cantidad = parseInt(quantity, 10);
    
        await ProductsClients.findByIdAndUpdate(
          { _id: productId },
          { $inc: { stock: +cantidad } },
          { new: true }
        );
      })
    );
    await Orders.findByIdAndDelete(orderId);
    res.status(200).json({ mensaje: 'Alquiler eliminada y stock repuesto' });
    console.log(`Voy a devolver stock porque la orden está en ${order.orderStatus}`);
    }
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al procesar la solicitud' });
  }

} 

export const updateOrderData = async (req, res) => { 
  const {orderId} = req.params
  const {newOrderClient, newOrderClientId} = req.body
  console.log(req.body)

      try {
        Orders.findByIdAndUpdate({ _id: orderId }, { 
        client: newOrderClient,
        clientId: newOrderClientId,       
        })
        .then((newOrderData) => {                                      
        res.json({message:"Orden actualizada Correctamente", newOrderData})
        })
        .catch((err) => { 
        console.log(err)
        })

    } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const updateOrderDetail = async (req, res) => {
  const { orderId } = req.params;
  const { newOrderDetailData } = req.body;
  console.log(req.body)
  console.log("NEW TOTAL AMOUNT RECIBIDO", req.body.newTotalAmount)

  try {
    if (req.body && req.body.completeNewDetail && req.body.newTotalAmount) {
      const updatedOrderData = await Orders.findOneAndUpdate(
        { _id: orderId },
        {
          $set: {
            total: req.body.newTotalAmount,
            orderDetail: req.body.completeNewDetail,
          },
        },
        { new: true }
      );

      if(req.body.toDiscountStock.length > 0) { 
        await decrementarStock(req.body.toDiscountStock);
      }

      if(req.body.toIncrementStock.length > 0) { 
        await incrementarStock(req.body.toIncrementStock);
      }

      if(req.body.newProductToDisscountStock.length > 0) {
        console.log("NUEVO PRODUCTO PARA DESCONTAR STOCK") 
        await decrementarStock(req.body.newProductToDisscountStock);
      }


      res.json({ message: "Detalles del pedido actualizados correctamente", updatedOrderData });
    } else {
      res.status(400).json({ message: 'El objeto newOrderDetailData no tiene la estructura esperada.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const addNewProductsToOrderDetail = async (req, res) => {
  const { orderId } = req.params;
  const productsSelected = req.body; 

  try {
    const existingOrder = await Orders.findById(orderId);
    if (!existingOrder) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    existingOrder.orderDetail.push(...productsSelected);
    existingOrder.total += productsSelected.reduce((acc, obj) => acc + obj.choosenProductTotalPrice, 0);

    const updatedOrder = await existingOrder.save();
    await decrementarStock(productsSelected);

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar nuevos productos a la orden' });
  }
};

export const addArticlesMissed = async (req, res) => {
  const { orderId } = req.params;
  console.log("CUERPO DEL POST", req.body)

  try {
    const existingOrder = await Orders.findById(orderId);
    if (!existingOrder) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    console.log("LA ORDEN QUE ENCONTRE", existingOrder)

    existingOrder.missingArticlesData.push(req.body);
    const updatedOrder = await existingOrder.save();
    res.status(200).json(updatedOrder);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar nuevos productos a la orden' });
  }
};


export const updateMissingArticlesLikePaid = async (req, res) => { 
  const {orderId} = req.params;
  const {missedArticlesData} = req.body;
  
  try {
      const existingOrder = await Orders.findById(orderId);
      if (!existingOrder) {
        return res.status(404).json({ error: 'Orden no encontrada' });
      }
  
      const orderSearched = existingOrder.missingArticlesData.find(missed => missed.missedProductsData.missedArticlesReferenceId === missedArticlesData.missedArticlesReference);
      console.log("LA MISSED ARTICLES ENCONTRADA", orderSearched)
  
      if (!orderSearched) {
        return res.status(404).json({ error: 'Artículo perdido no encontrado' });
      } else { 
       console.log("LA MISSED ARTICLES ENCONTRADA", orderSearched)
      }
  
      orderSearched.missedProductsData.paid = missedArticlesData.newStatus;
  
      existingOrder.markModified('missingArticlesData');
  
      const updatedOrder = await existingOrder.save();
  
      res.status(200).json(updatedOrder);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
 };



 export const createPdf = async (req, res) => {
  const { dataFormatedToList } = req.body;
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=archivo.pdf');
 
  doc.pipe(res);
  let yPosition = 50;
 
  dataFormatedToList.forEach((order, index) => {
    doc.font('Helvetica').fontSize(14).fillColor('green').text(`Direccion de Envio: ${order.DireccionDeEnvio}`, 50, yPosition);
    yPosition += 20;
    doc.font('Helvetica').fontSize(13).fillColor('black').text(`Cliente: ${order.Cliente}`, 50, yPosition);
    yPosition += 20;
    doc.font('Helvetica').fontSize(11).fillColor('black').text(`Numero de Orden: ${order.NumeroDeOrden}`, 50, yPosition);
    yPosition += 20;
    doc.font('Helvetica').fontSize(11).fillColor('black').text('Detalle de la Orden:', 50, yPosition);

     yPosition += 20;
     order.Detalle.forEach((product, productIndex) => {
       doc.fontSize(10).text(`Articulo: ${product.Articulo} - Cantidad: ${product.Cantidad}`, 50, yPosition, {
         lineGap: 10
       });
       yPosition += 20;
     });
 
     yPosition += 20;
  });
 
  doc.end();
 };
 

 export const deleteDownPaymentData = async (req, res) => {
  const { orderId } = req.params;

  console.log("req.params recibido", orderId)
  console.log("req.body.downPaymentReference recibido", req.body.downPaymentId)

  try {
     await Orders.updateOne({ _id: orderId }, { $set: { downPaymentData: [] } }); 
     await DownPayments.deleteOne({ downPaymentId: req.body.downPaymentId }); 
     await Collections.deleteOne({ downPaymentId:  req.body.downPaymentId}); 
 
     res.status(200).send({ message: 'Seña eliminado correctamente.' });
  } catch (error) {
     res.status(500).send({ message: 'Error al eliminar downPaymentData.', error });
  }
 };


 export const createDetailPdf = async (req, res) => {

  const { result } = req.body;
  console.log(result);




  const clientId = result.clienteId
  console.log(result)
  
  const clientAllData = await Clients.findById(clientId)
  console.log("CLIENTALLDATA", clientAllData)
  const clientPhone = clientAllData.telephone

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=detalle_${result.cliente}.pdf`);
  doc.pipe(res);

  let yPosition = 50;

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;

  const imageWidth = 100; 
  const imageX = (pageWidth - imageWidth) / 2;

  const imageY = yPosition; 

  const imagePath = path.join(__dirname, '..', 'imagesApi', 'logo.png');
  doc.image(imagePath, imageX, imageY, { width: imageWidth }); 
  yPosition = imageY + 120; 


  doc.font('Helvetica-Bold').fontSize(15).fillColor('black').text(`${result.cliente}`, 50, yPosition);
  yPosition += 20;
  doc.font('Helvetica').fontSize(14).fillColor('black').text(`Direccion de entrega: ${result.lugarDeEntrega}`, 50, yPosition);
  yPosition += 20
  doc.font('Helvetica').fontSize(14).fillColor('black').text(`Telefono: ${clientPhone}`, 50, yPosition);
  yPosition += 20
  doc.font('Helvetica').fontSize(14).fillColor('black').text(`Fecha de entrega: ${result.fechaEntrega}`, 50, yPosition);
  yPosition += 20;
  doc.font('Helvetica').fontSize(14).fillColor('black').text(`Fecha de devolucion: ${result.fechaDevolucion}`, 50, yPosition);
  yPosition += 20;
 
  yPosition += 10;

  doc.moveTo(50, yPosition).lineTo(pageWidth - 50, yPosition).stroke();
  yPosition += 10;

  

  doc.font('Helvetica-Bold').fontSize(12).fillColor('black').text('Detalle de Articulos Alquilados:', 50, yPosition);
  yPosition += 30;
  doc.font('Helvetica').fontSize(13).fillColor('black').text('Articulo', 50, yPosition);
  doc.font('Helvetica').fontSize(13).fillColor('black').text('Cantidad', 200, yPosition);
  doc.font('Helvetica').fontSize(13).fillColor('black').text('Total', 300, yPosition);
  doc.font('Helvetica').fontSize(13).fillColor('black').text('Reposicion', 420, yPosition);
  yPosition += 20;


  result.articles.forEach((article, index) => {
     doc.font('Helvetica').fontSize(12).fillColor('black').text(article.articulo, 50, yPosition);
     doc.font('Helvetica').fontSize(12).fillColor('black').text(article.cantidad.toString(), 200, yPosition);
     doc.font('Helvetica').fontSize(12).fillColor('black').text(formatePriceBackend(article.total).toString(), 300, yPosition);
     doc.font('Helvetica').fontSize(12).fillColor('black').text(formatePriceBackend(article.reposicion).toString(), 420, yPosition);
     yPosition += 20;
  });

  yPosition += 10;
  doc.moveTo(50, yPosition).lineTo(pageWidth - 50, yPosition).stroke();
  yPosition += 10;



  doc.font('Helvetica').fontSize(14).fillColor('black').text(`Costo de envio: ${formatePriceBackend(result.envio).toString()}`, 50, yPosition);
  yPosition += 25; 


  if (result.seña.length > 0) {
    result.seña.forEach(señaItem => {
      doc.font('Helvetica').fontSize(14).fillColor('black').text(`Seña: ${formatePriceBackend(señaItem.amount)}`, 50, yPosition);
      yPosition += 25; 
    });

    result.seña.forEach(señaItem => {
      doc.font('Helvetica').fontSize(14).fillColor('black').text(`Saldo: ${formatePriceBackend(Number(result.total) - señaItem.amount)}`, 50, yPosition);
      yPosition += 25; 
    });
    

    
   
  } else {
    doc.font('Helvetica').fontSize(14).fillColor('black').text('Seña: Sin seña', 50, yPosition);
    yPosition += 25; 
  }



  doc.font('Helvetica-Bold').fontSize(15).fillColor('black').text(`Total: ${formatePriceBackend(result.total)}`, 50, yPosition);

 

  doc.end();
};



export const nextFiveDaysOrdersWithDelivery = async (req, res) => {
  console.log("recibido")
  try {
    const currentDate = getCurrentDate();
    const futureDate = getFutureDate(5);

    const currentDateObj = new Date(currentDate);
    const futureDateObj = new Date(futureDate);

    const result = await Orders.find({
      dateOfDelivery: {
            $gte: currentDateObj.toISOString().split('T')[0],
            $lte: futureDateObj.toISOString().split('T')[0]
        }
    });

    res.status(200).json(result)
} catch (error) {
    console.error('Error obteniendo los documentos:', error);
}
 };


 export const nextFiveDaysOrdersConfirmed = async (req, res) => {
  console.log("recibido")
  try {
    const currentDate = getCurrentDate();
    const futureDate = getFutureDate(5);

    const currentDateObj = new Date(currentDate);
    const futureDateObj = new Date(futureDate);

    const result = await Orders.find({
      dateOfDelivery: {
            $gte: currentDateObj.toISOString().split('T')[0],
            $lte: futureDateObj.toISOString().split('T')[0]
        }
    });

    const filterResult = result.filter((res) => res.orderStatus === "Armado" || res.orderStatus === "Confirmado")

    res.status(200).json(filterResult)
} catch (error) {
    console.error('Error obteniendo los documentos:', error);
}
 };



 const getNextMonday = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 es domingo, 1 es lunes, ..., 6 es sábado
  const daysUntilNextMonday = (dayOfWeek === 0) ? 1 : (8 - dayOfWeek); // Si hoy es domingo, el próximo lunes es en 1 día, si no, es hasta el siguiente lunes
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysUntilNextMonday);
  return nextMonday;
};



export const ordersAfterFiveDays = async (req, res) => {
  try {
    const futureDate = getNextMonday();
    const futureDateStr = futureDate.toISOString().split('T')[0];

    const result = await Orders.find({
      dateOfDelivery: {
        $gte: futureDateStr
      }
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error obteniendo los documentos:', error);
    res.status(500).json({ message: 'Error al obtener las órdenes' });
  }
};


export const getOrdersToBeConfirmed = async (req, res) => { 
    try {
      const orders = await Orders.find()
      const toBeConfirmed = orders.filter((ord) => ord.orderStatus === "A Confirmar")
      res.status(200).json(toBeConfirmed);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las ordenes' });
      console.log(error)
    }
}

export const changeSomeStatus = async (req, res) => {
  try {

    console.log(req.body)


    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'El cuerpo de la solicitud debe contener un array de órdenes con _id' });
    }

    const updatePromises = req.body.map(order => 
      Orders.findByIdAndUpdate(order._id, { orderStatus: 'Entregado' }, { new: true })
    );

    await Promise.all(updatePromises);

    res.status(200).json({ message: 'Todas las órdenes han sido actualizadas a "entregado"' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar las órdenes' });
    console.error(error);
  }
};

export const createParcialPayment = async (req, res) => {

  const {amount, account, day, month, year, date, orderId, collectionType, client, orderDetail, loadedBy, voucher} = req.body
  const {orderIdReference} = req.params

    try {
      const orderSelected = await Orders.findById(orderIdReference)
      if(!orderSelected) { 
        res.status(404).send("No encontre la orden")
      } else { 

        const newCollectionToBeSaved = new Collections({ 
          amount,
          account,
          day,
          month,
          year,
          date,
          orderId,
          collectionType,
          client,
          orderDetail,
          loadedBy,
          voucher: "",
          paymentReferenceId: ""
        }) 
  
        await newCollectionToBeSaved.save()


        orderSelected.parcialPayment.push({ 
          amount: Number(amount),
          account: account,
          day: day,
          month: month,
          year: year,
          date: date,
          collectionReferenceId: newCollectionToBeSaved._id
        })
      }
      await orderSelected.save()
      
    
      res.status(200).json({ message: "Se añado correctamente el pago parcial" });

    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar las órdenes' });
      console.error(error);
    }
};

export const deleteParcialPayment = async (req, res) => {
  const { orderIdReference } = req.params;
  const { id } = req.body; 

  try {
    const orderSelected = await Orders.findById(orderIdReference);
    if (!orderSelected) {
      return res.status(404).send("No encontré la orden");
    }

    const updatedParcialPayments = orderSelected.parcialPayment.filter(
      (payment) => payment.collectionReferenceId.toString() !== id
    );

    orderSelected.parcialPayment = updatedParcialPayments;
    await orderSelected.save();

    const collectionSelectedToBeDeleted = await Collections.findByIdAndDelete(id);
    if (!collectionSelectedToBeDeleted) {
      return res.status(404).send("No se encontró el documento para eliminar");
    }

    res.status(200).send("Pago parcial eliminado");
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar las órdenes' });
    console.error(error);
  }
};

export const editParcialPaymentAmount = async (req, res) => {
  const { orderIdReference } = req.params;
  const { newPaymentAmount, collectionId } = req.body;

  try {
    const orderOfParcialPayment = await Orders.findById(orderIdReference);
    if (!orderOfParcialPayment) {
      return res.status(404).send("No encontré la orden");
    }

    const index = orderOfParcialPayment.parcialPayment.findIndex(
      (ord) => ord.collectionReferenceId.toString() === collectionId
    );

    if (index === -1) {
      return res.status(404).send("No se encontró el pago parcial");
    } else {
      // Actualiza el subdocumento dentro del arreglo parcialPayment
      await Orders.updateOne(
        { _id: orderIdReference, "parcialPayment._id": orderOfParcialPayment.parcialPayment[index]._id },
        { $set: { "parcialPayment.$.amount": newPaymentAmount } }
      );

      // Continúa con la lógica existente para actualizar la colección
      const collectionData = await Collections.findByIdAndUpdate(
        collectionId, 
        { amount: newPaymentAmount }, 
        { new: true }
      );

      if (!collectionData) {
        return res.status(404).send("No se encontró la colección para actualizar");
      }

      res.status(200).send("Se actualizaron correctamente los datos");
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar las órdenes' });
    console.error(error);
  }
};