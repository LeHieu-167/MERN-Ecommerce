const stripe = require('../../config/stripe')
const userModel = require('../../models/userModel')
const paymentController = async(request, response)=>{
    try {
        const { cartItems } = request.body

        console.log("cartItems",cartItems)

        const user = await userModel.findOne({ _id: request.userId })
        const params = {
            submit_type: 'pay',
            mode : 'payment',
            payment_method_types: ['card'],
            billing_address_collection: 'auto',
            shipping_options : [
                {
                    shipping_rate : 'shr_1PeeJnEwtbDTXF0kVSna7niP'
                }
            ],
            customer_email : user.email,
            line_items: cartItems.map((item,index)=>{
                return{
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name : item.productId.productName,
                            images : item.productId.productImages,
                            metadata : {
                                productId : item.productId._id
                            } 
                        },
                        unit_amount: item.productId.sellingPrice
                    },
                    adjustable_quantity : {
                        enabled : true,
                        minimum : 1
                    },
                    quantity : item.quantity
                }
            }),
            success_url: '${process.env.FRONTEND_URL}/success',
            cancel_url: '${process.env.FRONTEND_URL}/cancel',
        }

        const session = await stripe.checkout.sessions.create(params)

        response.status(303).json(session)

    } catch (error) {
        response.json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

module.exports = paymentController