const deleteProductPermission = require("../../helpers/permission")
const productModel = require("../../models/productModel")

async function DeleteProductController(req,res){
    try{
        const sessionUserId = req.userId

        if(!deleteProductPermission(sessionUserId)){
            throw new Error("Permission denied")
        }
    
        const deleteProduct = await productModel.findByIdAndDelete(req.params.id)

        res.status(200).json({
            message : "Product deleted successfully",
            error : false,
            success : true,
            data : deleteProduct
        })

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}