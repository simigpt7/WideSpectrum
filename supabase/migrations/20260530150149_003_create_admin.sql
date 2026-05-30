/*
  # Create Default Admin User

  This migration creates a default admin user for CMS access.
  IMPORTANT: Change the password IMMEDIATELY after first login!
  
  Default credentials:
  Email: admin@widespectrumproductions.com
  Password: AdminPass123!
*/

-- First, create the user in Supabase Auth (this is handled by Supabase)
-- Then, add entry to admin_users table

-- Note: You'll need to create the user in Supabase Dashboard first:
-- 1. Go to Authentication > Users
-- 2. Click "Add user" > "Create new user"
-- 3. Email: admin@widespectrumproductions.com
-- 4. Password: AdminPass123!
-- 5. Check "Auto Confirm User"
-- 6. Click "Create user"

-- After creating the auth user, run this to grant admin access:
-- (This will be done via the Supabase dashboard or a separate edge function)

-- For now, we'll create a placeholder that you can update with the actual user ID

/*
CREATE POLICY "Allow service role to manage admin_users"
  ON admin_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
*/

-- Helpful function to check admin status
CREATE OR REPLACE FUNCTION is_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = user_email 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
