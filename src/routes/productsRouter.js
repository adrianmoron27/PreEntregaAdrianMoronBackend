import { Router } from 'express';
import productManager from "../dao/productManager.js";
export const router=Router();

const Products=new productManager("./src/data/products.json");

//Ruta para visualizar todos los productos o con un límite de visualización
router.get("/", async(req, res)=>{
    let {limit}=req.query;
    let product = await Products.getProducts(limit);
    if(limit){
        product=product.slice(0, limit);
    }
    res.json({Products: product});
})

//Ruta para visualizar solo uno de los productos por su id
router.get("/:pid", async(req, res)=>{
    let pid=req.params.pid
    // validar que sea numerico...
    pid=Number(pid)  // "100"
    if(isNaN(pid)){
        res.setHeader('Content-Type','application/json');
        res.status(400).json({error:`Ingrese un id numérico`});
    }
    try {
        let product = await Products.getProductsById(Number(pid));
        if(!product){
            res.status(400).json({message:`No existen products con id ${pid}`});
        }
        res.status(200).json({Products: product});
    } catch (error) {
        console.log(error);
        return res.status(400).json({error: error.message});
    }
})

router.post("/", async(req, res)=>{
    let {title, description, price, status, code, stock, category, brand, thumbnail} = req.body
    // validacion que exista
    if (!title || !description || !price || !code || !stock || !category || !brand) {
        res.setHeader('Content-Type','application/json');
        res.status(400).json({Error:`Debe ingresar todos los os requeridos`});
    }
    // validación que  el codigo sea único se hace en la clase
    // validacion que el precio sea numerico
    price=Number(price)
    if(isNaN(price)) {
        return res.status(400).json({Error:'El precio debe ser número'})
    }
    //validacion que el estock sea entero
    stock=Number(stock)
    if (!Number.isInteger(stock)) {
        return res.status(400).json({Error:'La cantidad del stock debe ser un numero entero'})
    }
    // resto validaciones ...
    
    try {
        let newProduct=await Products.addProduct(title, description, price, status, code, stock, category, brand, thumbnail) 
        res.setHeader('Content-Type','application/json');
        return res.status(200).json(newProduct);
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`${error.message}`
            }
        )
    }
})

router.put("/:pid", async(req, res)=>{
    let pid=req.params.pid
    // validar que sea numerico...
    pid=Number(pid)
    if (isNaN(pid)){
        return res.status(400).json({error:`Ingrese un id numérico...!!!`})
    }
    // resto validaciones ...

    try {
        let productModificado=await Products.updateProduct(pid,req.body)
        res.setHeader('Content-Type','application/json');
        return res.status(200).json(productModificado);
    
    } catch (error) {
        console.log(error);
        return res.status(400).json({error: error.message});
    }
})

router.delete("/:pid", async(req, res)=>{
    let pid=req.params.pid
    // validar que sea numerico...
    pid=Number(pid) 
    if(isNaN(pid)){
        return res.status(400).json({error:`Ingrese un id numérico...!!!`});
    }
    try {
        let productEliminado=await Products.deleteProduct(pid);
        res.setHeader('Content-Type','application/json');
        return res.status(200).json(productEliminado);
    } catch (error) {
        console.log(error);
        return res.status(400).json({error: error.message});
    }
})