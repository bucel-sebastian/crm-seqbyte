# Project Overview

This project is a CRM and invoicing application built with Next.js App Router, Prisma, Better Auth, and shadcn/ui.

## Main Areas

- Authentication routes live under `src/app/(auth)`.
- The dashboard shell and shared navigation live under `src/app/dashboard` and `src/components`.
- API routes are under `src/app/api`.
- Server-side business logic lives under `src/server`.

## Dashboard Routes

- `src/app/dashboard/page.tsx` - dashboard home.
- `src/app/dashboard/clients` - client list and create pages.
- `src/app/dashboard/companies` - company list and create pages.
- `src/app/dashboard/finances/invoices` - invoice list and create pages.
- `src/app/dashboard/finances/series` - invoice series list and create pages.

## Invoice Creation Flow

The invoice create page uses shadcn components and includes:

- Select fields for company, client, and invoice series.
- A row-based products table with add/remove actions.
- Product fields for name, description, unit of measurement, quantity, and unit price.
- A computed row total price for each product line.
- A payment term input in days that automatically updates the due date.
- A due date field that can also back-calculate the payment term.

## Product Units

The unit of measurement select currently offers:

- Oră
- Zi
- Lună
- Serviciu (Serv)
- Bucată (Buc)

The default value is Bucată (Buc).

## Notes

- Invoice products are validated as an array and sent to the API as structured data.
- Quantities and unit prices allow negative values where needed.
- The docs folder now includes this markdown overview alongside the legacy RTF report.
