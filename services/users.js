const aws = require("aws-sdk");
const bcrypt = require("bcrypt");
const crypto = require('crypto');

const dynamoDb = new aws.DynamoDB.DocumentClient({});
const USERS_TABLE = process.env.USERS_TABLE;


class UserServices {

    /**
     * Function for create a new user
     * @param body Request body for the POST /users endpoint
     * @param res Response object for the POST /users endpoint
     *
     */
    async postUsers(body, res) {
        const { name, password } = body;


        const userId = crypto.randomBytes(20).toString('hex');
        const params = {
            TableName: USERS_TABLE,
            Item: {
                userId: userId,
                name: name,
                password: await bcrypt.hash(password, 10),
                userRoles: [],
            },
        };

        try {
            await dynamoDb.put(params).promise();
            res.json({ userId, name });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Could not create user" });
        }
    }

    /**
     * Function for get users
     * @param res Response object for the GET /users endpoint
     */
    async getUsers(res) {
        const params = {
            TableName: USERS_TABLE,
            ExpressionAttributeNames: {
                '#name': 'name',
                '#userId': 'userId',
                '#userRoles': 'userRoles'
            },
            ProjectionExpression: '#name, #userId, #userRoles'
        };

        try {
            const response = await dynamoDb.scan(params).promise();
            res.json(response.Items);
        } catch (error) {
            console.log(error);
            console.log("users:" + error.message);
            res.status(500).json({ error: "Could not return users", message: error.message });
        }
    }

    /**
     * Function to return user by userId
     * @param {String} userId  userId to return
     * @param {Response} res  response object for the GET /users/:userId endpoint
     */
    async getUser(userId, res) {
        const params = {
            TableName: USERS_TABLE,
            Key: {
                userId: userId,
            },
        };

        try {
            const { Item } = await dynamoDb.get(params).promise();
            if (Item) {
                const { userId, name } = Item;
                res.json({ userId, name });
            } else {
                res
                    .status(404)
                    .json({ error: 'Could not find user with provided "userId"' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Could not return user" });
        }
    }

    /**
     * Function to add roles to a user
     * @param {String} userId  userId to add role
     * @param {String} roleId  roleId to add role
     * @param {Response} res  Response object for the POST /users/:userId/roles endpoint
     */
    async addRoles(userId, roleId, res) {

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

        try {
            const response = await dynamoDb.update(params).promise();
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Could not add role" });
        }
    }
}

module.exports = UserServices;