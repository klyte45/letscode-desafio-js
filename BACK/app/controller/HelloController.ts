import { Path, GET, PathParam } from "typescript-rest";

@Path("/hello")
export class HelloController {
    @Path(":name")
    @GET
    sayHello( @PathParam('name') name: string): string {
        return "Hhdajkhdaelloddd " + name;
    }
}