import { Document, Types } from "mongoose";

export interface _BasicEntity extends Document<Types.ObjectId> {
    _createDate: Date,
    _lastUpdate: Date
}