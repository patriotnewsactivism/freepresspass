# Free Press Pass Generator - Bug Fixes

This document provides instructions for fixing the issues with the Free Press Pass Generator website deployed at [freepresspass.com](https://freepresspass.com).

## Issues Fixed

1. **Name Update Issue**: The name was not updating on the press pass preview until after clicking the "Generate Press Pass" button. It now updates in real-time as the user types.

2. **Button Text Issues**: 
   - The first button now says "Generate **FREE** Press Pass Now" with "FREE" emphasized
   - The second button now says "Enhanced/Laminated Version $15" instead of "Get Laminated Pass ($10-15)"

3. **Database Integration**: Added the organization field to ensure proper data storage in Supabase.

## Implementation Options

You have three options to implement these fixes:

### Option 1: Use the Deployment Script (Recommended)

1. Upload the `deploy-fixes.sh` script to your server or local development environment
2. Make the script executable:
   ```bash
   chmod +x deploy-fixes.sh
   ```
3. Run the script:
   ```bash
   ./deploy-fixes.sh
   ```
4. The script will:
   - Create backups of your original files
   - Apply all necessary changes to the index.html file
   - Deploy to Netlify if the Netlify CLI is installed

### Option 2: Use the Fixed HTML File

1. Replace your current `index.html` file with the provided `index-fixed.html` file:
   ```bash
   mv index-fixed.html index.html
   ```
2. Deploy the updated file to your hosting provider (Netlify)

### Option 3: Manual Implementation

If you prefer to make the changes manually, follow these steps:

1. **Add Real-time Name Updates**:
   - Add event listeners to the name and title input fields
   - Update the drawPass function to be called whenever these fields change
   - Add the following code after the "Initialize with a sample pass" line:
   ```javascript
   // Add real-time updates for name and title fields
   document.getElementById('name').addEventListener('input', function() {
     const nameValue = this.value.trim();
     const titleValue = document.getElementById('title').value.trim();
     drawPass(nameValue || 'YOUR NAME HERE', titleValue);
   });

   document.getElementById('title').addEventListener('input', function() {
     const nameValue = document.getElementById('name').value.trim();
     const titleValue = this.value.trim();
     drawPass(nameValue || 'YOUR NAME HERE', titleValue);
   });
   ```

2. **Update Button Text**:
   - Change the Generate Press Pass button:
   ```html
   <button type="button" id="generate">Generate <strong>FREE</strong> Press Pass Now</button>
   ```
   - Change the Laminated Pass button:
   ```html
   <button type="button" id="checkout">Enhanced/Laminated Version $15</button>
   ```

3. **Update Database Integration**:
   - Add the organization field to the trackPass function calls:
   ```javascript
   trackPass({
     name: nameInput,
     title: titleInput,
     email: emailInput,
     pass_number: passNumber,
     organization: 'Full Court Press' // Added organization field
   })
   ```

4. **Update FAQ Text**:
   - Change the FAQ text about laminated pass price from "$10-15" to "$15"

## Verification

After implementing the fixes, verify that:

1. The name updates in real-time on the press pass preview as you type
2. The button text has been updated correctly
3. The database is receiving the correct information (check Supabase dashboard)

## Technical Details

### Files Modified

- `index.html` - Main application file with all the fixes

### Key Functions Modified

- Added event listeners to input fields for real-time updates
- Modified button text
- Added organization field to trackPass function calls

## Support

If you encounter any issues implementing these fixes, please contact the development team for assistance.