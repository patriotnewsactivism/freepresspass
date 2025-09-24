# Free Press Pass Generator Implementation Guide

This guide explains the changes made to improve the Free Press Pass Generator application.

## Changes Overview

1. **Organization Name Display Fix**
   - Modified the `drawPass` function to limit organization name to maximum 2 lines
   - Implemented intelligent text wrapping for organization names

2. **Save to Camera Roll Functionality**
   - Added a new "Save to Camera Roll" button
   - Implemented device-specific handling for iOS/Android
   - Created user-friendly instructions for saving to camera roll

3. **Database Tracking Improvements**
   - Added `download_type` field to track different types of downloads
   - Set contact email to `press@freepresspass.com`
   - Enhanced tracking for all download types (download, open, camera roll)

4. **UI Improvements**
   - Added styling for the new "Save to Camera Roll" button
   - Created mobile-specific styling for better user experience
   - Added overlay for iOS camera roll saving

## Implementation Steps

### 1. Update the drawPass Function

Replace the existing `drawPass` function in `index.html` with the one from `modified-drawpass.js`. This new function:

- Limits organization name to a maximum of 2 lines
- Intelligently splits text to create balanced lines
- Handles single long words by hyphenating them if necessary

### 2. Add Save to Camera Roll Button

Add the new button and its functionality by inserting the code from `modified-index.html` into the appropriate sections of `index.html`:

1. Add the new button to the actions div:
```html
<div class="actions">
  <button id="download">Download</button>
  <button id="openImage">Open Image</button>
  <button id="saveToCamera">Save to Camera Roll</button>
</div>
```

2. Add the JavaScript event handlers for the new button and update the existing ones to track downloads.

### 3. Update the Database Schema

Run the SQL migration script `20250924_update_press_passes_table.sql` to add the new fields to the database:

- `download_type`: Tracks the type of download (download, open, camera_roll)
- `contact_email`: Sets the contact email to press@freepresspass.com

### 4. Update the API and Backend

1. Replace `api.js` with `modified-api.js` to include the download_type parameter in the trackPass function.
2. Replace `netlify/functions/track-pass.js` with `modified-track-pass.js` to handle the new fields.

### 5. Add CSS Styling

Add the styles from `modified-styles.css` to the existing `styles.css` file to style the new button and overlay.

## Testing

After implementing these changes, test the following:

1. **Organization Name Display**
   - Test with short organization names (should display on one line)
   - Test with medium organization names (should display on one or two lines)
   - Test with very long organization names (should be limited to two lines)

2. **Save to Camera Roll**
   - Test on iOS devices (should show overlay with instructions)
   - Test on Android devices (should download directly)
   - Test on desktop browsers (should download directly)

3. **Database Tracking**
   - Verify that all download types are tracked correctly
   - Check that the contact email is set correctly
   - Ensure all user information is saved properly

## Troubleshooting

### Organization Name Display Issues
- If text appears too small, adjust the font size in the drawPass function
- If text still overflows, adjust the maxWidth calculation

### Save to Camera Roll Issues
- On iOS, if the overlay doesn't appear, check for JavaScript errors
- On Android, if the download doesn't work, try using the standard download button
- If tracking fails, check the Supabase connection and credentials

### Database Issues
- Verify that the Supabase URL and service role key are set correctly
- Check that the press_passes table has the new columns
- Look for errors in the Netlify function logs

## Conclusion

These improvements enhance the Free Press Pass Generator by:
1. Making organization names more readable and professional
2. Adding a convenient way to save passes to camera roll on mobile devices
3. Improving tracking of pass usage
4. Setting the correct contact email

All changes maintain backward compatibility with existing functionality while adding new features.