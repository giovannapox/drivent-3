import { notFoundError, paymentRequiredError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelsRepository from "@/repositories/hotels-repository";
import ticketsRepository from "@/repositories/tickets-repository";

async function getHotels(id: number){
    const ticket = await hotelExists(id);

    console.log(ticket, "get hotel")
    //Ticket não foi pago, é remoto ou não inclui hotel
    if(ticket.status === "RESERVED" || ticket.TicketType.isRemote === true || ticket.TicketType.includesHotel === false){
        console.log('payment required error')
        throw paymentRequiredError();
    };

    const hotel = await hotelsRepository.findManyHotels();
    if(hotel.length === 0){
        throw notFoundError();
    };

    return hotel;
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