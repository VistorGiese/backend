import { Request, Response } from "express";
import BandMemberModel from "../models/BandMemberModel";

export const createMember = async (req: Request, res: Response) => {
  try {
    const member = await BandMemberModel.create(req.body);
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar membro", details: error });
  }
};

export const getMembers = async (_req: Request, res: Response) => {
  try {
    const members = await BandMemberModel.findAll();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar membros", details: error });
  }
};

export const getMemberById = async (req: Request, res: Response) => {
  try {
    const member = await BandMemberModel.findByPk(req.params.id);
    if (!member)
      return res.status(404).json({ error: "Membro não encontrado" });
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar membro", details: error });
  }
};

export const updateMember = async (req: Request, res: Response) => {
  try {
    const member = await BandMemberModel.findByPk(req.params.id);
    if (!member)
      return res.status(404).json({ error: "Membro não encontrado" });
    await member.update(req.body);
    res.json(member);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar membro", details: error });
  }
};

export const deleteMember = async (req: Request, res: Response) => {
  try {
    const member = await BandMemberModel.findByPk(req.params.id);
    if (!member)
      return res.status(404).json({ error: "Membro não encontrado" });
    await member.destroy();
    res.json({ message: "Membro removido com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover membro", details: error });
  }
};
