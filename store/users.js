const aws = require("aws-sdk");
const dynamoDb = new aws.DynamoDB.DocumentClient({});
const USERS_TABLE = process.env.USERS_TABLE;

/**
 * Class to store the users in the database DynamoDB
 */
class UsersStore {

    /**
     * Function to store the users in the database DynamoDB
     * @param {String} name Name of the user
     * @param {String} password Password of the user encrypted, in this function not be encrypted
     * @param {String} userId id of the user
     * @returns 
     */
    async addUser(name, password) {

        const params = {
            TableName: USERS_TABLE,
            Item: {
                name: name,
                password: password,
                userRoles: [],
            },
        };

        await dynamoDb.put(params).promise();
        return { name };

    }

    /**
     * Function to get the users from the database DynamoDB
     */
    async getUsers() {
        const params = {
            TableName: USERS_TABLE,
            ExpressionAttributeNames: {
                '#name': 'name',
                '#userRoles': 'userRoles'
            },
            ProjectionExpression: '#name, #userRoles'
        };
        const response = await dynamoDb.scan(params).promise();
        return response.Items;
    }

    /**
     * Function to get the user from the database DynamoDB
     * @param {String} name Identifier for the user to retrieve
     * @returns Object with the user information
     */
    async getUser(name) {
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
     * Function to add a role to the user in the database DynamoDB
     * @param {String} userId Identifier for the user to retrieve
     * @param {String} roleId Identifier for the role to add
     */
    async addRole(name, roleId) {

        const params = {
            TableName: USERS_TABLE,
            Key: {
                name: name,
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
     * TODO; No funciona correctamente
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
        console.log(response);
        return response.Items;
    };


}


module.exports = UsersStore;