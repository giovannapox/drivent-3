import { notFoundError, paymentRequiredError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelsRepository from "@/repositories/hotels-repository";
import ticketsRepository from "@/repositories/tickets-repository";

async function getHotels(id: number){
    const ticket = await hotelExists(id);
    
    //Ticket não foi pago, é remoto ou não inclui hotel
    if(ticket.status === "RESERVED" || ticket.TicketType.isRemote === true || ticket.TicketType.includesHotel === false){
        throw paymentRequiredError();
    };

    return await hotelsRepository.findManyHotels();
};

async function getHotelId(userId: number, id: number){
    const ticket = await hotelExists(userId);

    //Ticket não foi pago, é remoto ou não inclui hotel
    if(ticket.status === "RESERVED" ||  ticket.TicketType.isRemote === true || ticket.TicketType.includesHotel === false){
        throw paymentRequiredError();
    };

    const hotel = await hotelsRepository.findHotelById(id);
    if(!hotel){
        throw notFoundError();
    };
    return hotel;
};

async function hotelExists(userId: number){
    const hotel = await hotelsRepository.findManyHotels();
    if(hotel.length === 0){
        throw notFoundError();
    };

    const enrollmentExists = await enrollmentRepository.findWithAddressByUserId(userId);
    if(!enrollmentExists){
        throw notFoundError();
    };

    const ticketExists = await ticketsRepository.findTicketByEnrollmentId(enrollmentExists.id);
    if(!ticketExists){
        throw notFoundError();
    };

    return ticketExists;
};

const hotelsService = {
    getHotels,
    getHotelId
};

export default hotelsService;