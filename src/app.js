import express  from 'express';
import { router as productsRouter } from "./routes/productsRouter.js"
import { router as cartsRouter } from "./routes/cartsRouter.js";

const port=8080;
const app=express();

//App.use para utilizar los routers
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//rutas
app.get( "/", (req, res) => {
    const message = `Primera Pre-Entrega!`;
    res.status(200).send({message});
})
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

//el servidor escucha en el puerto 3000
app.listen(port, ()=>console.log(`Server corriendo en puerto ${port}`))