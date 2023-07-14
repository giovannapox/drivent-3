import { prisma } from "@/config";

async function findManyHotels(){
    return prisma.hotel.findMany();
};

async function findHotelById(id: number){
    return prisma.hotel.findFirst({
        where: {
            id
        }
    })
};

const hotelsRepository = {
    findManyHotels,
    findHotelById
};

export default hotelsRepository;