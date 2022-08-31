import * as express from "express";
import { Server } from "typescript-rest";
import { HelloController } from './app/controller/HelloController';

let app = express();
Server.buildServices(app, HelloController);

let port = 5000;

app.listen(port, function () {
  console.log('Rest Server listening on port ' + port + '!');
});