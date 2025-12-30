# Testing Checklist - Admin Persistence & Content Fixes

Use this checklist to verify all changes are working correctly after Supabase setup.

## Prerequisites
- [ ] Supabase project created and configured
- [ ] Database tables created (`site_config`, `site_config_versions`, `content_items`)
- [ ] Storage bucket `site-assets` created (private)
- [ ] Environment variables set in production:
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `JWT_SECRET` (strong random value)

## Admin Dashboard Tests

### Storage Status Banner
- [ ] Open `/admin` and log in
- [ ] Verify storage status banner appears below header
- [ ] Banner should show **green** with "Storage: Supabase" (not yellow/red)
- [ ] If yellow/red, check environment variables are set correctly

### Admin Save Persistence (Issue A - PDF + 9 navy sections)
- [ ] Navigate to **Footer** tab
- [ ] Change "Brand name" to a test value (e.g., "Test Brand")
- [ ] Click "Save Footer"
- [ ] Wait for save confirmation
- [ ] **Refresh the page** (F5 or Cmd+R)
- [ ] Verify "Brand name" still shows "Test Brand" (persisted)
- [ ] Navigate to **Pages** tab
- [ ] Select a page (e.g., "Why money triggers anxiety")
- [ ] Edit the "Title" field
- [ ] Click "Save Changes"
- [ ] **Refresh the page**
- [ ] Verify title change persisted
- [ ] Navigate to **Documents** tab
- [ ] Upload a test PDF (use "Replace file" for Privacy Policy)
- [ ] Click "Save" after upload
- [ ] **Refresh the page**
- [ ] Verify PDF URL is still present and file is accessible

### Blog Article Creation (Issue B - 404 fix)
- [ ] Navigate to **Blog & Videos** tab (Content tab)
- [ ] Scroll to "Articles" section
- [ ] Enter a new article title (e.g., "Test Article")
- [ ] Enter a description
- [ ] Click "Create Draft"
- [ ] Click "Edit" on the new article
- [ ] Add some MDX content in the editor
- [ ] Click "Save"
- [ ] Click "View" link (or manually navigate to `/blog/test-article`)
- [ ] **Verify the page loads** (no 404 error)
- [ ] Verify content displays correctly
- [ ] Edit the article again, change content
- [ ] Save and verify changes appear immediately on the public page

### Footer Content Editing (Issue C)
- [ ] Navigate to **Footer** tab
- [ ] Verify all fields are editable:
  - [ ] Brand name
  - [ ] Tagline
  - [ ] Quick Links (can add/remove)
  - [ ] Contact info (phone, email)
  - [ ] Social links
  - [ ] Copyright text
  - [ ] Company name
  - [ ] Acknowledgement text
- [ ] Make changes to multiple fields
- [ ] Click "Save Footer"
- [ ] Visit homepage and scroll to footer
- [ ] Verify all changes appear on the live site

### Secure Checkout Content Editing (Issue E)
- [ ] Navigate to **Consultations** tab
- [ ] Scroll to "Scheduler helper copy" card
- [ ] Verify all fields are present:
  - [ ] Eyebrow text
  - [ ] Title
  - [ ] Intro paragraph
  - [ ] Bullet points (3)
  - [ ] Help text
  - [ ] Primary button label
  - [ ] Email button label
  - [ ] Receipt note
  - [ ] Embed toggle label
  - [ ] Embed fallback text
- [ ] Edit "Title" field (e.g., "Book Your Appointment")
- [ ] Edit "Primary button label" (e.g., "Open Scheduler")
- [ ] Click "Save Scheduler Copy"
- [ ] Visit `/bookings` page
- [ ] Scroll to "Secure checkout" section
- [ ] Verify title and button label match your edits

