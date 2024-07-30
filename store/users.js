const crypto = require('crypto');
const aws = require("aws-sdk");
const bcrypt = require("bcrypt");
const dynamoDb = new aws.DynamoDB.DocumentClient({});
const USERS_TABLE = process.env.USERS_TABLE;

class UsersStore {

    async addUser(name, password, userId) {

        const params = {
            TableName: USERS_TABLE,
            Item: {
                userId: userId,
                name: name,
                password: await bcrypt.hash(password, 10),
                userRoles: [],
            },
        };

        await dynamoDb.put(params).promise();
        return { userId, name };

    }

    async getUsers() {
        const params = {
            TableName: USERS_TABLE,
            ExpressionAttributeNames: {
                '#name': 'name',
                '#userId': 'userId',
                '#userRoles': 'userRoles'
            },
            ProjectionExpression: '#name, #userId, #userRoles'
        };
        const response = await dynamoDb.scan(params).promise();
        return response.Items;
    }

    async getUser(userId){
        const params = {
            TableName: USERS_TABLE,
            Key: {
                userId: userId,
            },
        };
        const { Item } = await dynamoDb.get(params).promise();
        return Item;

    }

    async addRole(userId, roleId){
        
        const params = {
            TableName: USERS_TABLE,
            Key: {
                userId: userId,
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
}

module.exports = UsersStore;