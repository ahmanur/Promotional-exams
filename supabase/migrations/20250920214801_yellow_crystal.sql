/*
  # Seed Initial Data for CBN Promotion Exam Hub

  1. Insert sample departments and directorates
  2. Insert sample discussion groups
  3. Insert sample admin user
  
  This migration populates the database with initial data to match the existing mock data structure.
*/

-- Insert departments organized by directorates
INSERT INTO departments (id, name, description, directorate) VALUES
-- Banking Operations Directorate
('hrd', 'Human Resources Department', 'Manages staff recruitment, training, and welfare', 'Banking Operations'),
('msd', 'Medical Services Department', 'Provides healthcare services to CBN staff', 'Banking Operations'),
('csd', 'Corporate Services Department', 'Handles corporate governance and administrative services', 'Banking Operations'),
('cod', 'Currency Operations Department', 'Manages currency design, production, and distribution', 'Banking Operations'),
('itd', 'Information Technology Department', 'Manages IT infrastructure and digital services', 'Banking Operations'),

-- Banking Services Directorate
('bksd', 'Banking and Payments System Department', 'Oversees banking operations and payment systems', 'Banking Services'),
('gvd', 'Governor''s Department', 'Supports the Governor''s office and strategic initiatives', 'Banking Services'),
('psmd', 'Payment System Management Department', 'Develops and manages payment system policies', 'Banking Services'),
('cdd', 'Capacity Development Department', 'Provides training and capacity building programs', 'Banking Services'),

-- Development Finance Directorate
('dfd', 'Development Finance Department', 'Manages development finance initiatives and interventions', 'Development Finance'),
('cpd', 'Consumer Protection Department', 'Ensures consumer protection in financial services', 'Development Finance'),

-- Monetary Policy Directorate
('mpd', 'Monetary Policy Department', 'Formulates and implements monetary policy', 'Monetary Policy'),

-- Other Directorates
('pssd', 'Procurement and Support Services Department', 'Manages procurement and facility services', 'Support Services'),
('fmd', 'Financial Markets Department', 'Oversees financial market development and operations', 'Financial Markets'),
('rmd', 'Risk Management Department', 'Manages enterprise risk and business continuity', 'Risk Management'),
('ofisd', 'Other Financial Institutions Supervision Department', 'Supervises non-bank financial institutions', 'Financial System Stability'),
('std', 'Statistics Department', 'Compiles and analyzes economic and financial statistics', 'Research'),
('fprd', 'Financial Policy and Regulation Department', 'Develops financial sector policies and regulations', 'Financial System Stability'),
('lsd', 'Legal Services Department', 'Provides legal advisory and litigation services', 'Legal'),
('ssd', 'Security Services Department', 'Ensures security of CBN facilities and operations', 'Security'),
('iad', 'Internal Audit Department', 'Conducts internal audits and compliance reviews', 'Audit'),
('bod', 'Branch Operations Department', 'Manages CBN branch operations nationwide', 'Operations'),
('fnd', 'Finance Department', 'Manages CBN''s financial operations and reporting', 'Finance'),
('smd', 'Strategy Management Department', 'Develops and monitors CBN''s strategic plans', 'Strategy'),
('red', 'Research and External Reserves Department', 'Manages external reserves and conducts economic research', 'Research'),
('bsd', 'Banking Supervision Department', 'Supervises commercial banks and merchant banks', 'Financial System Stability'),
('ccd', 'Corporate Communications Department', 'Manages CBN''s internal and external communications', 'Communications'),
('ted', 'Trade and Exchange Department', 'Manages foreign exchange operations and trade finance', 'Trade and Exchange'),
('rsd', 'Research and Statistics Department', 'Conducts economic research and statistical analysis', 'Research')
ON CONFLICT (id) DO NOTHING;

-- Insert discussion groups
INSERT INTO discussion_groups (id, name) VALUES
('general', 'General Discussion'),
('exam-prep', 'Exam Preparation'),
('study-groups', 'Study Groups'),
('announcements', 'Announcements')
ON CONFLICT (id) DO NOTHING;

-- Insert a sample admin user (this would typically be done through Supabase Auth)
-- Note: In production, users should be created through Supabase Auth, not directly in the database
INSERT INTO users (id, name, email, role, department) VALUES
('admin-001', 'System Administrator', 'admin@cbn.gov.ng', 'Admin', 'Information Technology Department')
ON CONFLICT (email) DO NOTHING;