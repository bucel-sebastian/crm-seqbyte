import { z } from "zod";

// Company Validators
export const createCompanySchema = z.object({
  name: z.string().min(3, "Numele companiei trebuie sa aiba cel putin 3 caractere"),
  vat: z
    .string()
    .regex(/^(RO)?[0-9]{1,30}$/, "Format VAT invalid"),
  registrationNumber: z.string().min(1, "Numarul de inregistrare este obligatoriu"),
  country: z.string().min(2, "Tara este obligatorie"),
  county: z.string().min(1, "Judetul este obligatoriu"),
  city: z.string().min(1, "Orasul este obligatoriu"),
  address: z.string().optional(),
  bankName: z.string().optional(),
  bankIban: z.string().optional(),
  establishmentDate: z.date().optional(),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;

// Client Validators
export const createClientSchema = z.object({
  name: z.string().min(3, "Numele clientului trebuie sa aiba cel putin 3 caractere"),
  vat: z
    .string()
    .regex(/^(?:RO)?[0-9]{1,30}$|^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/, "Format VAT invalid"),
  registrationNumber: z.string().min(1, "Numarul de inregistrare este obligatoriu"),
  country: z.string().min(2, "Tara este obligatorie"),
  county: z.string().min(1, "Judetul este obligatoriu"),
  city: z.string().min(1, "Orasul este obligatoriu"),
  address: z.string().optional(),
  bankName: z.string().optional(),
  bankIban: z.string().optional(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;

export const createInvoiceSeriesSchema = z.object({
  companyId: z.string().min(1, "Compania este obligatorie"),
  prefix: z.string().min(1, "Prefixul este obligatoriu").max(10, "Prefixul este prea lung"),
  startingNumber: z.number().int().min(1, "Numarul initial trebuie sa fie cel putin 1").default(1),
  description: z.string().optional(),
});

export type CreateInvoiceSeriesInput = z.infer<typeof createInvoiceSeriesSchema>;

// Invoice Validators
export const invoiceProductSchema = z.object({
  name: z.string().min(1, "Denumirea produsului este obligatorie"),
  description: z.string().optional(),
  unitOfMeasurement: z.string().min(1, "Unitatea de masura este obligatorie"),
  quantity: z.number().finite("Cantitatea trebuie sa fie un numar valid"),
  unitPrice: z.number().finite("Pretul unitar trebuie sa fie un numar valid"),
});

export const createInvoiceSchema = z.object({
  companyId: z.string().min(1, "Compania este obligatorie"),
  clientId: z.string().min(1, "Clientul este obligatoriu"),
  seriesId: z.string().min(1, "Seria facturii este obligatorie"),
  invoiceNumber: z.string().min(1, "Numarul facturii este obligatoriu"),
  dateOfIssue: z.date(),
  dueDate: z.date().optional(),
  currency: z.string().default("RON"),
  vatRate: z.number().min(0).max(100).default(0),
  exchangeRate: z.number().optional(),
  products: z.array(invoiceProductSchema).min(1, "Este necesar cel putin un produs"),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;

// Authentication Validators
export const signUpSchema = z.object({
  name: z.string().min(2, "Numele trebuie sa aiba cel putin 2 caractere"),
  email: z.string().email("Adresa de email este invalida"),
  password: z.string().min(8, "Parola trebuie sa aiba cel putin 8 caractere"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Parolele nu coincid",
  path: ["confirmPassword"],
});

export const signInSchema = z.object({
  email: z.string().email("Adresa de email este invalida"),
  password: z.string().min(1, "Parola este obligatorie"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Adresa de email este invalida"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Tokenul este obligatoriu"),
  password: z.string().min(8, "Parola trebuie sa aiba cel putin 8 caractere"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Parolele nu coincid",
  path: ["confirmPassword"],
});
