# Deployment & Admin Setup Guide

Complete guide to deploy Wide Spectrum Productions website and set up the CMS admin panel.

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

#### Step 1: Push to GitHub
```bash
git add .
git commit -m "Initial commit - Wide Spectrum Productions"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/wide-spectrum-productions.git
git push -u origin main
```

#### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "Add New Project"
4. Import your repository
5. Configure environment variables (see below)
6. Click "Deploy"

#### Step 3: Configure Environment Variables in Vercel
Go to Project Settings → Environment Variables and add:

```
VITE_SUPABASE_URL=https://bvdndbrstjpzxrchftcj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2ZG5kYnJzdGpwenhyY2hmdGNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5OTEwNjEsImV4cCI6MjA5NTU2NzA2MX0.hp8bMpta9I9bf7UvHJToQP4XTpKwdb0UuGnrexBcNaE
```

---

### Option 2: Netlify

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your `dist/` folder OR connect GitHub
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables

---

### Option 3: Manual Deployment

```bash
npm run build
# Upload contents of dist/ folder to any static hosting
```

---

## 🔐 Setting Up Admin Access

### Step 1: Create Admin User in Supabase

#### Method A: Using Supabase Dashboard (Recommended)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Users**
4. Click **Add user** → **Create new user**
5. Enter:
   - Email: `admin@widespectrumproductions.com`
   - Password: `YourSecurePassword123!`
   - Auto Confirm User: ✅ ON

6. Go to **SQL Editor** and run:

```sql
-- Get the user ID from auth.users first
SELECT id, email FROM auth.users WHERE email = 'admin@widespectrumproductions.com';

-- Insert into admin_users (replace with actual user ID)
INSERT INTO admin_users (id, email, password_hash, name, role, is_active)
VALUES (
  'USER_ID_FROM_ABOVE',
  'admin@widespectrumproductions.com',
  '', -- Password is managed by Supabase Auth
  'Admin',
  'admin',
  true
);

-- Alternative: Just match by email
INSERT INTO admin_users (email, password_hash, name, role, is_active)
SELECT 
  email,
  '', -- Password managed by Supabase
  'Admin',
  'admin',
  true
FROM auth.users 
WHERE email = 'admin@widespectrumproductions.com';
```

#### Method B: Using Edge Function (Automated)

I'll create a setup script to automate this process.

### Step 2: Login to Admin Panel

1. Visit: `https://your-domain.com/admin/login`
2. Enter credentials:
   - Email: `admin@widespectrumproductions.com`
   - Password: `YourSecurePassword123!`
3. You'll be redirected to the admin dashboard

---

## 🎯 Using the CMS Admin Panel

### Dashboard Overview
After login, you'll see:
- **Statistics**: Total services, portfolio items, testimonials, contacts
- **Recent Contacts**: Latest contact form submissions
- **Unread Messages Alert**: Notification of new contacts

### Managing Services
1. Click **Services** in sidebar
2. **Add Service**: Click "+ Add Service" button
   - Title: Service name
   - Description: Detailed description
   - Icon: Select from dropdown
   - Features: Add key features (Enter to add)
   - Featured: Check to highlight
   - Display Order: Sort order (1, 2, 3...)
   - Active: Toggle visibility

3. **Edit Service**: Click pencil icon
4. **Delete Service**: Click trash icon
5. **Reorder**: Change display order number

### Managing Portfolio Videos
1. Click **Portfolio** in sidebar
2. **Add Video**: Click "+ Add Video"
   - YouTube ID: Copy from URL (e.g., `dQw4w9WgXcQ`)
   - Title: Video title
   - Artist: Artist name
   - Category: Music/Film/Commercial
   - Featured: Check to highlight
   - Display Order: Sort order

3. **Thumbnail Preview**: Auto-generated from YouTube
4. **Edit/Delete**: Same as services

### Managing Contact Submissions
1. Click **Contacts** in sidebar
2. **View All Submissions**: Listed with status
3. **Filter**: New / Read / Replied / Archived
4. **Search**: Search by name, email, message
5. **View Details**: Click on submission
6. **Actions**:
   - Mark as Read
   - Mark as Replied
   - Archive
   - Reply via Email (opens email client)
7. **Status Badges**:
   - 🟢 New (teal)
   - 🔵 Read (blue)
   - 🟢 Replied (green)
   - ⚫ Archived (gray)

---

## 🔧 Advanced Configuration

### Update Admin Layout
File: `src/layouts/AdminLayout.tsx`

