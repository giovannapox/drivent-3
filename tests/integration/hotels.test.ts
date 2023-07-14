import app, { init } from "@/app";
import supertest from "supertest";
import { cleanDb, generateValidToken } from "../helpers";
import { createUser } from "../factories";

const server = supertest(app);

beforeAll(async () => {
    await init();
    await cleanDb();
});


describe("get hotels", () => {
    it("401 unauthorized", async () => {
        const { status } = await server.get('/hotels');
        expect(status).toBe(401);
    });

    describe("When user is authorized", () => {
        it("404 enrollment doesn't exists", async () => {
            const token = await generateValidToken();
    
            const { status } = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
            expect(status).toBe(404);
        });

        it("404 ticket doesn't exists", async () => {
            const randomUser = await createUser();
            const token = await generateValidToken(randomUser);
            
            const { status } = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
            expect(status).toBe(404);
        })

        it("404 hotel doesn't exists", async () => {
            
        })
    });
});