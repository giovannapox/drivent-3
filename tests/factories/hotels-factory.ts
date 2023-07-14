import { prisma } from "@/config";
import faker from "@faker-js/faker";

export async function createRandomHotel(){
    return prisma.hotel.create({
        data: {
            name: faker.company.companyName(),
            image: faker.image.imageUrl()
        }
    });
};