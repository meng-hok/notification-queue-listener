import FCM from "fcm-push";
import {debugDisplay} from "../lib/util";


export const fcmQueueExecute = async (rawData) => {
    let { appId, authorizedKey, token , title, message , badgeCount, image , bulkId, actionType} = rawData

    let fcm = new FCM(authorizedKey);

    let requestMessage = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: token,
        priority: "high",
        notification: {
            title: title,
            body: message,
            image: image,
        },
        data: actionType
    };
    debugDisplay(`FCM REQUEST`,requestMessage)
    let response =  await fcm.send(requestMessage)

    return response

}