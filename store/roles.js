const aws = require("aws-sdk");
const dynamoDb = new aws.DynamoDB.DocumentClient({});
const ROLES_TABLE = process.env.ROLES_TABLE;

/**
 * Class to store the roles in the database DynamoDB
 */
class RolesStore {
    
    /**
     * 
     * @param {String} roleId Identifier for the role encrypted, in this function not be encrypted
     * @param {String} name Name of the role
     * @param {String} description Description of the role
     */
    async addRole({roleId, name, description}) {
        const params = {
            TableName: ROLES_TABLE,
            Item: {
                roleId: roleId,
                name: name,
                description: description,
            },
        };
        await dynamoDb.put(params).promise();
        return { roleId, name };
    }

    /**
     * Function to get the roles from the database DynamoDB
     */
    async getRoles() {
        const params = {
            TableName: ROLES_TABLE,
            ExpressionAttributeNames: {
                '#roleId': 'roleId',
                '#name': 'name',
                '#description': 'description'
            },
            ProjectionExpression: '#roleId, #name, #description'
        };
        const response = await dynamoDb.scan(params).promise();
        return response.Items;
    }

    /**
     * 
     * Function to get the role from the database DynamoDB
     * @param {String} roleId Identifier for the role to retrieve
     * @returns Object with the role information
     */
    async getRole(roleId) {
        const params = {
            TableName: ROLES_TABLE,
            Key: {
                roleId: roleId,
            },
        };
        const response = await dynamoDb.get(params).promise();
        return response.Item;
    }
}

module.exports = RolesStore;