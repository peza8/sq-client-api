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
        console.log(`CLIENT API: Creating new event with UID ${newEvent.uid} for date ${newEvent.date}`);

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

    getEvent: async (payload) => {
        const uid = payload.uid;
        const timestamp = payload.timestamp;
        console.log(`CLIENT API: Fetching event with UID ${uid}`);

        const itemIdentifiers = {
            TableName: Constants.TABLE_EVENTS,
            Key: { 
                uid: uid,
                timestamp: timestamp  
            }
        };

        let event = await DynamoDBApi.getItem(itemIdentifiers);
        return event;
    },

    getEventsInRange: async (payload) => {
        const startTS = payload.startTimestamp;       
        const endTS = payload.endTimestamp;           
        const startDate = new Date(startTS);
        const endDate = new Date(endTS);

        console.log(`CLIENT API: Searching for events in range ${startDate.toString()} - ${endDate.toString()}`);
        let events = await DynamoDBApi.scanForRange(Constants.TABLE_EVENTS, startTS, endTS);
        console.log(`CLIENT API: Found ${events.length} events`);

        if (events.length > 0) {
            return events;
        } else {
            return {};
        }
    }
}