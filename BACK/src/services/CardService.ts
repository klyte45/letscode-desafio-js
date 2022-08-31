import { ICardBase, ICardDTO, ICardModel, MODEL_NAME } from "#interfaces/db/Card";
import mongoose from "mongoose";
import { OnlyInstantiableByContainer, Singleton } from "typescript-ioc";
import { BadRequestError, NotFoundError } from "typescript-rest/dist/server-errors";

@Singleton
@OnlyInstantiableByContainer
export class CardService {

    private dbModel: ICardModel = mongoose.model(MODEL_NAME) as ICardModel;

    public async create(input: any) {
        if (
            !input
            || typeof input.id !== "undefined"
            || !input.titulo || typeof input.titulo !== "string"
            || !input.conteudo || typeof input.conteudo !== "string"
            || !input.lista || typeof input.lista !== "string"
        ) {
            throw new BadRequestError();
        }
        return (await new this.dbModel({
            titulo: input.titulo,
            conteudo: input.conteudo,
            lista: input.lista
        }).save()).toJSON() as ICardDTO;
    }

    public async update(id: string, dataToModify: any) {
        if (
            !dataToModify
            || dataToModify.id !== id
            || !dataToModify.titulo || typeof dataToModify.titulo !== "string"
            || !dataToModify.conteudo || typeof dataToModify.conteudo !== "string"
            || !dataToModify.lista || typeof dataToModify.lista !== "string"
        ) {
            throw new BadRequestError();
        }

        const dbObject = await this.dbModel.findById(id);
        if (!dbObject) {
            throw new NotFoundError();
        }

        dbObject.titulo = dataToModify.titulo;
        dbObject.conteudo = dataToModify.conteudo;
        dbObject.lista = dataToModify.lista;
        return (await dbObject.save()).toJSON() as ICardDTO;
    }

    public async list() {
        return (await this.dbModel.find()).map(x => x.toJSON() as ICardDTO);
    }

    public async delete(id: string) {
        if (!(await this.dbModel.findByIdAndDelete(id))) {
            throw new NotFoundError();
        }
        return this.list();
    }

}