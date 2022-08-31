import { LoginController } from '#controllers/LoginController';
import * as cors from 'cors';
import * as express from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { env } from "process";
import { PassportAuthenticator, Server } from "typescript-rest";
import { v4 as uuid } from 'uuid';

//Setup environment
if (env.NODE_ENV == "prod") {
  console.log('====PROD MODE====');
  if (!env.DEFAULT_LOGIN || env.DEFAULT_PASSWORD) {
    throw new Error("Username and password environment variables must be set!");
  }
  if (!env.TOKEN_SECRET) {
    env.TOKEN_SECRET = uuid()
  }
} else {
  console.log('=====DEV MODE====');
  env.DEV = "T";
  env.DEFAULT_LOGIN = "letscode";
  env.DEFAULT_PASSWORD = "lets@123";
  env.TOKEN_SECRET = "12345678901234567890";
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