const bcrypt = require("bcrypt");


class UserServices {

    constructor(storage) {
        this.storage = storage;
    }

    /**
     * Function for create a new user
     * @param body Request body for the POST /users endpoint
     * @param res Response object for the POST /users endpoint
     *
     */
    async postUsers(body, res) {
        let { password } = body;	
        const { name } = body;

        try {
            password = await bcrypt.hash(password, 10);
            const userAdd = await this.storage.addUser(name, password);
            res.json(userAdd);
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

        try {

            const users = await this.storage.getUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: "Could not return users", message: error.message });
        }
    }

    /**
     * Function to return user by name
     * @param {String} name  User's name to return
     * @param {Response} res  response object for the GET /users/:name endpoint
     */
    async getUser(name, res) {

        try {

            const user = await this.storage.getUser(name);
            if (user) {
                const {name, userRoles } = user;
                res.json({  name, userRoles });
            } else {
                res.status(404)
                    .json({ error: 'Could not find user with provided "name"' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Could not return user" });
        }
    }

    /**
     * Function to add roles to a user
     * @param {String} name  User's name to add role
     * @param {String} roleId  roleId to add role
     * @param {Response} res  Response object for the POST /users/:name/roles endpoint
     */
    async addRoles(name, roleId, res) {

        if(!this.validateUser(name, roleId, res)){
            return;
        }

        try {
            await this.storage.addRole(name, roleId);
            res.json({ name, roleId });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Could not add role" });
        }
    }

    /**
     * Function to validate user
     * @param {String} name  User's name to validate
     * @param {String} roleId  roleId to validate
     * @param {Response} res  Response object for the POST /users/:name/roles endpoint
     * @returns {Boolean} true if user is valid, false otherwise
     */
    async validateUser(name, roleId, res) {

        const user = await this.storage.getUser(name);
        if (!user) {
            res
                .status(404)
                .json({ error: 'Could not find user with provided "name"' });
            return false;
        }
        if(user.userRoles){
            if(user.userRoles.includes(roleId)){
                res.status(400).json({ error: 'Role already exists for this user' });
                return false;
            }
        }
        return true;

    }
}

module.exports = UserServices;