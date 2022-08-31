import { Path, GET, PathParam } from "typescript-rest";

@Path("/hello")
export class HelloService {
    @Path(":name")
    @GET
    sayHello( @PathParam('name') name: string): string {
        return "Hhdajkhdaelloddd " + name;
    }
}