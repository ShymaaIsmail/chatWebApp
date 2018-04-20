
import user from "../models/userModel";
import userService from "../services/userService.js";


/*user Controller is responsible for handling incoming requestes related to user like get,post,put,delete  */

class userController{    
constructor() {
    
}
    /**
     * Search for users by keyword
     * @param {*} req 
     * @param {*} res 
     */
     search_users(req, res) {
    
        userService.getUsersByKeyWord(req.params.keyword).then(users => {
            res.json(users);
        }).catch(err => {
        });
    }
    
    /**
     * Register user
     * @param {*} req 
     * @param {*} res 
     */
         create_a_user(req, res) {
        const new_user = new user(req.body);
    
        userService.createUser(new_user).then(user => {
            res.json(user);
    
        }).catch(err => {
        });
    
    }
    /**login user
     * 
     * @param {*} req 
     * @param {*} res 
     */
     login_a_user(req, res) {
        const user_to_login = new user(req.body);
        userService.loginUser(user_to_login).then(loggedUser => {
            res.json(loggedUser);
        }).catch(err => {
        });
    
    }
    
    /**
     * Retrieve use by id
     * @param {*} req 
     * @param {*} res 
     */
     read_a_user(req, res) {
        userService.getUser(req.params.userId).then(user => {
            res.json(user);
        }).catch(err => {
        });
    
    }

  

}
export default new userController();

