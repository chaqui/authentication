const bcrypt = require("bcrypt");
const aws = require("aws-sdk");


const dynamoDb = new aws.DynamoDB.DocumentClient({});
const USERS_TABLE = process.env.USERS_TABLE;
class LoginServices {
    
    //TODO: No funciona correctamente
    async login(name, password) {
        const params = {
            TableName: USERS_TABLE,
            KeyConditionExpression: "#name = :name",
            ExpressionAttributeValues: {
                ":name": name,
            },
            ExpressionAttributeNames: {
                "#name": "name"
            }
        };

        try {
            const response = await dynamoDb.get(params).promise();
            if (response.Item) {
                const user = response.Item;
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (passwordMatch) {
                    return user;
                }
            }
        } catch (error) {
            console.log(error);
        }
        return null;
    }
}
module.exports = LoginServices;