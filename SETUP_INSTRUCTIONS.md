# Free Press Pass Generator - Setup Instructions

## Recent Updates & Fixes

### 1. Fixed Press Pass Preview Issue
**Problem:** The press pass preview was not displaying due to JavaScript errors.

**Fixes Applied:**
- Fixed undefined `organization` variable (changed to `displayTitle`)
- Fixed JavaScript syntax errors with empty string literals
- Removed reference to undefined `orgLines.length`
- Ensured proper canvas rendering on page load

**Result:** The preview now displays correctly and updates in real-time as users type.

---

### 2. Enhanced Database Tracking

**New Fields Added to `press_passes` table:**
- `user_agent` - Captures browser and device information
- `ip_address` - Captures user's IP address
- `referer` - Captures the referring URL

**Database Schema:**
```sql
CREATE TABLE press_passes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  email TEXT NOT NULL,
  pass_number TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  referer TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**To Update Your Supabase Database:**
1. Go to your Supabase project
2. Navigate to SQL Editor
3. Run the following migration:

```sql
-- Add new columns if they don't exist
ALTER TABLE press_passes 
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS referer TEXT;
```

---

### 3. Enhanced Admin Dashboard

**New Features:**
- **Real-time Search:** Filter passes by name, email, pass number, or title
- **Date Filtering:** View passes from today, this week, this month, this year, or all time
- **Sortable Columns:** Click any column header to sort (ascending/descending)
- **Export to CSV:** Download filtered data as CSV file
- **Enhanced Statistics:**
  - Total Passes
  - Passes This Month
  - Unique Email Domains
  - Today's Passes
- **Device Information:** See what browser/OS each pass was generated from
- **IP Address Tracking:** View the IP address of each pass generation

**Admin Access:**
- URL: `/admin.html`
- Default credentials:
  - Username: `admin`
  - Password: `freepresspass2025`

**⚠️ IMPORTANT:** Change the default password in `login.html` before deploying to production!

---

## Environment Variables Required

Make sure these are set in your Netlify environment:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

---

## Testing the Fixes Locally

1. **Start a local server:**
   ```bash
   python3 -m http.server 8080
   ```

2. **Open in browser:**
   ```
   http://localhost:8080
   ```

3. **Test the preview:**
   - Enter a name in the "Full Name" field
   - The preview should update immediately on the right side
   - Enter an organization name to see it displayed
   - Upload a photo to see it in the preview

4. **Test admin dashboard:**
   - Navigate to `http://localhost:8080/login.html`
   - Login with default credentials
   - View statistics and pass data
   - Test search, filter, sort, and export features

---

## Deployment Checklist

- [ ] Update Supabase database schema with new columns
- [ ] Set environment variables in Netlify
- [ ] Change default admin password in `login.html`
- [ ] Test press pass generation
- [ ] Test admin dashboard functionality
- [ ] Verify tracking data is being saved correctly

---

## Files Modified

1. **index.html** - Fixed JavaScript errors in drawPass function
2. **netlify/functions/track-pass.js** - Added device and IP tracking
3. **admin.html** - Complete redesign with enhanced features
4. **admin.js** - Added search, filter, sort, and export functionality

---

## Security Recommendations

1. **Admin Authentication:**
   - Current implementation uses localStorage (client-side only)
   - For production, implement proper server-side authentication
   - Consider using Supabase Auth or another authentication service

2. **Password Security:**
   - Change the default admin password immediately
   - Use environment variables for credentials
   - Implement password hashing

3. **API Security:**
   - The current CORS settings allow all origins (`*`)
   - Update to specific domains in production
   - Implement rate limiting to prevent abuse

---

## Support

For issues or questions, please create an issue in the GitHub repository.