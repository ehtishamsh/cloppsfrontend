-- Clopps Database Schema
-- Based on Frontend Architecture and Requirements

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_role AS ENUM ('marketplace', 'cosigner', 'staff', 'buyer');
CREATE TYPE event_status AS ENUM ('Draft', 'Scheduled', 'Live', 'Paused', 'Ended', 'Closed', 'Cancelled', 'Archived');
CREATE TYPE enrollment_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE item_status AS ENUM ('active', 'sold', 'passed', 'withdrawn');
CREATE TYPE invoice_status AS ENUM ('Pending', 'Paid');

-- 1. Users Table
-- Central authentication table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Marketplaces Table
-- Stores marketplace entity details. Linked to a user (owner).
CREATE TABLE marketplaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL, -- Business email
    phone VARCHAR(50),
    website VARCHAR(255),
    
    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    
    -- Settings
    tax_rate DECIMAL(5, 2) DEFAULT 0.00,
    commission_rate DECIMAL(5, 2) DEFAULT 0.00,
    buyers_premium DECIMAL(5, 2) DEFAULT 0.00,
    logo_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Cosigner Profiles Table
-- Extended profile for users with 'cosigner' role
CREATE TABLE cosigner_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nickname VARCHAR(100), -- Dealer Nickname
    
    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_user_cosigner UNIQUE (user_id)
);

-- 4. Events Table
-- Core event management
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    marketplace_id UUID NOT NULL REFERENCES marketplaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    status event_status DEFAULT 'Draft',
    batch_number VARCHAR(50), -- Assigned when event is posted
    
    -- Cached stats (optional, but useful for lists)
    items_count INTEGER DEFAULT 0,
    total_sales DECIMAL(12, 2) DEFAULT 0.00,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Event Enrollments Table
-- Links Cosigners to Events
CREATE TABLE event_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    cosigner_id UUID NOT NULL REFERENCES cosigner_profiles(id) ON DELETE CASCADE,
    status enrollment_status DEFAULT 'pending',
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT unique_event_cosigner UNIQUE (event_id, cosigner_id)
);

-- 6. Auction Items / Lots Table
-- Items for sale in an event
CREATE TABLE auction_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    cosigner_id UUID NOT NULL REFERENCES cosigner_profiles(id) ON DELETE CASCADE, -- Seller
    
    lot_number VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Pricing
    reserve_price DECIMAL(12, 2),
    sold_price DECIMAL(12, 2),
    
    -- Buyer Info
    buyer_number VARCHAR(50),
    buyer_name VARCHAR(100), -- Manual entry or lookup
    
    category VARCHAR(100), -- For reports (e.g. Automobiles, Jewelry)
    
    status item_status DEFAULT 'active',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure unique lot number per event
    CONSTRAINT unique_event_lot UNIQUE (event_id, lot_number)
);

-- 7. Invoices Table
-- Generated for Cosigners after event
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) NOT NULL,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    cosigner_id UUID NOT NULL REFERENCES cosigner_profiles(id) ON DELETE CASCADE,
    
    -- Financials snapshot
    lots_sold INTEGER DEFAULT 0,
    total_sales DECIMAL(12, 2) NOT NULL,
    commission_amount DECIMAL(12, 2) NOT NULL,
    tax_amount DECIMAL(12, 2) NOT NULL,
    total_due DECIMAL(12, 2) NOT NULL,
    
    status invoice_status DEFAULT 'Pending',
    pdf_url TEXT, -- Link to stored PDF
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_event_cosigner_invoice UNIQUE (event_id, cosigner_id)
);

-- 8. Marketplace Cosigners
-- Manages the relationship between a marketplace and a cosigner (e.g. approved list)
CREATE TABLE marketplace_cosigners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    marketplace_id UUID NOT NULL REFERENCES marketplaces(id) ON DELETE CASCADE,
    cosigner_id UUID NOT NULL REFERENCES cosigner_profiles(id) ON DELETE CASCADE,
    
    status VARCHAR(50) DEFAULT 'active', -- active, pending, blocked
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_marketplace_cosigner UNIQUE (marketplace_id, cosigner_id)
);

-- 9. Event Bidders
-- Registered bidders for an event
CREATE TABLE event_bidders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Optional link to user account
    
    bidder_number VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_event_bidder_number UNIQUE (event_id, bidder_number)
);

-- 10. Item Images
-- Multiple images per auction item
CREATE TABLE item_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES auction_items(id) ON DELETE CASCADE,
    
    url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_events_marketplace ON events(marketplace_id);
