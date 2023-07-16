import app, { init } from "@/app";
import supertest from "supertest";
import { cleanDb, generateValidToken } from "../helpers";
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from "../factories";
import httpStatus from "http-status";
import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { createRandomHotel } from "../factories/hotels-factory";

const server = supertest(app);

beforeAll(async () => {
    await init();
    await cleanDb();
});


describe("get hotels", () => {
    it("401 unauthorized", async () => {
        const { status } = await server.get('/hotels');
        expect(status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("When user is authorized", () => {
        it("404 enrollment doesn't exists", async () => {
            const token = await generateValidToken();
    
            const { status } = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
            expect(status).toBe(httpStatus.NOT_FOUND);
        });

        it("404 ticket doesn't exists", async () => {
            const randomUser = await createUser();
            const token = await generateValidToken(randomUser);
            await createEnrollmentWithAddress(randomUser);
            
            const { status } = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
            expect(status).toBe(httpStatus.NOT_FOUND);
        });

        it("404 hotel doesn't exists", async () => {
            const randomUser = await createUser();
            const token = await generateValidToken(randomUser);
            const enrollment = await createEnrollmentWithAddress(randomUser);
            const ticketType = await prisma.ticketType.create({
                data: {
                    name: faker.name.findName(),
                    price: faker.datatype.number(),
                    isRemote: false,
                    includesHotel: true,
                },
            });
            await createTicket(enrollment.id, ticketType.id, "PAID");

            const { status } = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
            expect(status).toBe(httpStatus.NOT_FOUND);
        });

        it("402 if ticket doesn't paid", async () => {
            const randomUser = await createUser();
            const token = await generateValidToken(randomUser);
            const enrollment = await createEnrollmentWithAddress(randomUser);
            const ticketType = await createTicketType();
            await createTicket(enrollment.id, ticketType.id, "RESERVED");

            const { status } = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
            expect(status).toBe(httpStatus.PAYMENT_REQUIRED);
        });

        it("402 if hotel is remote", async () => {
            const randomUser = await createUser();
            const token = await generateValidToken(randomUser);
            const enrollment = await createEnrollmentWithAddress(randomUser);
            const ticketType = await prisma.ticketType.create({
                data: {
                    name: faker.name.findName(),
                    price: faker.datatype.number(),
                    isRemote: true,
                    includesHotel: true,
                },
            });
            await createTicket(enrollment.id, ticketType.id, "PAID");
            await createRandomHotel();

            const { status } = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
            expect(status).toBe(httpStatus.PAYMENT_REQUIRED);
        });

        it("402 if hotel is not included", async () => {
            const randomUser = await createUser();
            const token = await generateValidToken(randomUser);
            const enrollment = await createEnrollmentWithAddress(randomUser);
            const ticketType = await prisma.ticketType.create({
                data: {
                    name: faker.name.findName(),
                    price: faker.datatype.number(),
                    isRemote: false,
                    includesHotel: false,
                },
            });
            await createTicket(enrollment.id, ticketType.id, "PAID");
            await createRandomHotel();

            const { status } = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
            expect(status).toBe(httpStatus.PAYMENT_REQUIRED);
        });

        it("200 ok", async () => {
            const randomUser = await createUser();
            const token = await generateValidToken(randomUser);
            const enrollment = await createEnrollmentWithAddress(randomUser);
            const ticketType = await prisma.ticketType.create({
                data: {
                    name: faker.name.findName(),
                    price: faker.datatype.number(),
                    isRemote: false,
                    includesHotel: true,
                },
            });
            await createTicket(enrollment.id, ticketType.id, "PAID");
            await createRandomHotel();

            const { status } = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
            expect(status).toBe(httpStatus.OK);
        });
    });

    
});

describe("get hotels by id", () => {
    it("401 unauthorized", async () => {
        const { status } = await server.get('/hotels/1');
        expect(status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("When user is authorized", () => {
        it("404 enrollment doesn't exists", async () => {
            const token = await generateValidToken();
            const hotel = await createRandomHotel();
    
            const { status } = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`)
            expect(status).toBe(httpStatus.NOT_FOUND);
        });

        it("404 ticket doesn't exists", async () => {
            const randomUser = await createUser();
            const token = await generateValidToken(randomUser);
            await createEnrollmentWithAddress(randomUser);
            const hotel = await createRandomHotel();
            
            const { status } = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`)
            expect(status).toBe(httpStatus.NOT_FOUND);
        });

        it("404 hotel doesn't exists", async () => {
            const randomUser = await createUser();
            const token = await generateValidToken(randomUser);
            const enrollment = await createEnrollmentWithAddress(randomUser);
            const ticketType = await prisma.ticketType.create({
                data: {
                    name: faker.name.findName(),
                    price: faker.datatype.number(),
                    isRemote: false,
                    includesHotel: true,
                },
            });
            await createTicket(enrollment.id, ticketType.id, "PAID");

            const { status } = await server.get(`/hotels/1`).set('Authorization', `Bearer ${token}`)
            expect(status).toBe(httpStatus.NOT_FOUND);
        });

        it("402 if ticket doesn't paid", async () => {
            const randomUser = await createUser();
            const token = await generateValidToken(randomUser);
            const enrollment = await createEnrollmentWithAddress(randomUser);
            const ticketType = await createTicketType();
            await createTicket(enrollment.id, ticketType.id, "RESERVED");
            const hotel = await createRandomHotel();

            const { status } = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`)
            expect(status).toBe(httpStatus.PAYMENT_REQUIRED);
        });

        it("402 if hotel is remote", async () => {
            const randomUser = await createUser();
            const token = await generateValidToken(randomUser);
            const enrollment = await createEnrollmentWithAddress(randomUser);
            const ticketType = await prisma.ticketType.create({
                data: {
                    name: faker.name.findName(),
                    price: faker.datatype.number(),
                    isRemote: true,
                    includesHotel: true,
                },
            });
            await createTicket(enrollment.id, ticketType.id, "PAID");
            const hotel = await createRandomHotel();

            const { status } = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`)
            expect(status).toBe(httpStatus.PAYMENT_REQUIRED);
        });

        it("402 if hotel is not included", async () => {
            const randomUser = await createUser();
            const token = await generateValidToken(randomUser);
            const enrollment = await createEnrollmentWithAddress(randomUser);
            const ticketType = await prisma.ticketType.create({
                data: {
                    name: faker.name.findName(),
                    price: faker.datatype.number(),
                    isRemote: false,
                    includesHotel: false,
                },
            });
            await createTicket(enrollment.id, ticketType.id, "PAID");
            const hotel = await createRandomHotel();

            const { status } = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`)
            expect(status).toBe(httpStatus.PAYMENT_REQUIRED);
        });

        it("200 ok", async () => {
            const randomUser = await createUser();
            const token = await generateValidToken(randomUser);
            const enrollment = await createEnrollmentWithAddress(randomUser);
            const ticketType = await prisma.ticketType.create({
                data: {
                    name: faker.name.findName(),
                    price: faker.datatype.number(),
                    isRemote: false,
                    includesHotel: true,
                },
            });
            await createTicket(enrollment.id, ticketType.id, "PAID");
            const hotel = await createRandomHotel();

            const { status } = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`)
            expect(status).toBe(httpStatus.OK);
        });
    });

    
});