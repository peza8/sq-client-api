/**
 * Function entry point
 * Lambda function to implement a client API
 * 
 * Collaborator(s): Josh Perry <josh.perry245@gmail.com>
 * Created: 01/11/2020
 */

const packageInfo = require('./package.json');
let bugsnag = require('@bugsnag/js');
let bugsnagClient = bugsnag({
    apiKey: process.env.BUGSNAG_API_KEY,
    appVersion: packageInfo.version
});

const Constants = require('./Config/Constants');
const ClientApi = require('./Apis/ClientApi');

exports.handler = async (event) => {
    try {
        res = await routeRequest(event);
        return res;
    } 
    catch(error) {
        await reportErrorBugsnag(error);
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message,
                stack: error.stack
            })
        }
    }
};

const routeRequest = async (request) => {
    const path = request.path;
    const payload = request.body ? JSON.parse(request.body) : request;

    if (path === Constants.ENDPOINT_LOG_EVENT) {
        let result = await ClientApi.logEvent(payload);
        return result;
    }

    else if (path === Constants.ENDPOINT_GET_EVENT_SINGLE) {
        let result = await ClientApi.getEvent(payload);
        return result;
    }

    else if (path === Constants.ENDPOINT_GET_EVENT_RANGE) {
        let result = await ClientApi.getEventsInRange(payload);
        return result;
    }

    else {
        throw new Error(`INDEX: Unknown path for request => ${path}`);
    }
}


const reportErrorBugsnag = (error) => {
    return new Promise(resolve => {
        console.log("INDEX: Logging error in Bugsnag");
        bugsnagClient.notify(error);
        
        // Bugsnag - takes a while to report (ensure program doesn't terminate)
        setTimeout(() => {
            resolve(true);
        }, 2500);
    });    
}