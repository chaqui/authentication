const bcrypt = require("bcrypt");
const aws = require("aws-sdk");


const dynamoDb = new aws.DynamoDB.DocumentClient({});
const USERS_TABLE = process.env.USERS_TABLE;
class LoginServices {

    constructor(storageUser) {
        this.storageUser = storageUser;
    }

    //TODO: No funciona correctamente
    async login(name, password,res) {

        try {
            const user = await this.storageUser.getByName(name);
            if (user) {
                return user;
                //const passwordMatch = await bcrypt.compare(password, user.password);
                //if (passwordMatch) {
                //    return user;
                //}
            }
            else{
                res.status(401).json({ error: "Unauthorized" });
            }
        } catch (error) {
            console.log(error);

        }
        return null;
    }
}
module.exports = LoginServices;