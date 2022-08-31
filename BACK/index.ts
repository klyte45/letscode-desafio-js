import { CardController } from '#controllers/CardController';
import { LoginController } from '#controllers/LoginController';
import cors from 'cors';
import { config } from 'dotenv';
import express from "express";
import mongoose from 'mongoose';
import { ExtractJwt, Strategy } from "passport-jwt";
import { env } from "process";
import requireDir from 'require-dir';
import { PassportAuthenticator, Server } from "typescript-rest";

//Setup environment
if (env.NODE_ENV == "prod") {
  console.log('====PROD MODE====');
  if (!env.DEFAULT_LOGIN || !env.DEFAULT_PASSWORD || !env.TOKEN_SECRET) {
    throw new Error("DEFAULT_LOGIN, DEFAULT_PASSWORD and TOKEN_SECRET environment variables must be set!");
  }
} else {
  console.log('=====DEV MODE====');
  config();
  env.DEV = "T";
}
//Await for DB Connect
mongoose.connect(env.DB_URL, {}).then(x => {
  //DB Setup
  mongoose.pluralize(null);
  requireDir('src/db/', { recurse: true });
  console.log("DB Connected")

  //Setup server
  let app = express();
  app.use(cors());

  //Register JWT Middleware
  let jwtConfig = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.TOKEN_SECRET
  }
  const strategy = new Strategy(jwtConfig, (payload, done) => {
    const user = {
      roles: payload.roles.split(','),
      username: payload.user
    };
    done(null, user);
  });
  Server.registerAuthenticator(new PassportAuthenticator(strategy, {
    authOptions: {
      session: false,
      failWithError: false
    },
    rolesKey: 'security.roles'
  }));

  //Register controllers
  Server.buildServices(app, LoginController);
  Server.buildServices(app, CardController);

  //Start server
  let port = 5000;
  app.listen(port, function () {
    console.log('Rest Server listening on port ' + port + '!');
  });
});