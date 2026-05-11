import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createClientSchema,
  createCompanySchema,
  createInvoiceSchema,
  createInvoiceSeriesSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from '@/lib/validators'

const authApi = vi.hoisted(() => ({
  signInEmail: vi.fn(),
  getSession: vi.fn(),
  signOut: vi.fn(),
}))

vi.mock('@/lib/auth', () => ({
  auth: {
    api: authApi,
  },
}))

vi.mock('next/headers', () => ({
  headers: vi.fn(async () => new Headers()),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

import { login } from '@/server/actions/auth'

describe('validation schemas', () => {
  it('validates company payloads', () => {
    const result = createCompanySchema.safeParse({
      name: 'Acme SRL',
      vat: 'RO12345678',
      registrationNumber: 'J12/123/2024',
      country: 'RO',
      county: 'Cluj',
      city: 'Cluj-Napoca',
      address: 'Str. Memorandumului 1',
    })

    expect(result.success).toBe(true)
  })

  it('rejects invalid company VAT formats', () => {
    const result = createCompanySchema.safeParse({
      name: 'Acme SRL',
      vat: 'INVALID-VAT',
      registrationNumber: 'J12/123/2024',
      country: 'RO',
      county: 'Cluj',
      city: 'Cluj-Napoca',
    })

    expect(result.success).toBe(false)
  })

  it('validates client and invoice schemas', () => {
    expect(
      createClientSchema.safeParse({
        name: 'Client SRL',
        vat: 'RO87654321',
        registrationNumber: 'J12/321/2024',
        country: 'RO',
        county: 'Cluj',
        city: 'Cluj-Napoca',
      }).success,
    ).toBe(true)

    expect(
      createInvoiceSeriesSchema.parse({
        companyId: 'company-1',
        prefix: 'INV',
      }).startingNumber,
    ).toBe(1)

    expect(
      createInvoiceSchema.safeParse({
        companyId: 'company-1',
        clientId: 'client-1',
        seriesId: 'series-1',
        invoiceNumber: 'INV-001',
        dateOfIssue: new Date('2026-05-11'),
        products: [
          {
            name: 'Consulting',
            unitOfMeasurement: 'hour',
            quantity: 2,
            unitPrice: 100,
          },
        ],
      }).success,
    ).toBe(true)
  })

  it('validates auth schemas', () => {
    expect(
      signUpSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      }).success,
    ).toBe(true)

    expect(
      signInSchema.safeParse({
        email: 'john@example.com',
        password: 'password123',
      }).success,
    ).toBe(true)

    expect(forgotPasswordSchema.safeParse({ email: 'john@example.com' }).success).toBe(true)

    expect(
      resetPasswordSchema.safeParse({
        token: 'token-123',
        password: 'newpassword123',
        confirmPassword: 'newpassword123',
      }).success,
    ).toBe(true)
  })
})

describe('auth server action login', () => {
  beforeEach(() => {
    authApi.signInEmail.mockReset()
    authApi.getSession.mockReset()
    authApi.signOut.mockReset()
  })

  it('returns validation error for invalid login data', async () => {
    const formData = new FormData()
    formData.set('email', 'invalid-email')
    formData.set('password', 'pw')

    await expect(login(undefined, formData)).resolves.toBe('email.invalid')
  })

  it('submits valid credentials to the auth api', async () => {
    authApi.signInEmail.mockResolvedValue({ redirect: false })

    const formData = new FormData()
    formData.set('email', 'john@example.com')
    formData.set('password', 'password123')

    await expect(login(undefined, formData)).resolves.toBeUndefined()
    expect(authApi.signInEmail).toHaveBeenCalledWith({
      body: {
        email: 'john@example.com',
        password: 'password123',
      },
    })
  })
})
