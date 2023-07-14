import { prisma } from "@/config";

async function findManyHotels(){
    return prisma.hotel.findMany();
};

async function findHotelById(id: number){
    console.log(id)
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