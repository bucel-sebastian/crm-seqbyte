import { beforeEach, describe, expect, it, vi } from 'vitest'

const transactionMock = vi.hoisted(() => ({
  invoice: {
    create: vi.fn(),
  },
  invoiceSeries: {
    update: vi.fn(),
  },
}))

const prismaMock = vi.hoisted(() => ({
  company: {
    findUnique: vi.fn(),
    create: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  client: {
    findUnique: vi.fn(),
    create: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  invoiceSeries: {
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  invoice: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    delete: vi.fn(),
  },
  $transaction: vi.fn(),
}))

vi.mock('@/lib/db', () => ({
  prisma: prismaMock,
}))

import { companyService } from '@/server/services/company'
import { clientService } from '@/server/services/client'
import { invoiceSeriesService } from '@/server/services/invoice-series'
import { invoiceService } from '@/server/services/invoice'

function resetPrismaMocks() {
  for (const model of [prismaMock.company, prismaMock.client, prismaMock.invoiceSeries, prismaMock.invoice]) {
    for (const fn of Object.values(model)) {
      fn.mockReset()
    }
  }

  prismaMock.$transaction.mockReset()
  transactionMock.invoice.create.mockReset()
  transactionMock.invoiceSeries.update.mockReset()
}

describe('company service', () => {
  beforeEach(() => {
    resetPrismaMocks()
  })

  it('creates a company when VAT is unique', async () => {
    prismaMock.company.findUnique.mockResolvedValue(null)
    prismaMock.company.create.mockResolvedValue({ id: 'company-1', vat: 'RO123' })

    const result = await companyService.create({
      name: 'Acme SRL',
      vat: 'RO123',
      registrationNumber: 'J12/123/2024',
      country: 'RO',
      county: 'Cluj',
      city: 'Cluj-Napoca',
      ownerId: 'user-1',
    })

    expect(prismaMock.company.findUnique).toHaveBeenCalledWith({ where: { vat: 'RO123' } })
    expect(prismaMock.company.create).toHaveBeenCalledWith({
      data: {
        name: 'Acme SRL',
        vat: 'RO123',
        registrationNumber: 'J12/123/2024',
        country: 'RO',
        county: 'Cluj',
        city: 'Cluj-Napoca',
        ownerId: 'user-1',
      },
    })
    expect(result).toEqual({ id: 'company-1', vat: 'RO123' })
  })

  it('rejects duplicate company VAT values', async () => {
    prismaMock.company.findUnique.mockResolvedValue({ id: 'company-1' })

    await expect(
      companyService.create({
        name: 'Acme SRL',
        vat: 'RO123',
        registrationNumber: 'J12/123/2024',
        country: 'RO',
        county: 'Cluj',
        city: 'Cluj-Napoca',
        ownerId: 'user-1',
      }),
    ).rejects.toThrow('Company with this VAT already exists')
  })

  it('returns paginated companies for an owner', async () => {
    prismaMock.company.findMany.mockResolvedValue([{ id: 'company-1' }])
    prismaMock.company.count.mockResolvedValue(1)

    const result = await companyService.listByOwner('user-1', 2, 5)

    expect(prismaMock.company.findMany).toHaveBeenCalledWith({
      where: { ownerId: 'user-1' },
      skip: 5,
      take: 5,
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { invoices: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    expect(result).toEqual({
      data: [{ id: 'company-1' }],
      total: 1,
      page: 2,
      pageSize: 5,
    })
  })

  it('updates and deletes a company', async () => {
    prismaMock.company.update.mockResolvedValue({ id: 'company-1', name: 'Updated SRL' })
    prismaMock.company.delete.mockResolvedValue({ id: 'company-1' })

    await expect(companyService.update('company-1', { name: 'Updated SRL' } as never)).resolves.toEqual({
      id: 'company-1',
      name: 'Updated SRL',
    })

    await expect(companyService.delete('company-1')).resolves.toEqual({ id: 'company-1' })
  })
})

describe('client service', () => {
  beforeEach(() => {
    resetPrismaMocks()
  })

  it('creates a client when VAT is unique', async () => {
    prismaMock.client.findUnique.mockResolvedValue(null)
    prismaMock.client.create.mockResolvedValue({ id: 'client-1', vat: 'RO456' })

    const result = await clientService.create({
      name: 'Client SRL',
      vat: 'RO456',
      registrationNumber: 'J12/456/2024',
      country: 'RO',
      county: 'Cluj',
      city: 'Cluj-Napoca',
      address: 'Str. Eroilor 1',
    })

    expect(prismaMock.client.findUnique).toHaveBeenCalledWith({ where: { vat: 'RO456' } })
    expect(result).toEqual({ id: 'client-1', vat: 'RO456' })
  })

  it('returns paginated clients', async () => {
    prismaMock.client.findMany.mockResolvedValue([{ id: 'client-1' }])
    prismaMock.client.count.mockResolvedValue(1)

    const result = await clientService.list(3, 10)

    expect(prismaMock.client.findMany).toHaveBeenCalledWith({
      skip: 20,
      take: 10,
      include: {
        _count: {
          select: { invoices: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    expect(result).toEqual({
      data: [{ id: 'client-1' }],
      total: 1,
      page: 3,
      pageSize: 10,
    })
  })

  it('updates and deletes a client', async () => {
    prismaMock.client.update.mockResolvedValue({ id: 'client-1', name: 'Updated Client' })
    prismaMock.client.delete.mockResolvedValue({ id: 'client-1' })

    await expect(clientService.update('client-1', { name: 'Updated Client' } as never)).resolves.toEqual({
      id: 'client-1',
      name: 'Updated Client',
    })

    await expect(clientService.delete('client-1')).resolves.toEqual({ id: 'client-1' })
  })
})

describe('invoice series service', () => {
  beforeEach(() => {
    resetPrismaMocks()
  })

  it('creates a series and uses the starting number for current number', async () => {
    prismaMock.invoiceSeries.findFirst.mockResolvedValue(null)
    prismaMock.invoiceSeries.create.mockResolvedValue({ id: 'series-1', currentNumber: 7 })

    const result = await invoiceSeriesService.create({
      companyId: 'company-1',
      prefix: 'INV',
      startingNumber: 7,
      description: 'Main series',
    })

    expect(prismaMock.invoiceSeries.findFirst).toHaveBeenCalledWith({
      where: { companyId: 'company-1', prefix: 'INV' },
    })
    expect(prismaMock.invoiceSeries.create).toHaveBeenCalledWith({
      data: {
        companyId: 'company-1',
        prefix: 'INV',
        startingNumber: 7,
        currentNumber: 7,
        description: 'Main series',
      },
    })
    expect(result).toEqual({ id: 'series-1', currentNumber: 7 })
  })

  it('rejects duplicate series prefixes for the same company', async () => {
    prismaMock.invoiceSeries.findFirst.mockResolvedValue({ id: 'series-1' })

    await expect(
      invoiceSeriesService.create({
        companyId: 'company-1',
        prefix: 'INV',
      }),
    ).rejects.toThrow('Invoice series with this prefix already exists for the company')
  })

  it('returns paginated invoice series', async () => {
    prismaMock.invoiceSeries.findMany.mockResolvedValue([{ id: 'series-1' }])
    prismaMock.invoiceSeries.count.mockResolvedValue(1)

    const result = await invoiceSeriesService.list(2, 4)

    expect(prismaMock.invoiceSeries.findMany).toHaveBeenCalledWith({
      skip: 4,
      take: 4,
      include: {
        company: {
          select: { id: true, name: true, vat: true },
        },
        _count: {
          select: { invoices: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    expect(result).toEqual({ data: [{ id: 'series-1' }], total: 1, page: 2, pageSize: 4 })
  })

  it('updates and deletes an invoice series', async () => {
    prismaMock.invoiceSeries.update.mockResolvedValue({ id: 'series-1', prefix: 'NEW' })
    prismaMock.invoiceSeries.delete.mockResolvedValue({ id: 'series-1' })

    await expect(invoiceSeriesService.update('series-1', { prefix: 'NEW' } as never)).resolves.toEqual({
      id: 'series-1',
      prefix: 'NEW',
    })

    await expect(invoiceSeriesService.delete('series-1')).resolves.toEqual({ id: 'series-1' })
  })
})

describe('invoice service', () => {
  beforeEach(() => {
    resetPrismaMocks()
    prismaMock.$transaction.mockImplementation(async (callback) =>
      callback(transactionMock as never),
    )
  })

  it('creates an invoice and increments the series counter', async () => {
    prismaMock.invoice.findUnique.mockResolvedValue(null)
    transactionMock.invoice.create.mockResolvedValue({ id: 'invoice-1', invoiceNumber: 'INV-001' })
    transactionMock.invoiceSeries.update.mockResolvedValue({ id: 'series-1' })

    const result = await invoiceService.create({
      companyId: 'company-1',
      clientId: 'client-1',
      seriesId: 'series-1',
      invoiceNumber: 'INV-001',
      dateOfIssue: new Date('2026-05-11'),
      currency: 'RON',
      vatRate: 19,
      exchangeRate: 1,
      products: [{ name: 'Consulting' }],
      totalWithoutVat: 100 as never,
      vatValue: 19 as never,
      total: 119 as never,
      status: 'draft',
    })

    expect(prismaMock.invoice.findUnique).toHaveBeenCalledWith({
      where: {
        seriesId_invoiceNumber: {
          seriesId: 'series-1',
          invoiceNumber: 'INV-001',
        },
      },
    })
    expect(transactionMock.invoice.create).toHaveBeenCalledWith({
      data: {
        companyId: 'company-1',
        clientId: 'client-1',
        seriesId: 'series-1',
        invoiceNumber: 'INV-001',
        dateOfIssue: new Date('2026-05-11'),
        dueDate: undefined,
        currency: 'RON',
        vatRate: 19,
        exchangeRate: 1,
        products: [{ name: 'Consulting' }],
        totalWithoutVat: 100,
        vatValue: 19,
        total: 119,
        status: 'draft',
      },
    })
    expect(transactionMock.invoiceSeries.update).toHaveBeenCalledWith({
      where: { id: 'series-1' },
      data: {
        currentNumber: {
          increment: 1,
        },
      },
    })
    expect(result).toEqual({ id: 'invoice-1', invoiceNumber: 'INV-001' })
  })

  it('rejects duplicate invoice numbers within the same series', async () => {
    prismaMock.invoice.findUnique.mockResolvedValue({ id: 'invoice-1' })

    await expect(
      invoiceService.create({
        companyId: 'company-1',
        clientId: 'client-1',
        seriesId: 'series-1',
        invoiceNumber: 'INV-001',
        dateOfIssue: new Date('2026-05-11'),
        products: [{ name: 'Consulting' }],
        totalWithoutVat: 100 as never,
        vatValue: 19 as never,
        total: 119 as never,
      }),
    ).rejects.toThrow('Invoice number already exists for this series')
  })

  it('returns paginated invoices', async () => {
    prismaMock.invoice.findMany.mockResolvedValue([{ id: 'invoice-1' }])
    prismaMock.invoice.count.mockResolvedValue(1)

    const result = await invoiceService.list(2, 3)

    expect(prismaMock.invoice.findMany).toHaveBeenCalledWith({
      skip: 3,
      take: 3,
      include: {
        company: { select: { id: true, name: true, vat: true } },
        client: { select: { id: true, name: true, vat: true } },
        series: { select: { id: true, prefix: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    expect(result).toEqual({ data: [{ id: 'invoice-1' }], total: 1, page: 2, pageSize: 3 })
  })

  it('deletes an invoice', async () => {
    prismaMock.invoice.delete.mockResolvedValue({ id: 'invoice-1' })

    await expect(invoiceService.delete('invoice-1')).resolves.toEqual({ id: 'invoice-1' })
  })
})
