const aws = require("aws-sdk");
const bcrypt = require("bcrypt");
const crypto = require('crypto');

const dynamoDb = new aws.DynamoDB.DocumentClient({});
const USERS_TABLE = process.env.USERS_TABLE;


class UserServices {

    async postUsers(req, res) {
        const { name, password } = req.body;


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

    async getUsers(res) {
        const params = {
            TableName: USERS_TABLE,
            ExpressionAttributeNames:{
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

    async getUser(req, res) {
        const params = {
            TableName: USERS_TABLE,
            Key: {
                userId: req.params.userId,
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
    
    async addRoles(req, res) {
        const { userId } = req.params;
        const { roleId } = req.body;

        const params = {
            TableName: USERS_TABLE,
            Key: {
                userId: userId,
            },
            UpdateExpression: "SET userRoles = list_append(userRoles, :roleId)",
            ExpressionAttributeValues: {
                ":roleId": [roleId],
            },
            ReturnValues: "ALL_NEW",
        };

        try {
            const response = await dynamoDb.update(params).promise();
            res.json(response.Attributes);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Could not add role" });
        }
    }
}

module.exports = UserServices;