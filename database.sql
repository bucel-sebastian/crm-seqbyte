-- Users table
CREATE TABLE crm_users (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    role VARCHAR(50) NOT NULL,
    is_primary_account BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)

-- Password recovery tokens table
CREATE TABLE crm_password_recovery_tokens (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES crm_users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)

-- Companies table
CREATE TABLE crm_companies (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    vat VARCHAR(15) NOT NULL,
    no_reg_com VARCHAR(25) NOT NULL,
    country VARCHAR(50) NOT NULL,
    county VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    bank_name VARCHAR(255),
    bank_iban VARCHAR(255),
    establishment_date DATE,
    owner UUID NOT NULL REFERENCES crm_users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)

-- Clients table
CREATE TABLE crm_clients (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    vat VARCHAR(15) NOT NULL,
    no_reg_com VARCHAR(25) NOT NULL,
    country VARCHAR(50) NOT NULL,
    county VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    bank_name VARCHAR(255),
    bank_iban VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)

-- Invoices series table 
CREATE TABLE crm_invoices_series (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    company UUID NOT NULL REFERENCES crm_companies(id) ON DELETE SET NULL,
    prefix VARCHAR(10) NOT NULL,
    starting_number VARCHAR(30) NOT NULL DEFAULT '1',
    actual_number VARCHAR(30) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)

-- Invoices table
CREATE TABLE crm_invoices (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    company UUID NOT NULL REFERENCES crm_companies(id),
    client UUID NOT NULL REFERENCES crm_clients(id),
    author UUID NOT NULL REFERENCES crm_users(id),
    date_of_issue DATE NOT NULL,
    currency VARCHAR(15) NOT NULL DEFAULT 'RON',
    vat_rate INT NOT NULL DEFAULT 0,
    exchange_rate NUMERIC(10,6),
    payment_term DATE,
    series UUID NOT NULL REFERENCES crm_invoices_series(id),
    number VARCHAR(30) NOT NULL,
    products JSONB NOT NULL,
    total_without_vat NUMERIC(10, 2) NOT NULL,
    vat_value NUMERIC(10, 2) NOT NULL,
    total NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)

-- Recieps table
CREATE TABLE crm_recieps (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    company UUID NOT NULL REFERENCES crm_companies(id),
)

-- Activity log
CREATE TABLE crm_activity_log (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES crm_users(id),
    type VARCHAR(255) NOT NULL, 
    action VARCHAR(255) NOT NULL, -- Exemplu: 'Created invoice', 'Updated client'
    details TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);