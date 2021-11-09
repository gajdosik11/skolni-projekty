"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const sgMail = require("@sendgrid/mail");
const firebase = require("firebase");
const admin = require("firebase-admin");
const environment_1 = require("../../src/environments/environment");
const client_token_1 = require("../../dm/client-token");
const cors = require('cors')({ origin: true });
firebase.initializeApp(environment_1.environment.firebase);
const db = firebase.firestore();
/*
if (!environment.production) {
    db.settings({
        host: 'localhost:8080',
        ssl: false
    });
}*/
admin.initializeApp();
sgMail.setApiKey(environment_1.environment.sendGridApiKey);
const braintree = require('braintree');
const gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: '6n4m4x54hjznbqw4',
    publicKey: 'bf57376wq787nj2v',
    privateKey: '0f92e9abae5e6bac512bb98f6dee369e'
});
const generateQrCodeAndSendEmail = (user, ticketId, callback) => {
    const QRCode = require('qrcode');
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();
    const regex = /d="(.*?)"/g;
    QRCode.toString(ticketId, { type: 'svg' }, function (err, string) {
        if (err) {
            throw err;
        }
        const split = string.split(regex);
        doc.fillColor('white')
            .path(split[1])
            .fill('non-zero')
            .scale(10);
        doc.path(split[3])
            .stroke('black')
            .scale(10);
    });
    //doc finished
    doc.end();
    //sending email with doc as attachment
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    return doc.on('end', () => {
        const attachment = Buffer.concat(buffers).toString('base64');
        const msg = {
            to: user.email,
            from: 'vstupenkovac@gmail.com',
            subject: 'Vítejte!',
            templateId: environment_1.environment.sendGridEmailWithTicketTemplateId,
            attachments: [
                {
                    filename: 'file.pdf',
                    content: attachment,
                    type: 'application/pdf',
                    disposition: 'attachment',
                    contentId: 'myId'
                }
            ],
            substitutionsWrappers: ['{{', '}}'],
            substitutions: {
                name: user.displayName
            }
        };
        return sgMail.send(msg).then(() => callback());
    });
};
exports.getClientToken = functions.https.onRequest((request, response) => {
    gateway.clientToken.generate({}, (err, res) => {
        const cToken = new client_token_1.ClientToken(res.clientToken);
        return cors(request, response, () => {
            response.status(200).send(cToken);
        });
    });
});
exports.createPurchase = functions.https.onRequest((request, response) => {
    const nonce = request.body.nonce;
    const chargeAmount = request.body.chargeAmount;
    const ticketId = request.body.ticketId;
    const user = request.body.user;
    gateway.transaction.sale({
        amount: chargeAmount,
        paymentMethodNonce: nonce,
        options: {
            submitForSettlement: true
        }
    }, (err, result) => {
        return cors(request, response, () => {
            if (result.success) {
                db.collection('tickets').doc(ticketId).update({ paid: true });
                generateQrCodeAndSendEmail(user, ticketId, () => response.status(200).send(result));
            }
            else {
                response.status(502).send(result);
            }
        });
    });
});
exports.markWaveAsSoldOut = functions.firestore
    .document('tickets/{ticketId}')
    .onUpdate((change, context) => {
    const waveId = change.after.data().waveId;
    console.log('yeah');
    return db.collection('tickets')
        .where('waveId', '==', waveId)
        .where('available', '==', 'true').get().then((tickets => {
        return db.doc('waves/' + waveId).update({ soldOut: tickets.empty });
    }));
});
//# sourceMappingURL=index.js.map