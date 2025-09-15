# Database Integration Setup Guide

This guide provides step-by-step instructions for setting up the Supabase database integration for the Free Press Pass Generator.

## 1. Create a Supabase Project

1. Sign up for a free account at [Supabase](https://supabase.com/)
2. Create a new project
3. Note your project URL and API keys (found in Project Settings > API)

## 2. Set Up Database Schema

### Option 1: Using the Migration Script

1. Navigate to the SQL Editor in your Supabase dashboard
2. Copy the contents of `supabase/migrations/20250908172116_init_press_passes.sql`
3. Paste into the SQL Editor and run the script

### Option 2: Manual Table Creation

1. Navigate to the Table Editor in your Supabase dashboard
2. Create a new table called `press_passes` with the following columns:

| Column Name | Type | Default | Constraints |
|-------------|------|---------|-------------|
| id | bigint | generated always as identity | primary key |
| pass_number | uuid | gen_random_uuid() | not null, unique |
| full_name | text | | not null |
| email | text | | not null |
| title | text | | |
| organization | text | | |
| issued_at | timestamptz | now() | not null |
| revoked | boolean | false | not null |
| revoked_at | timestamptz | | |
| notes | text | | |
| paid | boolean | false | |
| payment_pending | boolean | false | |
| payment_id | text | | |
| payment_amount | integer | | |
| payment_date | timestamptz | | |

3. Add a check constraint on the email column:
   ```sql
   alter table press_passes add constraint valid_email check (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$');
   ```

## 3. Set Up Row Level Security (RLS)

1. Enable Row Level Security on the `press_passes` table:
   ```sql
   alter table press_passes enable row level security;
   ```

2. Create policies for access control:
   ```sql
   -- Allow insert of press passes
   create policy "Allow insert of press passes" on press_passes
     for insert
     to authenticated
     with check (auth.jwt() ->> 'email' = email);

   -- Admin can view all press passes
   create policy "Admin can view all press passes" on press_passes
     for select
     to authenticated
     using (exists (select 1 where auth.jwt() ->> 'role' = 'admin'));

   -- Admin can update press passes
   create policy "Admin can update press passes" on press_passes
     for update
     to authenticated
     using (exists (select 1 where auth.jwt() ->> 'role' = 'admin'));
   ```

## 4. Create an Admin User

1. Navigate to Authentication > Users in your Supabase dashboard
2. Invite a new user or create one directly
3. Set their role to 'admin' using custom claims:
   ```sql
   update auth.users
   set raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'
   where email = 'admin@example.com';
   ```

## 5. Configure Environment Variables

1. Copy your Supabase URL and keys from Project Settings > API
2. Add them to your `.env` file:
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   ```

3. If deploying to Netlify, add these environment variables in the Netlify dashboard

## 6. Test the Database Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Generate a test press pass
3. Check your Supabase table to verify the record was created

## 7. Monitoring and Maintenance

### Database Monitoring

1. Set up database alerts in Supabase for:
   - High disk usage
   - Connection limits
   - Error rates

### Regular Maintenance

1. Periodically review and clean up old or invalid records
2. Check for database performance issues
3. Update RLS policies as needed

## 8. Backup Strategy

1. Export your database regularly:
   ```bash
   pg_dump -h db.your-project-id.supabase.co -U postgres -d postgres > backup.sql
   ```

2. Store backups securely in multiple locations

## 9. Troubleshooting Common Issues

### Connection Issues

- Verify your Supabase URL and API keys
- Check network connectivity
- Ensure your IP is not blocked by Supabase

### Permission Errors

- Verify RLS policies are correctly configured
- Check user roles and permissions
- Ensure you're using the correct API key for the operation

### Data Validation Errors

- Check that your data meets all constraints
- Verify email format is valid
- Ensure required fields are provided

## 10. Advanced Configuration

### Adding Indexes for Performance

```sql
-- Add index on email for faster lookups
CREATE INDEX idx_press_passes_email ON press_passes(email);

-- Add index on issued_at for date range queries
CREATE INDEX idx_press_passes_issued_at ON press_passes(issued_at);
```

### Setting Up Database Functions

```sql
-- Function to get monthly statistics
CREATE OR REPLACE FUNCTION get_monthly_stats(year_input int, month_input int)
RETURNS TABLE (
  total_passes bigint,
  paid_passes bigint,
  unique_emails bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) as total_passes,
    COUNT(*) FILTER (WHERE paid = true) as paid_passes,
    COUNT(DISTINCT email) as unique_emails
  FROM press_passes
  WHERE 
    EXTRACT(YEAR FROM issued_at) = year_input AND
    EXTRACT(MONTH FROM issued_at) = month_input;
END;
$$ LANGUAGE plpgsql;
```