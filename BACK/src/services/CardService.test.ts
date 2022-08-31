import { ICard, ICardDTO, ICardModel } from '#interfaces/db/Card';
import { BadRequestError, NotFoundError } from 'typescript-rest/dist/server/model/errors';
import { CardService } from './CardService';

if (process.env.TEST) {

    describe('Create Card tests', () => {
        const cardModelMock: ICardModel = jest.requireMock('#db/CardModel').default;
        const targetClass = new CardService(cardModelMock);
        type CreateStats = {
            saveCount: number
            hasConvertedToJSON: boolean
        }

        async function runCreateTest(outputData: CreateStats, cardModelMock: ICardModel, inputFields: ICardDTO, targetClass: CardService) {
            outputData.saveCount = 0;
            outputData.hasConvertedToJSON = false;
            jest.spyOn(cardModelMock.prototype, 'constructor')
                .mockImplementation((dbObject: ICard) => {
                    expect(dbObject.lista).toBe(inputFields.lista);
                    expect(dbObject.conteudo).toBe(inputFields.conteudo);
                    expect(dbObject.titulo).toBe(inputFields.titulo);
                    dbObject.toJSON = () => {
                        outputData.hasConvertedToJSON = true;
                        return dbObject;
                    };
                    let result = {
                        save: async () => {
                            outputData.saveCount++;
                            return dbObject;
                        }
                    };
                    return result;
                });
            await targetClass.create(inputFields);
        }

        test('On add a valid card, then input in DB', async () => {
            const inputFields = {
                lista: "TTTTTT",
                conteudo: "AAAAA",
                titulo: "AAAAAA"
            } as ICardDTO
            const outputData = {} as CreateStats;
            await runCreateTest(outputData, cardModelMock, inputFields, targetClass);
            expect(outputData.saveCount).toBe(1);
            expect(outputData.hasConvertedToJSON).toBe(true);
        });

        test('On add a invalid card with an id set, then throw exception', async () => {
            const inputFields = {
                id: "AAA",
                lista: "TTTTTT",
                conteudo: "AAAAA",
                titulo: "AAAAAA"
            } as ICardDTO
            const outputData = {} as CreateStats;
            try {
                await runCreateTest(outputData, cardModelMock, inputFields, targetClass);
                fail("Must had throw an exception!");
            } catch (e) {
                expect(e).toBeInstanceOf(BadRequestError)
                expect(outputData.saveCount).toBe(0);
                expect(outputData.hasConvertedToJSON).toBe(false);
            }
        });

        test('On add a invalid card with empty fields, then throw exception', async () => {
            const inputFields = {
                lista: "TTTTTT",
            } as ICardDTO
            const outputData = {} as CreateStats;
            try {
                await runCreateTest(outputData, cardModelMock, inputFields, targetClass);
                fail("Must had throw an exception!");
            } catch (e) {
                expect(e).toBeInstanceOf(BadRequestError)
                expect(outputData.saveCount).toBe(0);
                expect(outputData.hasConvertedToJSON).toBe(false);
            }
        });
    });


    describe('Update Card tests', () => {
        const cardModelMock: ICardModel = jest.requireMock('#db/CardModel').default;
        const targetClass = new CardService(cardModelMock);
        type UpdateStats = {
            saveCount: number
            dbSearches: number
            hasConvertedToJSON: boolean
        }

        async function runUpdateTest(outputData: UpdateStats, cardModelMock: ICardModel, id: string, findResult: ICard | null, inputFields: ICardDTO, targetClass: CardService) {
            outputData.saveCount = 0;
            outputData.hasConvertedToJSON = false;
            outputData.dbSearches = 0;
            jest.spyOn(cardModelMock, 'findById')
                .mockImplementation(() => {
                    if (findResult) {
                        findResult.toJSON = () => {
                            outputData.hasConvertedToJSON = true;
                            return findResult;
                        };
                        (findResult as any).save = async () => {
                            outputData.saveCount++;
                            return findResult;
                        }
                    }
                    return new Promise((resolve) => {
                        outputData.dbSearches++;
                        return resolve(findResult);
                    }) as any;
                });
            await targetClass.update(id, inputFields);
        }

        test('On update a valid card, then save in DB', async () => {
            const inputFields = {
                id: "iiiiiiii",
                lista: "TTTTTT",
                conteudo: "AAAAA",
                titulo: "AAAAAA"
            } as ICardDTO
            const resultFields = {
                _id: "iiiiiiii",
                lista: "TTTTTT",
                conteudo: "AAAAA",
                titulo: "AAAAAA"
            } as ICard
            let outputData = {} as UpdateStats;
            await runUpdateTest(outputData, cardModelMock, inputFields.id, resultFields, inputFields, targetClass);
            expect(outputData.saveCount).toBe(1);
            expect(outputData.dbSearches).toBe(1);
            expect(outputData.hasConvertedToJSON).toBe(true);
        });

        test('On mismatch the id field, then throw error', async () => {
            const inputFields = {
                id: "iiiiiiii",
                lista: "TTTTTT",
                conteudo: "AAAAA",
                titulo: "AAAAAA"
            } as ICardDTO
            const resultFields = {
                _id: "iiiiiiii",
                lista: "TTTTTT",
                conteudo: "AAAAA",
                titulo: "AAAAAA"
            } as ICard
            let outputData = {} as UpdateStats;
            try {
                await runUpdateTest(outputData, cardModelMock, "XXXXXXXX", resultFields, inputFields, targetClass);
                fail("Must had throw an exception!");
            } catch (e) {
                expect(e).toBeInstanceOf(BadRequestError)
                expect(outputData.saveCount).toBe(0);
                expect(outputData.dbSearches).toBe(0);
                expect(outputData.hasConvertedToJSON).toBe(false);
            }
        });

        test('Object not found in DB, then throw error', async () => {
            const inputFields = {
                id: "iiiiiiii",
                lista: "TTTTTT",
                conteudo: "AAAAA",
                titulo: "AAAAAA"
            } as ICardDTO
            const resultFields = null
            let outputData = {} as UpdateStats;
            try {
                await runUpdateTest(outputData, cardModelMock, inputFields.id, resultFields, inputFields, targetClass);
                fail("Must had throw an exception!");
            } catch (e) {
                expect(e).toBeInstanceOf(NotFoundError)
                expect(outputData.saveCount).toBe(0);
                expect(outputData.dbSearches).toBe(1);
                expect(outputData.hasConvertedToJSON).toBe(false);
            }
        });

    });


    describe('Remove Card tests', () => {
        const cardModelMock: ICardModel = jest.requireMock('#db/CardModel').default;
        const targetClass = new CardService(cardModelMock);
        type RemoveStats = {
            dbSearches: number,
            hasCallList: boolean
        }

        async function runDeleteTest(outputData: RemoveStats, cardModelMock: ICardModel, id: string, findResult: ICard | null, targetClass: CardService) {
            outputData.dbSearches = 0;
            outputData.hasCallList = false;
            targetClass.list = async () => {
                outputData.hasCallList = true;
                return [];
            }
            jest.spyOn(cardModelMock, 'findByIdAndDelete')
                .mockImplementation(() => {
                    return new Promise((resolve) => {
                        outputData.dbSearches++;
                        return resolve(findResult);
                    }) as any;
                });
            await targetClass.delete(id);
        }

        test('On delete a valid card, return the list method', async () => {
            const resultFields = {
                _id: "iiiiiiii",
                lista: "TTTTTT",
                conteudo: "AAAAA",
                titulo: "AAAAAA"
            } as ICard
            let outputData = {} as RemoveStats;
            await runDeleteTest(outputData, cardModelMock, resultFields._id, resultFields, targetClass);
            expect(outputData.hasCallList).toBe(true);
            expect(outputData.dbSearches).toBe(1);
        });

        test('On mismatch the id field, then throw error', async () => {
            let outputData = {} as RemoveStats;
            try {
                await runDeleteTest(outputData, cardModelMock, "XXXXXXXX", null, targetClass);
                fail("Must had throw an exception!");
            } catch (e) {
                expect(e).toBeInstanceOf(NotFoundError)
                expect(outputData.hasCallList).toBe(false);
                expect(outputData.dbSearches).toBe(1);
            }
        });
    });



    describe('List Card tests', () => {
        const cardModelMock: ICardModel = jest.requireMock('#db/CardModel').default;
        const targetClass = new CardService(cardModelMock);
        type ListStats = {
            dbSearches: number,
            hasCallToJSON: boolean
        }

        async function runListTest(outputData: ListStats, targetClass: CardService) {
            outputData.dbSearches = 0;
            outputData.hasCallToJSON = false;
            jest.spyOn(cardModelMock, 'find')
                .mockImplementation(() => {
                    return new Promise((resolve) => {
                        outputData.dbSearches++;
                        return resolve([{
                            toJSON: () => {
                                outputData.hasCallToJSON = true;
                                return {};
                            }
                        }]);
                    }) as any;
                });
            await targetClass.list();
        }

        test('On ask for list, then convert all items via toJSON()', async () => {

            let outputData = {} as ListStats;
            await runListTest(outputData, targetClass);
            expect(outputData.hasCallToJSON).toBe(true);
            expect(outputData.dbSearches).toBe(1);
        });

    });
}