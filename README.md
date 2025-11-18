# SignBuddy Frontend

This is the frontend for the SignBuddy sign language learning application.

## Features Implemented

1. **Chapter-based Learning System**
   - Arc-style chapter selection interface
   - Progressive unlocking of chapters (complete one to unlock the next)
   - Visual indicators for locked, unlocked, and completed chapters

2. **Cloudinary Integration**
   - Fetch sign language assets from Cloudinary folders
   - Display assets in a grid layout for each chapter
   - Environment variable configuration for API keys

3. **Progress Tracking**
   - In-memory progress tracking service
   - Chapter completion status with visual indicators
   - Automatic unlocking of subsequent chapters

## File Structure

```
app/
  (tabs)/           # Main tab navigation
    index.tsx       # Home screen with chapter selection
    practice.tsx    # Practice screen
    dictionary.tsx  # Dictionary screen
    profile.tsx     # User profile screen
  learn/            # Chapter learning screens
    [chapterId].tsx # Dynamic route for individual chapters
  _layout.tsx       # Root layout configuration

services/
  cloudinary.jsx        # Cloudinary API integration
  chapterProgress.ts    # Chapter progress tracking

constants/
  icons.ts              # Icon imports
```

## How to Use

1. **Chapter Selection**
   - Tap on unlocked chapters (blue circles) to access lessons
   - Locked chapters (gray circles with lock icon) are unlocked after completing the previous chapter
   - Completed chapters show a green checkmark

2. **Learning Chapters**
   - Each chapter displays sign language assets from Cloudinary
   - Complete chapters by tapping the "Complete Chapter" button
   - Completing a chapter unlocks the next one

3. **Testing Cloudinary Connection**
   - Use the "Cloudinary Connection Test" button on the Practice tab to verify the integration

## Environment Variables

The application uses the following environment variables:

- `EXPO_PUBLIC_CLOUD_NAME` - Cloudinary cloud name
- `EXPO_PUBLIC_API_KEY` - Cloudinary API key
- `EXPO_PUBLIC_API_SECRET` - Cloudinary API secret

## Dependencies

- React Native
- Expo
- Cloudinary
- Axios