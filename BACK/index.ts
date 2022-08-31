import { LoginController } from '#controllers/LoginController';
import * as cors from 'cors';
import * as express from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { env } from "process";
import { PassportAuthenticator, Server } from "typescript-rest";
import { v4 as uuid } from 'uuid';
import { config } from 'dotenv'


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

//Setup server
let app = express();
app.use(cors());
app.use(function (_, res, next) {
  res.header("Content-Type", 'application/json');
  next();
});

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

//Start server
let port = 5000;
app.listen(port, function () {
  console.log('Rest Server listening on port ' + port + '!');
});