const eticketModels = require('../models/eticket.js');
const midtransClient = require('midtrans-client');
const purchasedModels = require('../models/purchased.js');

var FCM = require('fcm-node');
    var serverKey = 'AAAAhbrShNE:APA91bEkqEuL8jdvJ9NYfyiq6HJ_lZjf4Nue294f5v43f7JpEi7zYJsiR7a_s9rU9zi3I70H-cFZ15q-g4RzSRSr9R6sFjpBpnrsrl475owtdFkhhQEtbAgL4RrLjXlOvC6S7vUZFJZ6'; //put your server key here
    var fcm = new FCM(serverKey);

// Create Core API instance
const coreApi = new midtransClient.CoreApi({
    isProduction : false,
    serverKey : 'SB-Mid-server-qZ7YQftleKExaQ_O2cMBb5kR',
    clientKey : 'SB-Mid-client-SNUTQw3_NYOZkQlR'
});

const getDataPenumpang = async (req, res) => {
    try {
        const {username, id_pemesanan} = req.params;
        const [data] = await eticketModels.getDataPenumpang(username, id_pemesanan);
        res.status(200).json({
            data : data
        });
    } catch (error) {
        res.status(500).json({
            msg : 'SERVER ERROR',
            serverMsg : error,
        })
    }
}

const getETicket = async (req, res) => {
    try {
        const {username, jenis_transportasi} = req.params;
        const [data] = await eticketModels.getETicket(username, jenis_transportasi);
        res.status(200).json({
            data : data
        });
    } catch (error) {
        res.status(500).json({
            msg : 'SERVER ERROR',
            serverMsg : error,
        })
    }
}

const updatePurchasedStatus = async (req, res) => {
    try {
        coreApi.transaction.notification(req.body)
        .then(async (statusResponse)=>{
            let id_pemesanan = statusResponse.order_id;
            let respon_midtrans = JSON.stringify(statusResponse);
            let transactionStatus = statusResponse.transaction_status;

            console.log(transactionStatus); 
            console.log(respon_midtrans); 

            if (transactionStatus == 'settlement'){
                await eticketModels.updatePurchasedStatus(id_pemesanan, respon_midtrans);
                var token = await eticketModels.getToken(id_pemesanan);
                const message = {
                    to: token, // Replace with the recipient's registration token
                    collapse_key: 'your_collapse_key',
                    notification: {
                        title: 'Pembayaran Berhasil',
                        body: 'Terima Kasih Untuk Pembayarannya, ETicket Kamu Sudah Terbit.',
                    },
                };

                fcm.send(message, function(err, response){
                    if (err) {
                        res.status(500).json({
                            message : err,
                            token : token
                        })
                    } else {
                        res.status(200).json({
                            message : response,
                            token : token
                        })
                    }
                });

                res.status(200).json({
                    message: "Berhasil",
                });

            } else if (transactionStatus == 'cancel' || transactionStatus == 'expire'){
                await eticketModels.updatePurchasedStatus(id_pemesanan, respon_midtrans);
                var token = await eticketModels.getToken(id_pemesanan);
                const message = {
                    to: token, // Replace with the recipient's registration token
                    collapse_key: 'your_collapse_key',
                    notification: {
                        title: 'Pembayaran Gagal',
                        body: 'Batas Waktu Pembayaran Anda Telah Habis',
                    },
                };

                fcm.send(message, function(err, response){
                    if (err) {
                        res.status(500).json({
                            message : err,
                            token : token
                        })
                    } else {
                        res.status(200).json({
                            message : response,
                            token : token
                        })
                    }
                });

                res.status(200).json({
                    message: "Berhasil",
                });

            } else if (transactionStatus == 'pending'){
                // TODO set transaction status on your databaase to 'pending' / waiting payment
                var token = await eticketModels.getToken(id_pemesanan);
                const message = {
                    to: token, // Replace with the recipient's registration token
                    collapse_key: 'your_collapse_key',
                    notification: {
                        title: 'Menunggu Pembayaran',
                        body: 'Segera Selesaikan Pembayaran Kamu Sebelum Batas Waktu',
                    },
                };

                fcm.send(message, function(err, response){
                    if (err) {
                        res.status(500).json({
                            message : err,
                            token : token
                        })
                    } else {
                        res.status(200).json({
                            message : response,
                            token : token
                        })
                    }
                });

                res.status(200).json({
                    message: "Berhasil",
                });
            }

        });
    } catch (error) {
        res.status(500).json({
            msg : res.body,
            serverMsg : error
        });
    }
}

module.exports = {
    getDataPenumpang,
    getETicket,
    updatePurchasedStatus
}