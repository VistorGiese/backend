import { Request, Response } from "express";
import EstablishmentModel from "../models/EstablishmentModel";

export const createEstablishment = async (req: Request, res: Response) => {
  try {
    const establishment = await EstablishmentModel.create(req.body);
    res.status(201).json(establishment);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Erro ao criar estabelecimento", details: error });
  }
};

export const getEstablishments = async (_req: Request, res: Response) => {
  try {
    const establishments = await EstablishmentModel.findAll();
    res.json(establishments);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar estabelecimentos", details: error });
  }
};

export const getEstablishmentById = async (req: Request, res: Response) => {
  try {
    const establishment = await EstablishmentModel.findByPk(req.params.id);
    if (!establishment)
      return res.status(404).json({ error: "Estabelecimento não encontrado" });
    res.json(establishment);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar estabelecimento", details: error });
  }
};

export const updateEstablishment = async (req: Request, res: Response) => {
  try {
    const establishment = await EstablishmentModel.findByPk(req.params.id);
    if (!establishment)
      return res.status(404).json({ error: "Estabelecimento não encontrado" });
    await establishment.update(req.body);
    res.json(establishment);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Erro ao atualizar estabelecimento", details: error });
  }
};

export const deleteEstablishment = async (req: Request, res: Response) => {
  try {
    const establishment = await EstablishmentModel.findByPk(req.params.id);
    if (!establishment)
      return res.status(404).json({ error: "Estabelecimento não encontrado" });
    await establishment.destroy();
    res.json({ message: "Estabelecimento removido com sucesso" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao remover estabelecimento", details: error });
  }
};
