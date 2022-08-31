import * as express from "express";
import { Server } from "typescript-rest";
import { HelloService } from './app/controller/Hello';

let app = express();
Server.buildServices(app, HelloService);

let port = 4873;

app.listen(port, function () {
  console.log('Rest Server listening on port ' + port + '!');
});