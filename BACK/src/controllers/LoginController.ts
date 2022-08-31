import LoginRequest from '#interfaces/controllers/LoginRequest';
import * as jwt from 'jsonwebtoken';
import { env } from "process";
import { Errors, Path, POST } from "typescript-rest";

@Path("/login")
export class LoginController {
    @POST
    doLogin(loginRequest: LoginRequest) {
        if (loginRequest.login === env.DEFAULT_LOGIN && loginRequest.senha === env.DEFAULT_PASSWORD) {
            const token = jwt.sign({ user: env.DEFAULT_LOGIN, roles: "LOGGED" }, env.TOKEN_SECRET, { expiresIn: '1h' });
            return token;
        }
        throw new Errors.UnauthorizedError();
    }
}