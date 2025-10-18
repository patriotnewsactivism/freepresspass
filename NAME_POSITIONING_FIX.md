# Name Positioning Fix

## Issue
The name was appearing above center on the photo instead of being properly centered.

## Root Cause
The positioning calculation in the `drawPass` function had an arbitrary -30px offset:

```javascript
let yPos = photoCenterY - (nameBlockHeight / 2) - 30;
```

This was pushing the name 30 pixels above the actual center of the photo.

## Solution
I've adjusted the positioning calculation to properly center both the name and title within the photo area:

1. Calculate the height of the title block (approximately 2 lines of 20px each = 40px)
2. Calculate the total height of both name and title blocks plus the gap between them
3. Position the entire block at the photo center:

```javascript
// Also account for title height (approximately 2 lines of 20px each)
let titleBlockHeight = 40;
let totalBlockHeight = nameBlockHeight + 5 + titleBlockHeight; // 5px gap between name and title
let yPos = photoCenterY - (totalBlockHeight / 2);
```

## Result
The name and title are now properly centered within the photo area, creating a more balanced and professional appearance for the press pass.

## Testing
You can test the fix at: https://8000-5a120f33-402a-42e9-bf74-9bdfa173c22f.proxy.daytona.works