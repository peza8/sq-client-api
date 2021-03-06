/**
 * Promise wrapper for DynamDB to allow async await usage
 * 
 * Collaborator(s): Josh Perry <josh.perry245@gmail.com>
 * Created: 05/29/2019
 */

const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.SQ_REGION });
let docClient = new AWS.DynamoDB.DocumentClient();

class DynamoDBInterface {}

DynamoDBInterface.createItem = (tableName, itemData) => {
    return new Promise((resolve, reject) => {
        const itemToCreate = {
            TableName: tableName,
            Item: itemData
        }

        docClient.put(itemToCreate, (error, data) => {
            if (error) {
                return reject(error);
            }
    
            console.log(`DYNAMODB: Created new item`);
            return resolve(true);
        });
    });
};
    
DynamoDBInterface.updateDocument = (updateData) => {
    return new Promise((resolve, reject) => {   
        docClient.update(updateData, (error, data) => {
            if (error) {
                return reject(error);
            }

            console.log(`DYNAMODB: Updated sensor document item`);
            return resolve(true);
        });
    });
};
    
DynamoDBInterface.getItem = (identifiers) => {
    return new Promise((resolve, reject) => {
        docClient.get(identifiers, (error, data) => {
            if (error) {
                return reject(error);
            } else if (!data.Item) {
                return reject(new Error(`Couldn't find item for identifier => ${identifiers.key}`));
            }

            return resolve(data.Item);
        });
    });
};

DynamoDBInterface.itemExists = (identifiers) => {
    return new Promise((resolve, reject) => {
        docClient.get(identifiers, (error, data) => {
            if (error) {
                return reject(error);
            } else if (!data.Item) {
                return resolve(false);
            } else {
                return resolve(true);
            }
        });
    });
}

DynamoDBInterface.query = (identifiers) => {
    return new Promise((resolve, reject) => {
        docClient.query(identifiers, (error, data) => {
            if (error) {
                return reject(error);
            }
            return resolve(data.Items);
        });
    });
};

DynamoDBInterface.scan = (identifiers) => {
    return new Promise((resolve, reject) => {
        docClient.scan(identifiers, (error, data) => {
            if (error) {
                return reject(error);
            }
            return resolve(data.Items);
        });
    });
}

DynamoDBInterface.searchForItem = async (tableName, index, searchKey, searchValue) => {
    const searchParams = {
        TableName: tableName,
        IndexName: index,
        KeyConditionExpression: `${searchKey} = :value`,
        ExpressionAttributeValues: {
            ":value": searchValue
        }
        // May need ProjectionExpression {userUID}
    };

    let items = await DynamoDBInterface.query(searchParams);
    return items;
};

DynamoDBInterface.scanForRange = async (tableName, searchLow, searchHigh) => {
    const searchParams = {
        TableName: tableName,
        // IndexName: index, 
        FilterExpression: `#ts BETWEEN :value_low and :value_high`,
        ExpressionAttributeValues: {
            ":value_low": searchLow,
            ":value_high": searchHigh
        },
        ExpressionAttributeNames: { "#ts": "timestamp" },
        // May need ProjectionExpression {}
    };

    let events = await DynamoDBInterface.scan(searchParams);
    return events;
};

module.exports = DynamoDBInterface;