CREATE INDEX idx_events_dates ON events(start_date, end_date);
CREATE INDEX idx_items_event ON auction_items(event_id);
CREATE INDEX idx_enrollments_cosigner ON event_enrollments(cosigner_id);
CREATE INDEX idx_marketplace_cosigners_mp ON marketplace_cosigners(marketplace_id);
CREATE INDEX idx_event_bidders_event ON event_bidders(event_id);
CREATE INDEX idx_item_images_item ON item_images(item_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_marketplaces_modtime BEFORE UPDATE ON marketplaces FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_cosigners_modtime BEFORE UPDATE ON cosigner_profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_events_modtime BEFORE UPDATE ON events FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_items_modtime BEFORE UPDATE ON auction_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_marketplace_cosigners_modtime BEFORE UPDATE ON marketplace_cosigners FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Stored Procedures

-- 1. Calculate Event Totals
-- Updates the cached stats on the events table based on auction_items
CREATE OR REPLACE FUNCTION calculate_event_totals(p_event_id UUID)
RETURNS VOID AS $$
DECLARE
    v_items_count INTEGER;
    v_total_sales DECIMAL(12, 2);
BEGIN
    -- Calculate totals from active/sold items
    SELECT 
        COUNT(*),
        COALESCE(SUM(sold_price), 0)
    INTO 
        v_items_count,
        v_total_sales
    FROM auction_items
    WHERE event_id = p_event_id
    AND status != 'withdrawn';

    -- Update the event record
    UPDATE events
    SET 
        items_count = v_items_count,
        total_sales = v_total_sales,
        updated_at = NOW()
    WHERE id = p_event_id;
END;
$$ LANGUAGE plpgsql;

-- 2. Generate Invoices
-- Generates or updates invoices for all cosigners in an event
CREATE OR REPLACE FUNCTION generate_invoices(p_event_id UUID)
RETURNS VOID AS $$
DECLARE
    v_event_record RECORD;
    v_marketplace_record RECORD;
    v_cosigner_record RECORD;
    v_items_sold INTEGER;
    v_sales_total DECIMAL(12, 2);
    v_commission DECIMAL(12, 2);
    v_tax DECIMAL(12, 2);
    v_total_due DECIMAL(12, 2);
    v_invoice_number VARCHAR(50);
BEGIN
    -- Get Event and Marketplace details for rates
    SELECT * INTO v_event_record FROM events WHERE id = p_event_id;
    SELECT * INTO v_marketplace_record FROM marketplaces WHERE id = v_event_record.marketplace_id;

    -- Loop through all cosigners with items in this event
    FOR v_cosigner_record IN 
        SELECT DISTINCT cosigner_id 
        FROM auction_items 
        WHERE event_id = p_event_id
    LOOP
        -- Calculate stats for this cosigner
        SELECT 
            COUNT(*),
            COALESCE(SUM(sold_price), 0)
        INTO 
            v_items_sold,
            v_sales_total
        FROM auction_items
        WHERE event_id = p_event_id 
        AND cosigner_id = v_cosigner_record.cosigner_id
        AND status = 'sold';

        IF v_items_sold > 0 THEN
            -- Calculate financials
            v_commission := v_sales_total * (v_marketplace_record.commission_rate / 100);
            v_tax := v_sales_total * (v_marketplace_record.tax_rate / 100);
            v_total_due := v_sales_total - v_commission; -- Net to cosigner (usually tax is collected from buyer, but logic varies)

            -- Generate Invoice Number (Simple format: INV-{EventID}-{CosignerID})
            v_invoice_number := 'INV-' || substring(p_event_id::text, 1, 8) || '-' || substring(v_cosigner_record.cosigner_id::text, 1, 4);

            -- Insert or Update Invoice
            INSERT INTO invoices (
                invoice_number, event_id, cosigner_id, 
                lots_sold, total_sales, commission_amount, tax_amount, total_due, 
                status
            ) VALUES (
                v_invoice_number, p_event_id, v_cosigner_record.cosigner_id,
                v_items_sold, v_sales_total, v_commission, v_tax, v_total_due,
                'Pending'
            )
            ON CONFLICT (event_id, cosigner_id) DO UPDATE SET
                lots_sold = EXCLUDED.lots_sold,
                total_sales = EXCLUDED.total_sales,
                commission_amount = EXCLUDED.commission_amount,
                tax_amount = EXCLUDED.tax_amount,
                total_due = EXCLUDED.total_due,
                updated_at = NOW();
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 3. Register Bidder
-- Registers a bidder and assigns the next available paddle number
CREATE OR REPLACE FUNCTION register_bidder(
    p_event_id UUID,
    p_first_name VARCHAR,
    p_last_name VARCHAR,
    p_email VARCHAR,
    p_phone VARCHAR
) RETURNS VARCHAR AS $$
DECLARE
    v_next_number INTEGER;
    v_bidder_number VARCHAR;
BEGIN
    -- Find the next available bidder number for this event
    SELECT COALESCE(MAX(CAST(bidder_number AS INTEGER)), 100) + 1
    INTO v_next_number
    FROM event_bidders
    WHERE event_id = p_event_id
    AND bidder_number ~ '^[0-9]+$'; -- Only consider numeric paddle numbers

    v_bidder_number := v_next_number::TEXT;

    INSERT INTO event_bidders (
        event_id, bidder_number, first_name, last_name, email, phone
    ) VALUES (
        p_event_id, v_bidder_number, p_first_name, p_last_name, p_email, p_phone
    );

    RETURN v_bidder_number;
END;
$$ LANGUAGE plpgsql;

-- 4. Record Sale Transaction
-- Handles the sale of an item, ensuring data consistency and updating totals
CREATE OR REPLACE FUNCTION record_sale_transaction(
    p_event_id UUID,
    p_lot_number VARCHAR,
    p_buyer_number VARCHAR,
    p_sold_price DECIMAL,
    p_buyer_name VARCHAR DEFAULT NULL
) RETURNS VOID AS $$
DECLARE
    v_item_id UUID;
    v_current_status item_status;
BEGIN
    -- Check if item exists and get current status
    SELECT id, status INTO v_item_id, v_current_status
    FROM auction_items
    WHERE event_id = p_event_id AND lot_number = p_lot_number;

    -- Check if event is closed/posted
    IF EXISTS (SELECT 1 FROM events WHERE id = p_event_id AND status = 'Closed') THEN
        RAISE EXCEPTION 'Cannot record sale: Event is closed/posted';
    END IF;

    IF v_item_id IS NULL THEN
        RAISE EXCEPTION 'Item with lot number % not found in event %', p_lot_number, p_event_id;
    END IF;

    IF v_current_status = 'sold' THEN
        RAISE EXCEPTION 'Item % is already sold', p_lot_number;
    END IF;

    -- Update item
    UPDATE auction_items
    SET 
        status = 'sold',
        sold_price = p_sold_price,
        buyer_number = p_buyer_number,
        buyer_name = p_buyer_name,
        updated_at = NOW()
    WHERE id = v_item_id;

    -- Trigger event total recalculation
    PERFORM calculate_event_totals(p_event_id);
END;
$$ LANGUAGE plpgsql;

-- 5. Request Cosigner Enrollment
-- Handles enrollment requests, preventing duplicates
CREATE OR REPLACE FUNCTION request_cosigner_enrollment(
    p_event_id UUID,
    p_cosigner_id UUID
) RETURNS VOID AS $$
BEGIN
    -- Insert if not exists
    INSERT INTO event_enrollments (event_id, cosigner_id, status)
    VALUES (p_event_id, p_cosigner_id, 'pending')
    ON CONFLICT (event_id, cosigner_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- 6. Get Marketplace Dashboard Stats
-- Aggregates high-level stats for the dashboard
CREATE OR REPLACE FUNCTION get_marketplace_dashboard_stats(p_marketplace_id UUID)
RETURNS TABLE (
    total_revenue DECIMAL,
    active_events BIGINT,
    total_sales_count BIGINT,
    active_cosigners BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        -- Total Revenue (sum of all event sales)
        COALESCE(SUM(e.total_sales), 0) as total_revenue,
        
        -- Active Events (Scheduled or Live)
        COUNT(CASE WHEN e.status IN ('Scheduled', 'Live') THEN 1 END) as active_events,
        
        -- Total Sales Count (sum of items sold across all events)
        COALESCE(SUM(e.items_count), 0) as total_sales_count, -- Approximation using items_count, ideally should be sold count
        
        -- Active Cosigners (count of approved cosigners for this marketplace)
        (SELECT COUNT(*) FROM marketplace_cosigners mc WHERE mc.marketplace_id = p_marketplace_id AND mc.status = 'active') as active_cosigners
    FROM events e
    WHERE e.marketplace_id = p_marketplace_id;
END;
$$ LANGUAGE plpgsql;

-- 7. Update Event Status
-- Updates event status and triggers side effects (like invoice generation on close)
CREATE OR REPLACE FUNCTION update_event_status(
    p_event_id UUID,
    p_new_status event_status
) RETURNS VOID AS $$
BEGIN
    UPDATE events
    SET status = p_new_status, updated_at = NOW()
    WHERE id = p_event_id;

    -- If closing the event, generate invoices automatically
    IF p_new_status = 'Closed' THEN
        -- Assign Batch Number (BATCH-{Date}-{EventID})
        UPDATE events 
        SET batch_number = 'BATCH-' || to_char(NOW(), 'YYYYMMDD') || '-' || substring(p_event_id::text, 1, 4)
        WHERE id = p_event_id;

        PERFORM generate_invoices(p_event_id);
    END IF;
END;
$$ LANGUAGE plpgsql;
