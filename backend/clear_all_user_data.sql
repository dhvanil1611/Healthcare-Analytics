-- Script to clear all user data from the healthcare database
-- This will delete all user-related data including:
-- - Users table (main user accounts)
-- - Predictions table (diabetes risk assessments)
-- - Appointments table (doctor appointments)
-- - Reports table (medical reports)
-- - Health metrics table (health tracking data)
-- - Chatbot logs table (AI chat history)
-- - Reviews table (hospital reviews)

-- WARNING: This will permanently delete ALL user data!
-- Make sure you have backups before running this script.

-- Start transaction
BEGIN;

-- Delete data from all user-related tables in order of dependencies
-- (child tables first, then parent tables)

-- Delete chatbot logs (depends on users)
DELETE FROM chatbot_logs;

-- Delete health metrics (depends on users)
DELETE FROM health_metrics;

-- Delete predictions (depends on users)
DELETE FROM predictions;

-- Delete appointments (depends on users)
DELETE FROM appointments;

-- Delete reports (depends on users)
DELETE FROM reports;

-- Delete reviews (depends on users)
DELETE FROM reviews;

-- Finally delete users (main table)
DELETE FROM users;

-- Reset auto-increment sequences (if any)
-- This is mainly for tables that might have serial columns
-- ALTER SEQUENCE IF EXISTS users_id_seq RESTART WITH 1;

-- Commit the transaction
COMMIT;

-- Verify data deletion
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

-- Print completion message
SELECT 'All user data has been successfully cleared from the database.' as status;
