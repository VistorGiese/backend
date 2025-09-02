import { Request, Response } from "express";
import BookingModel from "../models/BookingModel";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const booking = await BookingModel.create(req.body);
    res.status(201).json(booking);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Erro ao criar agendamento", details: error });
  }
};

export const getBookings = async (_req: Request, res: Response) => {
  try {
    const bookings = await BookingModel.findAll();
    res.json(bookings);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar agendamentos", details: error });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const booking = await BookingModel.findByPk(req.params.id);
    if (!booking)
      return res.status(404).json({ error: "Agendamento não encontrado" });
    res.json(booking);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar agendamento", details: error });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const booking = await BookingModel.findByPk(req.params.id);
    if (!booking)
      return res.status(404).json({ error: "Agendamento não encontrado" });
    await booking.update(req.body);
    res.json(booking);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Erro ao atualizar agendamento", details: error });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const booking = await BookingModel.findByPk(req.params.id);
    if (!booking)
      return res.status(404).json({ error: "Agendamento não encontrado" });
    await booking.destroy();
    res.json({ message: "Agendamento removido com sucesso" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao remover agendamento", details: error });
  }
};
