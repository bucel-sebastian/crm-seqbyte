import { z } from "zod";

// Company Validators
export const createCompanySchema = z.object({
  name: z.string().min(3, "Company name must be at least 3 characters"),
  vat: z
    .string()
    .regex(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/, "Invalid VAT format"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  country: z.string().min(2, "Country is required"),
  county: z.string().min(1, "County is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().optional(),
  bankName: z.string().optional(),
  bankIban: z.string().optional(),
  establishmentDate: z.date().optional(),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;

// Client Validators
export const createClientSchema = z.object({
  name: z.string().min(3, "Client name must be at least 3 characters"),
  vat: z
    .string()
    .regex(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/, "Invalid VAT format"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  country: z.string().min(2, "Country is required"),
  county: z.string().min(1, "County is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().optional(),
  bankName: z.string().optional(),
  bankIban: z.string().optional(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;

export const createInvoiceSeriesSchema = z.object({
  companyId: z.string().min(1, "Company is required"),
  prefix: z.string().min(1, "Prefix is required").max(10, "Prefix is too long"),
  startingNumber: z.number().int().min(1, "Starting number must be at least 1").default(1),
  description: z.string().optional(),
});

export type CreateInvoiceSeriesInput = z.infer<typeof createInvoiceSeriesSchema>;

// Invoice Validators
export const invoiceProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  unitOfMeasurement: z.string().min(1, "Unit of measurement is required"),
  quantity: z.number().finite("Quantity must be a valid number"),
  unitPrice: z.number().finite("Unit price must be a valid number"),
});

export const createInvoiceSchema = z.object({
  companyId: z.string().min(1, "Company is required"),
  clientId: z.string().min(1, "Client is required"),
  seriesId: z.string().min(1, "Invoice series is required"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  dateOfIssue: z.date(),
  dueDate: z.date().optional(),
  currency: z.string().default("RON"),
  vatRate: z.number().min(0).max(100).default(0),
  exchangeRate: z.number().optional(),
  products: z.array(invoiceProductSchema).min(1, "At least one product is required"),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;

// Authentication Validators
export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
