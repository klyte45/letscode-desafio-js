import { ICardDTO, ICardModel, MODEL_NAME } from "#interfaces/db/Card";
import moment from "moment";
import mongoose from "mongoose";
import { OnlyInstantiableByContainer, Singleton } from "typescript-ioc";
import { BadRequestError, NotFoundError } from "typescript-rest/dist/server/model/errors";

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
        console.log(`${moment().format("DD/MM/YYYY HH:mm:ss")} - Card ${id} - ${dbObject.titulo} - Alterado`)

        return (await dbObject.save()).toJSON() as ICardDTO;
    }

    public async list() {
        return (await this.dbModel.find()).map(x => x.toJSON() as ICardDTO);
    }

    public async delete(id: string) {
        const deletedObj = await this.dbModel.findByIdAndDelete(id);
        if (!deletedObj) {
            throw new NotFoundError();
        }
        console.log(`${moment().format("DD/MM/YYYY HH:mm:ss")} - Card ${id} - ${deletedObj.titulo} - Removido`)
        return this.list();
    }

}