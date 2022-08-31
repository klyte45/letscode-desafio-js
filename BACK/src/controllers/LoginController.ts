import LoginRequest from '#interfaces/controllers/LoginRequest';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { env } from "process";
import { ContextResponse, Errors, Path, POST } from "typescript-rest";

@Path("/login")
export default class LoginController {
    @POST
    doLogin(loginRequest: LoginRequest, @ContextResponse res: Response) {
        if (loginRequest.login === env.DEFAULT_LOGIN && loginRequest.senha === env.DEFAULT_PASSWORD) {
            const token = jwt.sign({ user: env.DEFAULT_LOGIN, roles: "LOGGED" }, env.TOKEN_SECRET, { expiresIn: '1h' });
            res.contentType("text/plain");
            return token;
        }
        throw new Errors.UnauthorizedError();
    }
}