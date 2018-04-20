import userList from '../controllers/userController';

export default class userRoutes {

  constructor(app) {

    app.route('/users')
      .post(userList.create_a_user);

    app.route('/users/:userId')
      .get(userList.read_a_user);

    app.route('/users/login')
      .post(userList.login_a_user);

    app.route('/users/search/:keyword')
      .get(userList.search_users);

  }
}