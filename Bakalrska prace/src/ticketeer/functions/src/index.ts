/* xgajdo24
* funkce kterou budou hostovány na serveru
*/
import * as functions from 'firebase-functions';
import * as sgMail from '@sendgrid/mail';
// tslint:disable-next-line:no-duplicate-imports
import * as firebase from 'firebase';
import * as admin from 'firebase-admin';

import { environment } from '../../src/environments/environment';
import { Ticket } from '../../dm/ticket';
import { ClientToken } from '../../dm/client-token';
import { TicketEvent } from '../../dm/ticket-event';


/*inicializace a nčtení dat pro databázi platební bránu emailovou službu atd*/
const cors = require('cors')({ origin: true });
firebase.initializeApp(environment.firebase);
const db = firebase.firestore();
const ticketResolution = [2362, 709];

/*
if (!environment.production) {
    db.settings({
        host: 'localhost:8080',
        ssl: false
    });
}*/

admin.initializeApp();

sgMail.setApiKey(environment.sendGridApiKey);

const braintree = require('braintree');
const gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: '6n4m4x54hjznbqw4',
    publicKey: 'bf57376wq787nj2v',
    privateKey: '0f92e9abae5e6bac512bb98f6dee369e'
});
/*funkce vezne kod vstupenky udelá z ní qrcode a dá ji do pdf*/
const sendQRcode = (pdfDoc, ticketId: string, imgUrl: string) => {
    const QRCode = require('qrcode');

    const fetch = require('node-fetch');

    fetch(imgUrl).then(response => {
        response.buffer().then(img => {
            pdfDoc.image(img, {
                fit: ticketResolution,
                align: 'center',
                valign: 'center'
            });

            const regex = /d="(.*?)"/g;
            QRCode.toString(ticketId, { type: 'svg' }, (err, string) => {
                if (err) {
                    throw err;
                }

                const split = string.split(regex);

                pdfDoc
                    .scale(25)
                    .translate(63, -4)
                    .path(split[3])
                    .stroke('black');
            });
            pdfDoc.end();
        });
    });
};
/*funkce vytvoří pdf a odešle pdf mailem*/
const generateTicketAndSendEmail = (user: any, ticketId: number, ticketEvent: TicketEvent, callback: Function): void => {
    const PDFDocument = require('pdfkit');
    const pdfDoc = new PDFDocument({
        size: ticketResolution,
        margins: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        }
    });

    sendQRcode(pdfDoc, ticketId.toString(), ticketEvent.imgUrl);

    //sending email with doc as attachment
    const buffers = [];
    pdfDoc.on('data', buffers.push.bind(buffers));

    return pdfDoc.on('end', () => {
        const attachment = Buffer.concat(buffers).toString('base64');

        const msg = {
            to: user.email,
            from: 'vstupenkovac@gmail.com',
            subject: 'Vítejte!',
            templateId: environment.sendGridEmailWithTicketTemplateId,
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
/* získání tokunu pro transakci od platební brány braintree*/
export const getClientToken = functions.https.onRequest((request, response) => {
    gateway.clientToken.generate({}, (err, res) => {
        const cToken = new ClientToken(res.clientToken);
        return cors(request, response, () => {
            response.status(200).send(cToken);
        });
    });
});
/*odeslání dat od uživatele na platební bránu a zpracování odpovědi*/
export const createPurchase = functions.https.onRequest((request, response) => {
    const nonce = request.body.nonce;
    const chargeAmount = request.body.chargeAmount;
    const ticketId = request.body.ticketId;
    const user = request.body.user;
    const eventId = request.body.eventId;

    gateway.transaction.sale(
        {
            amount: chargeAmount,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true
            }
        },
        (err, result) => {
            return cors(request, response, () => {
                if (result.success) {
                    const docRef = db.collection('events').doc(eventId);

                    return docRef
                        .get()
                        .then(doc => {
                            if (doc.exists) {
                                const ticketEvent: TicketEvent = doc.data() as TicketEvent;
                                generateTicketAndSendEmail(user, ticketId, ticketEvent, () => {
                                    return db
                                        .collection('tickets')
                                        .doc(ticketId)
                                        .update({ paid: true })
                                        .then(() => {
                                            return response.status(200).send(result);
                                        })
                                        .catch(error => {
                                            console.log('Error updating ticket to paid:', error);
                                        });
                                });
                            } else {
                                console.log('No such document!');
                            }
                        })
                        .catch(error => {
                            console.log('Error getting document:', error);
                        });
                } else {
                    return response.status(502).send(result);
                }
            });
        }
    );
});
/*trigger, který sleduje jestli není vlna vyprodaná, pokud jo označí ji jako vyprodanou*/
export const markWaveAsSoldOut = functions.firestore.document('tickets/{ticketId}').onUpdate((change, context) => {
    const waveId = (change.after.data() as Ticket).waveId;
    return db
        .collection('tickets')
        .where('waveId', '==', waveId)
        .where('available', '==', true)
        .get()
        .then(tickets => {
            console.log(`Wave ${waveId} has ${tickets.size} available tickets. Wave has been marked as sold out: ${tickets.empty}`);
            return db.doc('waves/' + waveId).update({ soldOut: tickets.empty });
        });
});
