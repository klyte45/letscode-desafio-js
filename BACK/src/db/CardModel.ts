
import { ICard, ICardDTO, ICardModel, MODEL_NAME } from '#interfaces/db/Card';
import mongoose, { Schema } from 'mongoose';
import * as uuid from "uuid"

const schema = new Schema<ICard, ICardModel>({
    _id: {
        type: String,
        default: function genUUID() {
            return uuid.v4()
        }
    },
    titulo: String,
    conteudo: String,
    lista: String
}, { timestamps: { createdAt: '_createDate', updatedAt: '_lastUpdate' } });

schema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        return ret = {
            conteudo: ret.conteudo,
            id: ret._id,
            lista: ret.lista,
            titulo: ret.titulo
        } as ICardDTO;
    }
});

export default mongoose.model<ICard>(MODEL_NAME, schema) as ICardModel;
