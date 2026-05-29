-- PostgreSQL Schema for PawPrint

-- Extentsion for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(50),
    password_hash VARCHAR(255),
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    sighting_alerts BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enum Types for Pet Alerts
DO $$ BEGIN
    CREATE TYPE alert_type_enum AS ENUM ('LOST', 'SIGHTING');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE alert_status_enum AS ENUM ('ACTIVE', 'REUNITED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Table: pet_alerts
CREATE TABLE IF NOT EXISTS pet_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    alert_type alert_type_enum NOT NULL,
    status alert_status_enum DEFAULT 'ACTIVE',
    title VARCHAR(255) NOT NULL,
    breed VARCHAR(255),
    description TEXT,
    location_name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    event_time TIMESTAMP WITH TIME ZONE NOT NULL,
    image_url VARCHAR(255),
    reunited_time TIMESTAMP WITH TIME ZONE,
    reunited_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: alert_messages (Chat/Comments)
CREATE TABLE IF NOT EXISTS alert_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID REFERENCES pet_alerts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
