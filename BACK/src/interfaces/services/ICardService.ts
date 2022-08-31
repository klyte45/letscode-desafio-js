import { ICardDTO } from "#interfaces/db/Card";

export abstract class ICardService {
    public abstract create(input: any): Promise<ICardDTO>;
    public abstract update(id: string, dataToModify: any): Promise<ICardDTO>;
    public abstract list(): Promise<ICardDTO[]>;
    public abstract delete(id: string): Promise<ICardDTO[]>;

}