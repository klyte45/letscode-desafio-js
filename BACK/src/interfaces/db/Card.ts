
import { Model } from "mongoose";
import { _BasicEntity } from "./_common";

export const MODEL_NAME = "cards";

export interface ICardBase {
    _id: string,
    titulo: string,
    conteudo: string,
    lista: string
}

export interface ICardDTO {
    id: string,
    titulo: string,
    conteudo: string,
    lista: string
}

export interface ICard extends Omit<_BasicEntity, '_id'>, ICardBase { }

export interface ICardModel extends Model<ICard> { }
