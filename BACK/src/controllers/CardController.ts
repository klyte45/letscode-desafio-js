import { Response } from 'express';
import { CardService } from '#services/CardService';
import { Inject } from 'typescript-ioc';
import { ContextResponse, DELETE, GET, Path, PathParam, POST, PUT } from "typescript-rest";

@Path("/cards")
export class CardController {

    @Inject
    private service!: CardService;

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