import { Request, Response } from "express";
import EstablishmentModel from "../models/EstablishmentModel";
import UserEstablishmentModel from '../models/UserEstablishmentModel';
import AddressModel from '../models/AddressModel';
import { validateEmailFormat, validatePhoneFormat } from "../services/userValidationServices";

export const createEstablishment = async (req: Request, res: Response) => {
  try {
    const {
      nome_estabelecimento,
      nome_dono,
      email_responsavel,
      celular_responsavel,
      generos_musicais,
      horario_funcionamento_inicio,
      horario_funcionamento_fim,
      endereco_id 
    } = req.body;



    if (!nome_estabelecimento || !nome_dono || !email_responsavel || !celular_responsavel || !generos_musicais || !horario_funcionamento_inicio || !horario_funcionamento_fim || !endereco_id) {
      return res.status(400).json({ error: "Preencha todos os campos obrigatórios, incluindo o endereco_id." });
    }

    // Validação de formato de email
    const emailError = validateEmailFormat(email_responsavel);
    if (emailError) {
      return res.status(400).json({ error: emailError });
    }

    // Validação de formato de celular
    const phoneError = validatePhoneFormat(celular_responsavel);
    if (phoneError) {
      return res.status(400).json({ error: phoneError });
    }

    const endereco = await AddressModel.findByPk(endereco_id);
    if (!endereco) {
      return res.status(400).json({ error: "Endereço não encontrado." });
    }


    const existingEstablishment = await EstablishmentModel.findOne({ where: { endereco_id } });
    if (existingEstablishment) {
      return res.status(400).json({ error: "Já existe um estabelecimento cadastrado com este endereço." });
    }

    const existingByCelular = await EstablishmentModel.findOne({ where: { celular_responsavel } });
    if (existingByCelular) {
      return res.status(400).json({ error: "Já existe um estabelecimento cadastrado com este celular." });
    }

    const existingByEmail = await EstablishmentModel.findOne({ where: { email_responsavel } });
    if (existingByEmail) {
      return res.status(400).json({ error: "Já existe um estabelecimento cadastrado com este e-mail." });
    }

    const establishment = await EstablishmentModel.create({
      nome_estabelecimento,
      nome_dono,
      email_responsavel,
      celular_responsavel,
      generos_musicais,
      horario_funcionamento_inicio,
      horario_funcionamento_fim,
      endereco_id
    });
    res.status(201).json({
      nome_estabelecimento,
      nome_dono,
      email_responsavel,
      celular_responsavel,
      generos_musicais,
      horario_funcionamento_inicio,
      horario_funcionamento_fim,
      endereco_id
    });
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar estabelecimento", details: error });
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
    if (establishment.aceita_agendamentos === false) {
      return res.status(403).json({ error: "Estabelecimento não aceita agendamentos" });
    }
    const endereco = await AddressModel.findByPk(establishment.endereco_id);
    res.json({ ...establishment.toJSON(), endereco });
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

export const addEstablishmentManager = async (req: Request, res: Response) => {
  const { usuario_id, estabelecimento_id } = req.body;
  try {
    const exists = await UserEstablishmentModel.findOne({ where: { usuario_id, estabelecimento_id } });
    if (exists) return res.status(400).json({ error: 'Usuário já é gestor deste estabelecimento' });
    await UserEstablishmentModel.create({ usuario_id, estabelecimento_id });
    return res.status(201).json({ message: 'Usuário adicionado como gestor do estabelecimento' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Erro ao adicionar gestor', details: error.message });
  }
};
