'use strict';
import botRoutes from '../routes/azureBotRoutes';
import chatRoutes from '../routes/chatRoutes';
import messageRoutes from '../routes/messageRoutes';
import userRoutes from '../routes/userRoutes';


export default class routeConfig {

  constructor(app) {
    this.app = app;
    this.registerAllRoute();
  }
  registerAllRoute() {

    //users  routes
    new userRoutes(this.app);

    //chat routes
    new chatRoutes(this.app);

    // messages Routes
    new messageRoutes(this.app);

    //bot routes
    new botRoutes(this.app);
  }
}