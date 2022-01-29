const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling = require("../functions");
const common = require('../common')
const moment = require('moment');


//const RazorPay_Keys = require("../config/razorpayLive.json");
const RazorPay_Keys = require("../config/razorpayDebug.json");


async function RazorpayCall(OrderData) {
    const Razorpay = require('razorpay');
    const instance = new Razorpay(RazorPay_Keys)
    const options = {
        amount: OrderData.Amount * 100,  // amount in the smallest currency unit
        currency: "INR",
        payment_capture: '1',
    };
    return new Promise(async (resolve, reject) => {
        instance.orders.create(options,async (err, order) => {
            if (err !== null) {
                reject(err);
            }
            else {
                OrderData.ID = order.id;
await dataHandling.Create("Orders",{...OrderData},order.id)
                resolve({
                    "key": RazorPay_Keys.key_id, // Enter the Key ID generated from the Dashboard
                    "name": "LoyaltyPoints",
                    "description": "",
                    "image": "https://paymentscardsandmobile.com/wp-content/uploads/2017/01/Loyalty-Points-1.jpg",
                    "order_id": `${order.id}`,
                    "theme": {
                        "color": "#3399cc"
                    },
                })

            }

        })
    })

}

async function OrderComplete(req, res) {

    const url = require('url');

    let flag = 0;
    const url_parts = url.parse(req.url, true).query;
    const order_id = url_parts.order_id;
    functions.logger.log(url_parts.order_id);

    const OrderData = await dataHandling.Read("Orders",order_id);

    const Razorpay = require('razorpay');
    const instance = new Razorpay(RazorPay_Keys)

    if (req.body.error !== undefined || req.body === {}) {
        console.log("test2")

        functions.logger.log("test1");
        await dataHandling.Update("Orders", { "Status": "error" },order_id);
        flag = 0;
    }
    else if ((req.body.razorpay_order_id !== undefined || req.body.razorpay_payment_id !== undefined)) {
        console.log("test3")

        const payment_id = req.body.razorpay_payment_id;
        const order_id = req.body.razorpay_order_id;
        console.log("test3")

        const order_data = await instance.orders.fetch(order_id)
        console.log("test3")

        Amount_Payable = OrderData.Amount * 100;
        if (order_data.status === "paid" && order_data.amount === order_data.amount_paid && order_data.amount_due === 0 && Amount_Payable === order_data.amount_paid) {
            flag = 1;

            await dataHandling.Update("Orders", { "Status": "Paid", "razorpay_payment_id": payment_id, "Date": moment().format('YYYY-MMMM-DD') },order_id);
        }
        else {
            functions.logger.log("test3");
            await dataHandling.Update("Orders", { "Status": "error" }, order_id);
            flag = 0;
        }
        console.log("test4")

    }
    else {
        await dataHandling.Update("Orders" , { "Status": "error" }, order_id);
        flag = 0;
    }
    console.log("test5")

    if (url_parts.callback_url === "false") {
        flag = 0;
    }
    console.log("test6")

    if (flag === 0) {
        console.log("test7")

      const  order_data = await instance.orders.fetch(order_id)

        Amount_Payable = OrderData.Amount * 100;
        if (order_data.status === "paid" && order_data.amount === order_data.amount_paid && order_data.amount_due === 0 && Amount_Payable === order_data.amount_paid) {
            flag = 1;

            await dataHandling.Update("Orders", { "Status": "Paid", "razorpay_payment_id": "", "Date": moment().format('YYYY-MMMM-DD') }, order_id);
        }

    }

    if (flag === 1) {
        console.log("test8")

        const ClientAdminData = await dataHandling.Read("StoreAdmins" ,OrderData.UserId);
        let ExpiryDays;
        if (ClientAdminData === undefined || ClientAdminData.subscriptionmodel !== OrderData.id) {
            ExpiryDays = 0;
        }
        else {
            if (ClientAdminData.ExpiryDays === undefined) {
                ExpiryDays = 0;
            }
            else {
                ExpiryDays = ClientAdminData.ExpiryDays;
            }
        }
        await dataHandling.Create("StoreAdmins", { "subscriptionmodel": OrderData.id, "Expiry": false, "ExpiryDays": ExpiryDays + 360 },OrderData.UserId)
        return res.json(true);
    }
    else {
        return res.json(false);
    }


}

module.exports={
    OrderComplete,
    RazorpayCall
}