const aws = require("aws-sdk");
const bcrypt = require("bcrypt");
const crypto = require('crypto');

const dynamoDb = new aws.DynamoDB.DocumentClient({});
const ROLES_TABLE = process.env.ROLES_TABLE;


class RolesServices {

    async postRoles(req, res) {
        const { name, description } = req.body;

        const roleId = crypto.randomBytes(20).toString('hex');
        const params = {
            TableName: ROLES_TABLE,
            Item: {
                roleId: roleId,
                name: name,
                description: description,
            },
        };

        try {
            await dynamoDb.put(params).promise();
            res.json({ roleId, name });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Could not create role" });
        }

    }

    async getRoles(res) {
        const params = {
            TableName: ROLES_TABLE,
            ExpressionAttributeNames:{
                '#name': 'name',
                '#roleId': 'roleId'
            },
            ProjectionExpression: '#name, #roleId'
        };

        try {
            const response = await dynamoDb.scan(params).promise();
            res.json(response.Items);
        } catch (error) {
            console.log(error);
            console.log("roles:" + error.message);
            res.status(500).json({ error: "Could not return roles", message: error.message });
        }
    }

    async getRole(req, res) {
        const params = {
            TableName: ROLES_TABLE,
            Key: {
                roleId: req.params.roleId,
            },
        };

        try {
            const response = await dynamoDb.get(params).promise();
            res.json(response.Item);
        } catch (error) {
            console.log(error);
            console.log("roles:" + error.message);
            res.status(500).json({ error: "Could not return role", message: error.message });
        }
    }
}

module.exports = RolesServices;