import { Op } from "sequelize";
export const getAvailableEventsForBands = async (_req: Request, res: Response) => {
  try {
    const eventos = await BookingModel.findAll({
      where: {
        banda_id: { [Op.is]: null },
        status: BookingStatus.PENDENTE
      }
    });
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar eventos disponíveis", details: error });
  }
};
export const applyBandToEvent = async (req: Request, res: Response) => {
  try {
    const { banda_id } = req.body;
    const { id } = req.params;
    const evento = await BookingModel.findByPk(id);
    if (!evento) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }
    if (evento.banda_id) {
      return res.status(400).json({ error: "Evento já possui banda associada" });
    }
    await evento.update({ banda_id, status: BookingStatus.EM_NEGOCIACAO });
    res.json({ message: "Banda aplicada ao evento com sucesso", evento });
  } catch (error) {
    res.status(400).json({ error: "Erro ao aplicar banda ao evento", details: error });
  }
};
import { Request, Response } from "express";
import BookingModel, { BookingStatus } from "../models/BookingModel";
import EstablishmentScheduleModel from "../models/EstablishmentScheduleModel";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { titulo_evento, descricao_evento, data_show, estabelecimento_id, horario_inicio, horario_fim } = req.body;
    const { Op } = require('sequelize');
    const conflito = await BookingModel.findOne({
      where: {
        estabelecimento_id,
        data_show,
        [Op.or]: [
          {
            horario_inicio: { [Op.lt]: horario_fim },
            horario_fim: { [Op.gt]: horario_inicio }
          }
        ]
      }
    });
    if (conflito) {
      return res.status(400).json({ error: "Já existe evento para este estabelecimento neste horário e dia." });
    }
    const booking = await BookingModel.create({
      titulo_evento,
      descricao_evento,
      data_show,
      estabelecimento_id,
      horario_inicio,
      horario_fim,
      status: BookingStatus.PENDENTE,
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar evento", details: error });
  }
};

export const getBookings = async (_req: Request, res: Response) => {
  try {
    const bookings = await BookingModel.findAll({
      attributes: [
        "id",
        "titulo_evento",
        "descricao_evento",
        "data_show",
        "horario_inicio",
        "horario_fim",
        "estabelecimento_id"
      ]
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar agendamentos", details: error });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const booking = await BookingModel.findByPk(req.params.id);
    if (!booking)
      return res.status(404).json({ error: "Agendamento não encontrado" });
    const BandModel = require('../models/BandModel').default;
    const EstablishmentModel = require('../models/EstablishmentModel').default;
    const UserModel = require('../models/UserModel').default;
    const banda = await BandModel.findByPk(booking.banda_id);
    const estabelecimento = await EstablishmentModel.findByPk(booking.estabelecimento_id);
    const usuario = await UserModel.findByPk(booking.usuario_solicitante_id);
    res.json({
      ...booking.toJSON(),
      banda_nome: banda ? banda.nome : null,
      estabelecimento_nome: estabelecimento ? estabelecimento.nome_dono : null,
      usuario_solicitante_nome: usuario ? usuario.nome : null,
    });
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
    if (req.body.status === BookingStatus.ACEITO) {
      const conflito = await BookingModel.findOne({
        where: {
          estabelecimento_id: booking.estabelecimento_id,
          data_show: booking.data_show,
          status: BookingStatus.ACEITO,
          id: { $ne: booking.id },
        },
      });
      if (conflito) {
        return res
          .status(400)
          .json({ error: "Já existe agendamento ACEITO para este horário." });
      }
      await booking.update({
        ...req.body,
        status: BookingStatus.ACEITO,
        valor_final: req.body.valor_final,
      });
      return res.json(booking);
    }
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
