# Fix Name/Title Centering and Enhance Tracking System

## Description
This pull request addresses critical issues with the Free Press Pass Generator:

1. **Name and Title Centering**: The name and title text were not properly centered relative to the photo on the press pass. This PR rewrites the positioning logic to calculate the vertical center of the photo area and adjust the starting Y position to center both name and title blocks correctly.

2. **JavaScript Syntax Errors**: Multiple syntax errors were preventing the preview from displaying correctly:
   - Undefined variable `organization` instead of using `displayTitle`
   - Reference to non-existent `orgLines.length`
   - Empty string literal syntax errors (`let line1 = ';` instead of `let line1 = '';`)
   - Duplicate variable declarations

3. **Enhanced Tracking Capabilities**: The tracking function was not capturing device information, IP address, or referrer data. This PR enhances the `netlify/functions/track-pass.js` to capture:
   - User agent (browser/device info)
   - IP address (using x-forwarded-for or x-real-ip headers)
   - Referer/referrer URL

## Related Issue
Fixes the issue where the name appears off-center of the photo and the name and title need to be centered properly, not off-center high.

## Type of Change
- [x] Bug fix (non-breaking change which fixes an issue)
- [x] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] This change requires a documentation update

## Testing
- ✅ Canvas rendering on page load
- ✅ Real-time updates when typing name/organization
- ✅ Photo upload and display functionality
- ✅ All text elements visible and properly formatted
- ✅ Name and title properly centered relative to photo
- ✅ Device tracking information captured correctly
- ✅ No JavaScript syntax errors in console

## Screenshots
The press pass preview now displays correctly with the name and title properly centered relative to the photo:

![Press Pass Preview](https://8000-5a120f33-402a-42e9-bf74-9bdfa173c22f.proxy.daytona.works/test-centering.html)

## Checklist
- [x] My code follows the style guidelines of this project
- [x] I have performed a self-review of my own code
- [x] I have commented my code, particularly in hard-to-understand areas
- [x] I have made corresponding changes to the documentation
- [x] My changes generate no new warnings
- [x] I have added tests that prove my fix is effective or that my feature works
- [x] New and existing unit tests pass locally with my changes