import { Router } from 'express';
import CartManager from "../dao/cartManager.js";

export const router=Router();

const Carts=new CartManager("./src/data/carts.json");

//La ruta RAIZ GET devuelve todos los carritos
router.get( '/', (req, res) =>{
    const Cart=Carts.getCarts();
    return res.json({Cart});
});

//La ruta /:cid devuelve el contenido del carro con id :
router.get( '/:cid', async(req, res) =>{
    let {cid} = req.params;
    cid=Number(cid) 
    if(isNaN(cid)){
        return res.status(400).json({error:`Ingrese un id de carrito numérico...!!!`})
    }
    try {
        const Cart=await Carts.getCartsById(Number(cid));
        if(!Cart){
            res.status(400).json({message:`No existen carritos con id ${cid}`});
        }
        return res.status(200).json({Cart});
    } catch (error) {
        console.log(error);
        return res.status(400).json({error: error.message});
    }
});

//La ruta RAÍZ POST crea un nuevo carrito
router.post('/', (req,res)=>{
    const Cart=Carts.createCart();
    return res.status(200).json({Cart});
});

//La Ruta /:cid/product/:pid agrega un producto al carro de compras 
router.post('/:cid/product/:pid', async(req,res)=>{
    let {cid, pid} = req.params;
    cid=Number(cid) 
    if(isNaN(cid)){
        return res.status(400).json({error:`Ingrese un id de carrito numérico...!!!`})
    }
    pid=Number(pid) 
    if(isNaN(pid)){
        return res.status(400).json({error:`Ingrese un id de producto numérico...!!!`})
    }
    try {
        const Cart=await Carts.addProductInCart(Number(cid), Number(pid));
        return res.status(200).json({Cart});
    } catch (error) {
        console.log(error)
        return res.status(400).json({error: error.message});
    }
});

router.delete("/:cid", async(req, res)=>{
    let cid=req.params.cid
    // validar que sea numerico...
    cid=Number(cid) 
    if(isNaN(cid)){
        return res.status(400).json({error:`Ingrese un id numérico...!!!`})
    }
    try {
        let cartEliminado=await Carts.deleteCart(cid)
        res.setHeader('Content-Type','application/json');
        return res.status(200).json(cartEliminado);
    } catch (error) {
        console.log(error)
        return res.status(400).json({error: error.message});
    }
})