```typescript
const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Services', href: '/admin/services', icon: Briefcase },
  { name: 'Portfolio', href: '/admin/portfolio', icon: Video },
  { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
  { name: 'Contacts', href: '/admin/contacts', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];
```

### Add New Admin Pages
1. Create new page in `src/pages/admin/YourPage.tsx`
2. Add route in `src/main.tsx`:
```typescript
<Route path="your-page" element={<YourPage />} />
```
3. Add navigation item in AdminLayout

---

## 🛡️ Security Best Practices

### 1. Strong Password
Use a strong password for admin accounts:
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- Not easily guessable

### 2. Regular Backups
Backup your Supabase database:
```bash
# In Supabase Dashboard → Database → Backups
# Or use: pg_dump via command line
```

### 3. Monitor Access
Check admin_users table regularly:
```sql
SELECT * FROM admin_users ORDER BY created_at DESC;
```

### 4. Revoke Access
If needed, deactivate an admin:
```sql
UPDATE admin_users 
SET is_active = false 
WHERE email = 'admin@example.com';
```

---

## 📧 Email Notifications (Optional)

### Enable Email Notifications for New Contacts

1. Get a Resend API key from [resend.com](https://resend.com)
2. Add to Supabase Edge Function secrets:
```bash
# Supabase Dashboard → Edge Functions → Secrets
RESEND_API_KEY=re_xxxxxxxxx
```

3. Uncomment email code in `supabase/functions/cms-auth/index.ts`

---

## 🔍 Troubleshooting

### Cannot Login
**Problem**: Login button doesn't work
**Solution**: Check browser console for errors, verify Supabase config

### "Access Denied" Error
**Problem**: "Admin privileges required" message
**Solution**: Ensure user exists in both `auth.users` AND `admin_users` tables

### Database Errors
**Problem**: "relation does not exist"
**Solution**: Run migration again or check RLS policies

### White Screen
**Problem**: Admin page shows white screen
**Solution**: 
- Clear browser cache
- Check build logs
- Verify environment variables

### Contact Form Not Saving
**Problem**: Submissions not appearing
**Solution**: 
- Check Edge Function logs
- Verify database table exists
- Check RLS policies allow inserts

---

## 📱 Mobile Access

The admin panel is fully responsive and works on mobile devices:
- Collapsible sidebar
- Touch-friendly buttons
- Responsive tables

---

## 🔄 Content Workflow

### Adding New Content
1. Login to admin panel
2. Navigate to relevant section
3. Click "Add" button
4. Fill in details
5. Set "Active" = true
6. Click "Save"
7. Content appears on website immediately

### Updating Existing Content
1. Find the item in list
2. Click pencil icon
3. Make changes
4. Click "Save"
5. Changes reflect instantly

### Hiding Content (Without Deleting)
1. Edit the item
2. Uncheck "Active"
3. Click "Save"
4. Content is hidden but preserved

---

## 📊 Database Management

### View All Tables
```sql
-- Services
SELECT * FROM services WHERE is_active = true ORDER BY display_order;

-- Portfolio
SELECT * FROM portfolio_items WHERE is_active = true ORDER BY display_order;

-- Testimonials
SELECT * FROM testimonials WHERE is_active = true ORDER BY display_order;

-- Contacts
SELECT * FROM contact_submissions ORDER BY created_at DESC;
```

### Bulk Updates
```sql
-- Mark all old contacts as archived
UPDATE contact_submissions 
SET status = 'archived' 
WHERE created_at < NOW() - INTERVAL '30 days' 
AND status = 'read';

-- Feature multiple services
UPDATE services 
SET is_featured = true 
WHERE title IN ('Music Production', 'Mixing', 'Mastering');
```

---

## ✅ Deployment Checklist

Before going live:

- [ ] Environment variables set in Vercel/Netlify
- [ ] Admin user created in Supabase
- [ ] Test login at `/admin/login`
- [ ] Add services content
- [ ] Add portfolio videos
- [ ] Add testimonials
- [ ] Test contact form
- [ ] Verify emails are received (if configured)
- [ ] Check mobile responsiveness
- [ ] Set up custom domain
- [ ] Enable SSL/HTTPS
- [ ] Configure backups

---

## 🎉 You're All Set!

Your CMS is now ready for content management:

1. **Deploy** to Vercel/Netlify
2. **Create** admin user in Supabase
3. **Login** at `/admin/login`
4. **Manage** content through the dashboard
5. **Updates appear instantly** on your website

Need help? Check the CMS_DOCUMENTATION.md file or contact support.
