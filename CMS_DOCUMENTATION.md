# CMS System Documentation

## Overview

A complete Content Management System (CMS) has been built for Wide Spectrum Productions, allowing administrators to manage website content through a secure admin dashboard.

---

## Features

### Admin Dashboard
- **Dashboard Overview** - View statistics, recent contacts, and quick stats
- **Services Management** - Add, edit, delete, and reorder services
- **Portfolio Management** - Manage YouTube video portfolio with thumbnails
- **Testimonials Management** - Manage client testimonials
- **Contact Management** - View, filter, and manage contact submissions
- **Settings** - Site configuration (future feature)

### Authentication
- Secure admin login with Supabase Auth
- Role-based access (admin, editor, viewer)
- Session management
- Auto-logout functionality

---

## Database Schema

### Tables Created

1. **admin_users** - Admin user accounts
   - id, email, password_hash, name, role, is_active, last_login

2. **services** - Service offerings
   - id, title, description, icon_name, features (JSONB), is_featured, display_order, is_active

3. **portfolio_items** - Portfolio videos
   - id, youtube_id, title, artist, description, category, display_order, is_featured, view_count

4. **testimonials** - Client testimonials
   - id, text, client_name, client_role, rating, display_order

5. **contact_submissions** - Contact form entries
   - id, name, email, phone, service, message, status, notes, created_at

6. **site_settings** - Global settings
   - id, key, value (JSONB), description

7. **collaborators** - Featured collaborators
   - id, name, profession, image_url, bio

8. **about_content** - About section content
   - id, section, title, content, images (JSONB)

---

## Admin Routes

| Route | Description |
|-------|-------------|
| `/admin/login` | Admin login page |
| `/admin/dashboard` | Dashboard overview |
| `/admin/services` | Manage services |
| `/admin/portfolio` | Manage portfolio videos |
| `/admin/testimonials` | Manage testimonials |
| `/admin/contacts` | Manage contact submissions |
| `/admin/settings` | Site settings |

---

## Accessing the CMS

### Development
```bash
npm run dev
# Navigate to http://localhost:3000/admin/login
```

### Production
```
https://yourdomain.com/admin/login
```

---

## Creating an Admin User

### Option 1: Direct Database Insert
```sql
INSERT INTO admin_users (email, password_hash, name, role)
VALUES (
  'admin@example.com',
  '$2a$10$...", -- bcrypt hash
  'Admin Name',
  'admin'
);
```

### Option 2: Use Supabase Dashboard
1. Go to Supabase Dashboard → Authentication
2. Create new user
3. Add entry to admin_users table

---

## Contact Form Integration

The contact form now saves submissions to the database AND sends email notifications.

### Flow:
1. User fills out contact form on website
2. Form data is sent to Edge Function
3. Data is saved to `contact_submissions` table
4. Email notification is sent (if Resend API key configured)
5. Admin views submission in CMS dashboard

---

## Edge Functions

### cms-auth
- **Path**: `/functions/v1/cms-auth`
- **Endpoints**:
  - `POST /contact` - Submit contact form
  - `GET /contacts` - Get all contacts (admin)

### send-contact-email
- **Path**: `/functions/v1/send-contact-email`
- **Purpose**: Send email notifications (backup)

---

## Security

### Row Level Security (RLS)
- All tables have RLS enabled
- Public can read active content
- Only authenticated users can write

### Authentication Required
- All CMS pages protected
- Session validation on each request
- Auto-redirect to login if unauthorized

---

## API Endpoints

### Contact Submission
```javascript
POST /functions/v1/cms-auth/contact
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "service": "Music Production",
  "message": "I'd like to discuss a project"
}
```

### Get Contacts (Admin)
```javascript
GET /functions/v1/cms-auth/contacts
Authorization: Bearer <token>
```

---

## File Structure

```
src/
├── layouts/
│   └── AdminLayout.tsx       # Admin layout with sidebar
├── pages/
│   └── admin/
│       ├── AdminLogin.tsx    # Login page
│       ├── AdminDashboard.tsx # Dashboard home
│       ├── ServicesPage.tsx  # Services management
│       ├── PortfolioPage.tsx # Portfolio management
│       └── ContactsPage.tsx # Contact management
├── types/
│   └── database.ts           # Database types
└── lib/
    └── supabase.ts           # Supabase client
```

---

## Environment Variables

```env
# Required
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Optional
VITE_SENTRY_DSN=your_sentry_dsn
RESEND_API_KEY=your_resend_key
```

---

## Future Enhancements

1. **WYSIWYG Editor** - Rich text editing for content
2. **Media Library** - Image management
3. **User Management** - Add/edit admin users
4. **Analytics Dashboard** - View statistics
5. **Backup/Export** - Data backup functionality
6. **Audit Log** - Track changes
7. **Bulk Actions** - Bulk edit/delete
8. **Email Templates** - Customizable notifications

---

## Troubleshooting

### Cannot access admin panel
- Check if Supabase Auth is configured
- Verify admin_users table has correct entry
- Check browser console for errors

### Contact form not saving
- Check Edge Function deployment
- Verify database migrations ran
- Check RLS policies

### Login not working
- Verify Supabase credentials
- Check if user exists in auth.users
- Verify admin_users table entry

---

## Support

For issues or questions, contact the development team.
