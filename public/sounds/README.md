# 🎵 Aurora Breathing - Ambient Audio Files

This directory contains ambient soundscapes for the Aurora Breathing Experience.

## Required Files

Add these three MP3 files to this directory:

1. **`ocean.mp3`** - Ocean waves, gentle tide sounds (Ocean Calm)
2. **`forest.mp3`** - Forest ambience, birdsong, rustling leaves (Forest Pulse)
3. **`wind.mp3`** - Mountain wind, light breeze (Mountain Air)

## Audio Specifications

### Recommended Settings:
- **Format:** MP3
- **Bitrate:** 128-192 kbps (balance between quality and file size)
- **Sample Rate:** 44.1 kHz
- **Duration:** 3-5 minutes (loops automatically)
- **Volume:** Normalized to -6 dB to -3 dB (prevents clipping)
- **Fade:** Smooth loop points for seamless playback

### File Sizes:
- Target: 3-5 MB per file
- Maximum: 10 MB per file

## Where to Find Ambient Sounds

### Free Sources:
1. **Freesound.org** - https://freesound.org
   - Search: "ocean waves loop", "forest ambient", "wind ambience"
   - Filter: CC0 or CC-BY licenses

2. **Pixabay Audio** - https://pixabay.com/music/
   - Search: "nature sounds", "ambient"
   - All files are royalty-free

3. **Zapsplat** - https://www.zapsplat.com
   - Free with attribution
   - High-quality nature sounds

4. **YouTube Audio Library** - https://studio.youtube.com/channel/UC.../music
   - Filter by "Ambient" category
   - Download as MP3

### Premium Sources:
1. **Epidemic Sound** - https://www.epidemicsound.com
2. **AudioJungle** - https://audiojungle.net
3. **Pond5** - https://www.pond5.com

## Alternative: Firebase Storage

If you prefer **cloud hosting** instead of bundling files:

### Upload to Firebase Storage:

```bash
# Install Firebase CLI (if not already)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Upload files
firebase storage:upload ocean.mp3 gs://your-project-id.appspot.com/sounds/ocean.mp3
firebase storage:upload forest.mp3 gs://your-project-id.appspot.com/sounds/forest.mp3
firebase storage:upload wind.mp3 gs://your-project-id.appspot.com/sounds/wind.mp3
```

### Update Component:

Replace the `SOUNDS` constant in `AuroraBreathing.jsx`:

```javascript
const SOUNDS = {
  ocean: "https://firebasestorage.googleapis.com/v0/b/YOUR-PROJECT-ID.appspot.com/o/sounds%2Focean.mp3?alt=media",
  forest: "https://firebasestorage.googleapis.com/v0/b/YOUR-PROJECT-ID.appspot.com/o/sounds%2Fforest.mp3?alt=media",
  wind: "https://firebasestorage.googleapis.com/v0/b/YOUR-PROJECT-ID.appspot.com/o/sounds%2Fwind.mp3?alt=media"
};
```

## Testing

### Browser Console Test:

```javascript
const audio = new Audio('/sounds/ocean.mp3');
audio.play(); // Should play ocean sounds
audio.pause(); // Should stop
```

### Check File Path:

1. Visit: `http://localhost:3000/sounds/ocean.mp3`
2. Should download/play the file
3. If 404: file is missing or path is wrong

## Troubleshooting

### "Audio failed to load" Error:
- Check file paths match exactly (case-sensitive)
- Verify files are in `public/sounds/` directory
- Clear browser cache (Cmd+Shift+R on Mac)
- Check browser console for CORS errors

### No Sound Playing:
- Check browser audio permissions
- Verify volume is not muted (both browser and system)
- Check if autoplay is blocked (requires user interaction first)
- Try different browser (Safari has stricter autoplay policies)

### Choppy Playback:
- Reduce file size (lower bitrate)
- Ensure smooth loop points in audio file
- Check CPU usage (too many particles/animations)

## Notes

- Files in `public/` directory are **copied to build folder** during `npm run build`
- Reference them with `/sounds/filename.mp3` (leading slash is important)
- Audio starts playing when session begins (if sound toggle is ON)
- Loops automatically until session ends
- Users can switch between sounds mid-session via dropdown

## Current Status

⚠️ **Audio files not yet added** - Add the three MP3 files listed above to enable ambient audio.

Until then, the component will show **console warnings** but will function without audio.

---

**Created:** November 11, 2025  
**Updated for:** Aurora Breathing Experience v2.0  
**Component:** `src/features/recovery/tools/AuroraBreathing.jsx`
