const aws = require("aws-sdk");
const dynamoDb = new aws.DynamoDB.DocumentClient({});
const USERS_TABLE = process.env.USERS_TABLE;

/**
 * Class to store the users in the database DynamoDB
 */
class UsersStore {

    /**
     * Function to store the users in the database DynamoDB
     * @param {String} userId id of the user
     * @param {String} name Name of the user
     * @param {String} password Password of the user encrypted, in this function not be encrypted
     * @returns 
     */
    async addUser({userId, name, password}) {
        const params = {
            TableName: USERS_TABLE,
            Item: {
                userId: userId,
                name: name,
                password: password,
                userRoles: [],
                tokens: []
            },
        };

        await dynamoDb.put(params).promise();
        return { name, userId };
    }

    /**
     * Function to get the users from the database DynamoDB
     */
    async getUsers() {
        const params = {
            TableName: USERS_TABLE,
            ExpressionAttributeNames: {
                '#userId': 'userId',
                '#name': 'name',
                '#userRoles': 'userRoles'
            },
            ProjectionExpression: '#userId, #name, #userRoles'
        };
        const response = await dynamoDb.scan(params).promise();
        return response.Items;
    }

    /**
     * Function to get the user from the database DynamoDB
     * @param {String} name Identifier for the user to retrieve
     * @returns Object with the user information
     */
    async getUserByName(name) {
        const params = {
            TableName: USERS_TABLE,
            Key: {
                name: name,
            },
        };
        const { Item } = await dynamoDb.get(params).promise();
        return Item;

    }

    /**
     * Function to get the user from the database DynamoDB
     * @param {String} userId Identifier for the user to retrieve
     * @returns Object with the user information
     */
    async getUserById(userId) {
        const params = {
            TableName: USERS_TABLE,
            Key: {
                userId: userId,
            },
        };
        const { Item } = await dynamoDb.get(params).promise();
        return Item;

    }

    /**
     * Function to add a role to the user in the database DynamoDB
     * @param {String} userName Identifier name for the user to retrieve
     * @param {String} roleId Identifier for the role to add
     */
    async addRole(userName, roleId) {

        const params = {
            TableName: USERS_TABLE,
            Key: {
                name: userName,
            },
            UpdateExpression: "SET #userRoles = list_append(#userRoles, :roleId)",
            ExpressionAttributeValues: {
                ":roleId": [roleId],
            },
            ExpressionAttributeNames: {
                "#userRoles": "userRoles"
            }
        };
        await dynamoDb.update(params).promise();
    }

    /**
     * TODO: No funciona correctamente
     * Function to get the user for name from the database DynamoDB
     * @param {String} name Name of the user
     * @returns 
     */
    async getByName(name) {
        const params = {
            TableName: USERS_TABLE,
            FilterExpression: "#name = :name",
            ExpressionAttributeValues: {
                ":name": name,
            },
            ExpressionAttributeNames: {
                "#name": "name"
            }
        };
        const response = await dynamoDb.scan(params).promise();
        return response.Items;
    };

    /**
     * Save auth token for an user
     * @param {String} name Identifier for the user to retrieve
     * @param {String} token Token to be added
     */
    async saveToken(name, token) {
        const params = {
            TableName: USERS_TABLE,
            Key: {
                name,
            },
            UpdateExpression: "SET #tokens = list_append(#tokens, :token)",
            ExpressionAttributeValues: {
                ":token": [token],
            },
            ExpressionAttributeNames: {
                "#tokens": "tokens"
            }
        };
        await dynamoDb.update(params).promise();
    }

    /**
     * Remove auth token for an user
     * @param {String} name Identifier for the user to retrieve
     * @param {String} token Token to be removed
     */
    async removeToken(name, index) {
        await dynamoDb.update({
            TableName: USERS_TABLE,
            Key: {
                name,
            },
            UpdateExpression: `REMOVE tokens[${index}]`
        }).promise();
    }
}


module.exports = UsersStore;