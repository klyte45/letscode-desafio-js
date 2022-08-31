
import { ICardService } from '#interfaces/services/ICardService';
import { Response } from 'express';
import { Inject } from 'typescript-ioc';
import { ContextResponse, DELETE, GET, Path, PathParam, POST, PUT, Security } from "typescript-rest";

@Path("/cards")
@Security()
export default class CardController {

    @Inject
    private service!: ICardService;

    @POST
    async doCreate(requestBody: any, @ContextResponse res: Response) {
        res.statusCode = 201;
        return await this.service.create(requestBody);
    }
    @PUT
    @Path("/:id")
    async doUpdate(@PathParam("id") id: string, requestBody: any) {
        return await this.service.update(id, requestBody);
    }
    @DELETE
    @Path("/:id")
    async doDelete(@PathParam("id") id: string) {
        return await this.service.delete(id);
    }
    @GET
    async list() {
        return await this.service.list();
    }
}

