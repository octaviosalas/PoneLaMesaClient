import express from "express"
import cors from "cors"
import connectDataBase from "./database/connectDataBase.js"
import productsRoutes from "./routes/products.routes.js"
import bodyParser from "body-parser"
import userRoutes from "./routes/user.routes.js"
import ordersRoutes from "./routes/orders.routes.js"
import collectionsRoutes from "./routes/collections.routes.js"
import purchasesRoutes from "./routes/purchases.routes.js"
import clientesRoutes from "./routes/clients.routes.js"
import subletsRoutes from "./routes/sublets.routes.js"
import providersRoutes from "./routes/providers.routes.js"
import expensesRoutes from "./routes/expenses.routes.js"
import downPaymentsRoutes from "./routes/downPayments.routes.js"
import cleaningRoutes from "./routes/cleaning.routes.js"
import depositRoutes from "./routes/deposit.routes.js"
import employeesRoutes from "./routes/employees.routes.js"

const app = express()
const PORT = 4000

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));


app.use('/users', userRoutes);
app.use("/products", productsRoutes)
app.use("/orders", ordersRoutes)
app.use("/collections", collectionsRoutes)
app.use("/purchases", purchasesRoutes)
app.use("/clients", clientesRoutes)
app.use("/sublets", subletsRoutes)
app.use("/providers", providersRoutes)
app.use("/expenses", expensesRoutes)
app.use("/downPayment", downPaymentsRoutes)
app.use("/cleaning", cleaningRoutes)
app.use("/deposit", depositRoutes)
app.use("/employees", employeesRoutes)




app.get('/', (req, res) => {
    res.send('Bienvenidos a tu Servidor para el cliente poneLaMesa!')
  })
  

app.listen(PORT, () => {
     console.log("Servidor de NodeJs/Express - Proyecto poneLaMesa -  Iniciado en el puerto 4000 ✔✔")
     connectDataBase()

})