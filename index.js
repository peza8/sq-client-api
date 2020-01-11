/**
 * Function entry point
 * Lambda function to implement a client API
 * 
 * Collaborator(s): Josh Perry <josh.perry245@gmail.com>
 * Created: 01/11/2020
 */

const Constants = require('./Config/Constants');
const ClientApi = require('./Apis/ClientApi');

exports.handler = async (event) => {
    try {
        res = await routeRequest(event);
        return res;
    } 
    catch(error) {
        // await reportErrorBugsnag(error);
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

    else {
        throw new Error(`INDEX: Unknown path for request => ${path}`);
    }
}