### "Book a consultation" Label (Issue D)
- [ ] Visit homepage (`/`)
- [ ] Verify hero CTA button says "Book a consultation" (not "Book a Session")
- [ ] Scroll to "Important Links" section
- [ ] Verify button under navy buttons says "Book a consultation"
- [ ] Visit `/bookings` page
- [ ] Verify booking option buttons say "Book this consultation"
- [ ] Visit any content section page (e.g., `/content-sections/why-money-triggers-anxiety`)
- [ ] Verify CTA button says "Book a consultation"
- [ ] Visit any blog post (e.g., `/blog/why-money-triggers-anxiety`)
- [ ] Verify CTA button says "Book a consultation"
- [ ] Visit other pages (About, Financial Abuse, etc.)
- [ ] Verify all CTAs say "Book a consultation"

## Upload Tests

### PDF Upload
- [ ] In Admin, go to **Documents** tab
- [ ] Click "Replace file" for Privacy Policy
- [ ] Select a PDF file
- [ ] Wait for upload confirmation
- [ ] Verify the returned URL starts with `/api/assets/`
- [ ] Click "View file" link
- [ ] Verify PDF opens correctly in browser
- [ ] **Refresh admin page**
- [ ] Verify PDF URL is still present

### Image Upload
- [ ] In Admin, go to **Images** tab
- [ ] Upload a test image
- [ ] Verify URL is returned (starts with `/api/assets/`)
- [ ] Open the URL in a new tab
- [ ] Verify image displays correctly
- [ ] **Refresh admin page**
- [ ] Verify image is still listed

## Content Section Pages (9 navy buttons)

- [ ] Visit homepage
- [ ] Scroll to "Important Links" section
- [ ] Verify all 9 navy buttons are present
- [ ] Click each button and verify:
  - [ ] Page loads (no 404)
  - [ ] Content displays correctly
  - [ ] "Book a consultation" button is present
- [ ] In Admin, edit content for one of these pages
- [ ] Save changes
- [ ] Visit the page on the live site
- [ ] Verify changes appear immediately

## Mobile & Desktop Testing

- [ ] Test on mobile device/browser:
  - [ ] Homepage loads correctly
  - [ ] Footer displays properly
  - [ ] Booking page is usable
  - [ ] Admin dashboard is functional
- [ ] Test on desktop:
  - [ ] All pages render correctly
  - [ ] Admin editing works smoothly
  - [ ] Uploads function properly

## Edge Cases

- [ ] Create a blog post with a slug that already exists → verify it updates, not duplicates
- [ ] Upload a very large file (>10MB) → verify error handling
- [ ] Try to save admin changes while logged out → verify redirect to login
- [ ] Edit footer, don't save, refresh → verify changes are lost (expected)
- [ ] Edit footer, save, then revert → verify reverts to last saved state

## Final Verification

- [ ] All admin saves persist after refresh
- [ ] All uploads are accessible via `/api/assets/...`
- [ ] New blog posts load immediately (no redeploy needed)
- [ ] All "Book a Session" text changed to "Book a consultation"
- [ ] Footer content is fully editable
- [ ] Secure checkout section is fully editable
- [ ] Storage status banner shows "Supabase" (green)
- [ ] No console errors in browser dev tools
- [ ] No 404 errors when navigating site

## If Something Fails

1. **Saves not persisting:**
   - Check storage status banner (should be green/Supabase)
   - Verify environment variables are set
   - Check browser console for errors
   - Check Supabase dashboard for data in `site_config` table

2. **Uploads failing:**
   - Verify `site-assets` bucket exists in Supabase Storage
   - Check bucket is private (not public)
   - Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
   - Check browser network tab for upload request errors

3. **Blog posts still 404:**
   - Verify blog route uses `dynamic = 'force-dynamic'`
   - Check that post exists in Supabase `content_items` table
   - Clear Next.js cache if using ISR

4. **"Book a consultation" not appearing:**
   - Check that default config was updated
   - Verify page components use the config value, not hardcoded text
   - Clear browser cache

