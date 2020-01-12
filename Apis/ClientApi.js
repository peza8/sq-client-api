/**
 * Function entry point
 * Lambda function to implement a client API
 * 
 * Collaborator(s): Josh Perry <josh.perry245@gmail.com>
 * Created: 04/18/2019
 */

const Constants = require('../Config/Constants');
const DynamoDBApi = require('./DynamoDBApi');
const SQEvent = require('../Models/SQEvent');

module.exports = {  
    logEvent: async (eventData) => {
        const newEvent = new SQEvent(eventData.date, 
                                     eventData.sphere, 
                                     eventData.metric, 
                                     eventData.data_01, 
                                     eventData.data_02);
        console.log(`USER API: Creating new event with UID ${newEvent.uid} for date ${newEvent.date}`);

        let result = await DynamoDBApi.createItem(Constants.TABLE_EVENTS, newEvent.getEventJSON());
        if (result === true) { 
            return { 
                statusCode: 200,
                body: JSON.stringify({
                    message: "Successfully created new event",
                    eventUID: newEvent.uid 
                })
            } 
        }
        else { return result };
    },

    getEvent: async (eventUID) => {

    }
}