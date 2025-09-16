import UserModel from "../models/UserModel";
import bcrypt from "bcrypt";
import { cpf } from "cpf-cnpj-validator";

export const validateName = (name: string): string | null => {
  if (!name || name.trim() === "") {
    return "Escreva um nome válido";
  }
  return null;
};

export const checkNameExists = async (name: string): Promise<string | null> => {
  const existingUser = await UserModel.findOne({ where: { name } });
  if (existingUser) {
    return "???.";
  }
  return null;
};

export const validateEmailFormat = (email: string): string | null => {
  if (!email || email.trim() === "") {
    return "Escreva um EMAIL válido";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    return "Digite um e-mail válido (ex: nome@email.com)";
  }
  return null;
};

export const checkEmailExists = async (
  email: string
): Promise<string | null> => {
  const existingUser = await UserModel.findOne({ where: { email } });
  if (existingUser) {
    return "Este e-mail já está cadastrado.";
  }
  return null;
};

export const validateCPF = (CPF: string): string | null => {
  if (!CPF || typeof CPF !== "string" || !cpf.isValid(CPF)) {
    return "CPF inválido";
  }
  return null;
};

// Validador de formato de celular brasileiro (aceita 10 ou 11 dígitos, com ou sem DDD)
export const validatePhoneFormat = (phone: string): string | null => {
  if (!phone || typeof phone !== "string") return "Informe um celular válido";
  // Remove tudo que não for número
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 11) {
    return "Celular inválido. Use DDD + número (10 a 11 dígitos)";
  }
  return null;
};

export const validatePasswordFormat = (password: string): string | null => {
  const senhaRegex =
    /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
  if (!password || !senhaRegex.test(password)) {
    return "A senha deve ter no mínimo 8 caracteres e pelo menos 1 caractere especial";
  }
  return null;
};

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const validateUserData = async (
  name: string,
  email: string,
  password: string,
  CPF: string
): Promise<string | null> => {
  let error = validateName(name);
  if (error) return error;

  error = validateEmailFormat(email);
  if (error) return error;

  error = await checkEmailExists(email);
  if (error) return error;

  error = validateCPF(CPF);
  if (error) return error;

  error = validatePasswordFormat(password);
  if (error) return error;

  return null;
};

export const updateUserData = async (
  name: string,
  password: string,
  address: string
): Promise<string | null> => {
  let error = validateName(name);
  if (error) return error;

  error = validatePasswordFormat(password);
  if (error) return error;

  return null;
};