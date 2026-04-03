-- Manual SQL commands to clear all user data
-- Run these commands directly in your PostgreSQL database

-- Step 1: Connect to your database
-- psql -h localhost -U postgres -d healthcare

-- Step 2: Run these commands in order

-- Delete chatbot logs first (child table)
DELETE FROM chatbot_logs;

-- Delete health metrics
DELETE FROM health_metrics;

-- Delete predictions
DELETE FROM predictions;

-- Delete appointments
DELETE FROM appointments;

-- Delete reports
DELETE FROM reports;

-- Delete reviews
DELETE FROM reviews;

-- Finally delete users (parent table)
DELETE FROM users;

-- Step 3: Verify all data is cleared
SELECT 'Users' as table_name, COUNT(*) as remaining_records FROM users
UNION ALL
SELECT 'Predictions' as table_name, COUNT(*) as remaining_records FROM predictions
UNION ALL
SELECT 'Appointments' as table_name, COUNT(*) as remaining_records FROM appointments
UNION ALL
SELECT 'Reports' as table_name, COUNT(*) as remaining_records FROM reports
UNION ALL
SELECT 'Health Metrics' as table_name, COUNT(*) as remaining_records FROM health_metrics
UNION ALL
SELECT 'Chatbot Logs' as table_name, COUNT(*) as remaining_records FROM chatbot_logs
UNION ALL
SELECT 'Reviews' as table_name, COUNT(*) as remaining_records FROM reviews;

-- Step 4: Clear uploaded files manually
-- Delete all files in the backend/uploads directory
