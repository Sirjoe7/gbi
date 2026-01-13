-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  education_level VARCHAR(50) NOT NULL,
  career_stage VARCHAR(50) NOT NULL,
  field_of_study VARCHAR(100) NOT NULL,
  role_type VARCHAR(20) NOT NULL CHECK (role_type IN ('student', 'entrepreneur')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  payment_intent_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  application_status VARCHAR(20) DEFAULT 'pending' CHECK (application_status IN ('pending', 'accepted', 'rejected', 'waitlisted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('cv', 'passport', 'certificate', 'motivation_essay')),
  file_url VARCHAR(500) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  location VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event registrations
CREATE TABLE event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  registration_status VARCHAR(20) DEFAULT 'registered' CHECK (registration_status IN ('registered', 'cancelled', 'attended')),
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_payment_status ON users(payment_status);
CREATE INDEX idx_users_application_status ON users(application_status);
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_event_registrations_user_id ON event_registrations(user_id);

-- RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Documents policies
CREATE POLICY "Users can view own documents" ON documents FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can upload own documents" ON documents FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own documents" ON documents FOR DELETE USING (auth.uid()::text = user_id::text);

-- Events are publicly readable
CREATE POLICY "Events are publicly readable" ON events FOR SELECT USING (is_active = true);

-- Event registrations policies
CREATE POLICY "Users can view own event registrations" ON event_registrations FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can create own event registrations" ON event_registrations FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Admin policy (you'll need to create an admin role or check)
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (EXISTS (
  SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.email = 'admin@gbi.global'
));
CREATE POLICY "Admins can update all users" ON users FOR UPDATE USING (EXISTS (
  SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.email = 'admin@gbi.global'
));
