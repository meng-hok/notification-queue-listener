import apn  from 'apn';
import {debugDisplay} from "../lib/util";


export const  apnsQueueExecute = async (rawData) => {
    let { appId, p8file, teamId , fileKey, bundleId , bulkId, token , title, message , badgeCount , image ,actionType } = rawData
    let options = {
        token: {
            key: p8file,
            keyId: fileKey,
            teamId: teamId
        },
        production: true
    };

    let apnProvider = new apn.Provider(options);
    let note = new apn.Notification();
    note.priority = 1
    note.badge = badgeCount;
    note.sound = "ping.aiff";
    note.alert = {
        title : title,
        body : message
    };
    note.payload = {
        "data": actionType
    };
    note.topic = bundleId;
    note.contentAvailable = true

    debugDisplay(`APNS REQUEST`,note)
    return apnProvider.send(note, token)

}

