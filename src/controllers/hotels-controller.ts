import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId;

    try {
        const hotels = await hotelsService.getHotels(userId);
        return res.status(httpStatus.OK).send(hotels);
    } catch (err) {
        if (err.name === "NotFoundError") {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
        if (err.name === "PaymentRequiredError") {
            return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
        }
    };
};

export async function getHotelId(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId;
    const { hotelId } = req.params;

    try {
        const hotel = await hotelsService.getHotelId(userId, Number(hotelId));
        console.log(hotel)
        return res.status(httpStatus.OK).send(hotel);
    } catch (err) {
        if (err.name === "NotFoundError") {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
        if (err.name === "PaymentRequiredError") {
            return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
        }
    };
};