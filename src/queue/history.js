import {pool} from "../db";
import {debugDisplay, getEmptyStringIfNull} from "../lib/util";


export const saveHistory = async ({
                                      message,recieverId,title,appId,toPlatform,responseMsg,count,bulkId,badgeCount,image,status
                                  }) => {

    let query =
        `INSERT INTO ps_history 
         (message, reciever_id, title, app_id, status, to_platform, response_msg,count,bulk_id, badge_count , image) VALUES  
         ('${message}','${recieverId}','${title}','${appId}','${status}',${toPlatform},'${responseMsg}',${count},'${bulkId}','${badgeCount}','${image}')`
     debugDisplay(`Error Occur`, query)
     pool.query(query).then(sresult => {
         console.log(`Saved Success`)
     }).catch(err=> {
         debugDisplay(`Err save`,err)
     })



}

export const getCommonHistory = (agentRequest, toPlatform) => {
    let { appId, bulkId, token , title, message , badgeCount , image  } = agentRequest

    return {
        message :message ,
        recieverId : token,
        title: title,
        appId : appId,
        toPlatform: toPlatform ,
        count : 1,
        bulkId : bulkId,
        badgeCount: getEmptyStringIfNull(badgeCount) ,
        image : getEmptyStringIfNull(image),
        status : "true",
        responseMsg : "Success"
    }
}