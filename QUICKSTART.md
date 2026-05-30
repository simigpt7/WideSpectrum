# Quick Start Guide - Setup & Deployment

## 🎯 5-Minute Setup

### Step 1: Create Admin User (REQUIRED)

#### Option A: Using Supabase Dashboard (Easiest)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project: `bvdndbrstjpzxrchftcj`

2. **Create Auth User**
   - Navigate to: **Authentication** → **Users**
   - Click: **Add user** → **Create new user**
   - Enter:
     - Email: `admin@widespectrumproductions.com`
     - Password: `AdminPass123!` (change this!)
     - ✅ Auto Confirm User: **ON**
   - Click: **Create user**

3. **Grant Admin Access**
   - Navigate to: **SQL Editor**
   - Click: **New query**
   - Paste this code:

```sql
-- Insert admin user (use the email you created above)
INSERT INTO admin_users (email, password_hash, name, role, is_active)
SELECT 
  email,
  '',  -- Password managed by Supabase Auth
  'Admin',
  'admin',
  true
FROM auth.users 
WHERE email = 'admin@widespectrumproductions.com';

-- Verify it worked
SELECT * FROM admin_users WHERE email = 'admin@widespectrumproductions.com';
```

   - Click: **Run**

---

### Step 2: Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   cd /tmp/cc-agent/67298833/project
   git init
   git add .
   git commit -m "Initial commit - Wide Spectrum Productions"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/wide-spectrum-productions.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to: https://vercel.com
   - Sign up with GitHub
   - Click: **Add New** → **Project**
   - Import your repository
   - Add Environment Variables:
     ```
     VITE_SUPABASE_URL=https://bvdndbrstjpzxrchftcj.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2ZG5kYnJzdGpwenhyY2hmdGNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5OTEwNjEsImV4cCI6MjA5NTU2NzA2MX0.hp8bMpta9I9bf7UvHJToQP4XTpKwdb0UuGnrexBcNaE
     ```
   - Click: **Deploy**

3. **Wait for Deploy** (~2 minutes)

---

### Step 3: Access Admin Panel

1. **Visit Your Site**
   - URL: `https://your-app.vercel.app`
   - Verify website loads correctly

2. **Login to Admin**
   - URL: `https://your-app.vercel.app/admin/login`
   - Email: `admin@widespectrumproductions.com`
   - Password: `AdminPass123!`

3. **Change Password** (IMPORTANT!)
   - After first login, change your password immediately
   - Contact your site administrator for password change

---

## 🎨 Managing Content

### Add/Edit Services
1. Login to admin panel
2. Click **Services** in sidebar
3. Click **+ Add Service**
4. Fill in details:
   - Title: Service name
   - Description: What you offer
   - Icon: Select icon
   - Features: Type and press Enter
   - Featured: Check to highlight
   - Display Order: 1, 2, 3...
5. Click **Save**

### Add Portfolio Videos
1. Click **Portfolio** in sidebar
2. Click **+ Add Video**
3. Get YouTube ID:
   - From URL: `https://youtube.com/watch?v=G-XMiVMlLRI`
   - ID is: `G-XMiVMlLRI`
4. Paste ID, add title/artist
5. Click **Save**

### Manage Contact Submissions
1. Click **Contacts** in sidebar
2. View all submissions
3. Click to view details
4. Use filters: New / Read / Replied / Archived
5. Reply via email or mark status

---

## 📱 Content Already Seeded

Your database already has:

| Type | Count | Items |
|------|-------|-------|
| Services | 8 | Music Production, Mixing, Live Sound, Film Scoring, etc. |
| Portfolio | 9 | Dance Meri Rani, Sin Denim, Skoda Campaign, etc. |
| Testimonials | 6 | Arijit Singh, Tanishk Bagchi, Dhvani Bhanushali, etc. |
| Collaborators | 7 | Bollywood artists & celebrities |

View and edit this content through the admin panel!

---

## ⚠️ Important Security Notes

1. **Change Default Password**
   - Default: `AdminPass123!`
   - Change immediately after first login

2. **Keep Credentials Safe**
   - Never share admin credentials
   - Use strong passwords (12+ chars)

3. **SSL Enabled**
   - Vercel automatically enables HTTPS
   - All connections are encrypted

---

## 🔄 Development Workflow

### Local Development
```bash
npm run dev
# Website: http://localhost:3000
# Admin: http://localhost:3000/admin/login
```

### Build for Production
```bash
npm run build
# Output: dist/ folder
```

### Preview Production Build
```bash
npm run preview
# Runs production build locally
```

---

## 🆘 Troubleshooting

### Can't Login?
- Check email is exactly `admin@widespectrumproductions.com`
- Verify user exists in Supabase Auth
- Check admin_users table has entry
- Clear browser cache

### White Screen?
- Check browser console for errors
- Verify environment variables set
- Ensure build completed successfully

### Content Not Showing?
- Check `is_active` is `true` in database
- Verify content exists in tables
- Check RLS policies

### Contact Form Not Saving?
- Check Edge Function deployment
- Verify database connection
- Check browser console for errors

---

## 📞 Support

- Documentation: `DEPLOYMENT_GUIDE.md`
- CMS Docs: `CMS_DOCUMENTATION.md`
- Database Types: `src/types/database.ts`

---

## ✅ Deployment Checklist

- [ ] Admin user created in Supabase Auth
- [ ] Admin user added to admin_users table
- [ ] Deployed to Vercel/Netlify
- [ ] Environment variables configured
- [ ] Can login to `/admin/login`
- [ ] Default password changed
- [ ] Content visible on website
- [ ] Contact form tested
- [ ] Custom domain configured (optional)

---

**You're ready to go!** 🎉

Your professional music studio website with CMS is now live and ready for content management.
