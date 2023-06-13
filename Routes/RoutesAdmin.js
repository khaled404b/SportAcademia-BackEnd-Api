const express = require('express');
const router = express.Router();
const InvoiceAdmin = require("../Model/InvoiceAdmin");
module.exports = () => {

    router.get('/paymentstoadmin', async (req, res) => {
        try {
            const payments = await InvoiceAdmin.find({}, 'payments.invoice payments.fullName payments.age payments.number payments.playerId payments.email payments.amount payments.period payments.createdDate payments.expireDate payments.academiaName payments.academiaPhoneNumber payments.selectedSport payments.userId');
            res.json(payments);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });
    
    router.get('/paymentsForEventstoadmin', async (req, res) => {
        try {
            const paymentsForEvents = await InvoiceAdmin.find({}, 'paymentsForEvents.invoice paymentsForEvents.academia paymentsForEvents.teamCount paymentsForEvents.finalprice paymentsForEvents.location paymentsForEvents.date');
            res.json(paymentsForEvents);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });
    
    
    router.get('/academianames', async (req, res) => {
        try {
            const academiaNames = await InvoiceAdmin.distinct('academiaName');
            res.json(academiaNames);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

return router;
};

