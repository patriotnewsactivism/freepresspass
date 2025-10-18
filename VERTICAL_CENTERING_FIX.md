# Vertical Centering Fix

## Issue
The name and title were positioned too high on the press pass, not properly centered vertically on the headshot photo.

## Root Cause
The original positioning was using a fixed offset from the top of the photo:
```javascript
let yPos = photoY + 25;
```

This didn't account for the height of the name/title blocks, causing them to appear higher than the visual center of the photo.

## Solution
I've adjusted the positioning calculation to properly center the name and title vertically on the headshot:

1. Calculate the vertical center of the photo area:
   ```javascript
   const photoCenterY = photoY + (photoH / 2);
   ```

2. Calculate the height needed for the name block:
   ```javascript
   let nameBlockHeight = nameParts.length * 28;
   ```

3. Position the name/title block at the photo center with a small adjustment:
   ```javascript
   let yPos = photoCenterY - (nameBlockHeight / 2) + 10;
   ```

The +10 adjustment fine-tunes the positioning to account for the title block that appears below the name.

## Result
The name and title are now properly vertically centered on the headshot photo, creating a more balanced and professional appearance.

## Testing
You can test the fix at: https://8000-5a120f33-402a-42e9-bf74-9bdfa173c22f.proxy.daytona.works