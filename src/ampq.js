// const amqplib = require('amqplib/callback_api');
// import {amqpUrl} from "./config.json"
//
// amqplib.connect(amqpUrl,(err , connection ) =>{
//     if (err) {
//         console.error(err.stack);
//         return process.exit(1);
//     }
// })
import {transientQueue,apnsDevQueue , devQueue,apnsQueue, fcmQueue} from "./config.json"
import {fcmQueueExecute} from "./queue/fcm";
import {apnsQueueExecute} from "./queue/apns";
import {debugDisplay} from "./lib/util";
import {getCommonHistory, saveHistory} from "./queue/history";
import {PLATFORM} from "./lib/enums";
export const queueConnectionOperation = (err , connection) => {

    connection.createChannel((err, channel) => {
        if (err) {
            console.error(err.stack);
            return process.exit(1);
        }

        channel.consume(apnsQueue, data => {
            if (data === null) {
                return;
            }

            let rawData = JSON.parse(data.content.toString())
            console.log(`debug`)
            console.log(rawData)
            let { appId, p8file, teamId , fileKey, bundleId , bulkId, token , title, message , badgeCount , image ,actionType } = rawData
            let savedHistory = getCommonHistory(rawData,PLATFORM.APNS)

            apnsQueueExecute(rawData)
                .then(result => {
                    debugDisplay("APNS RESPONSE",result)

                    if(result.failed.length > 0) {
                        // throw result.failed[0]
                        throw result.failed[0].response.reason
                    }
                    // console.log()
                }).catch(err=> {
                    debugDisplay("APNS ERROR RESPONSE",err)
                    savedHistory.status = "false";
                    savedHistory.responseMsg = err.replace(/'/g, "''") || ""

                }).finally(() => {
                    saveHistory(savedHistory)
                    channel.ack(data);
                })

        })

        channel.consume(fcmQueue, data => {
            console.log(`fcm start`)
            if (data === null) {
                return;
            }
            let rawData = JSON.parse(data.content.toString())
            let { appId, authorizedKey, token , title, message , badgeCount, image , bulkId, actionType} = rawData
            let savedHistory = getCommonHistory(rawData,PLATFORM.FCM)

            fcmQueueExecute(rawData)
                .then(result => {
                    debugDisplay("FCM RESPONSE",result)
                }).catch(err=> {
                    debugDisplay("FCM ERROR RESPONSE",err)
                    savedHistory.status = "false";
                    savedHistory.responseMsg = err.replace(/'/g, "''") || ""

                }).finally(() => {
                    saveHistory(savedHistory)
                    channel.ack(data);
                })

            // channel.ack(data);
        })
    })
}