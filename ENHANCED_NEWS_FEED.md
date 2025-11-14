# Enhanced News Feed Implementation

## Overview
The Enhanced News Feed is a modern, feature-rich news page designed for displaying live, trending, and daily updated wellness news. It provides an engaging user experience with advanced filtering, searching, and categorization capabilities.

## Features Implemented

### 🔴 Live Updates
- **Auto-refresh**: Automatically refreshes news every 30 minutes
- **Live indicator**: Visual indicator showing last update timestamp
- **New content badges**: Articles published within 24 hours display a pulsing "LIVE" badge
- **Real-time status**: Shows connection status and loading states

### 🔥 Trending Section
- **Top 3 trending articles**: Featured in a dedicated trending section
- **View counts**: Simulated engagement metrics for trending content
- **Ranking numbers**: Visual ranking badges (1, 2, 3) for top stories
- **Special styling**: Orange accent colors and hover effects

### 🎯 Category Filtering
- **7 categories**: 
  - All News
  - Wellness (💚)
  - Mental Health (🧠)
  - Recovery (🌱)
  - Community (🤝)
  - Research (🔬)
  - Policy (📋)
- **Smart categorization**: Automatic category detection based on article content
- **Interactive chips**: Clickable category filters with active states

### 🔍 Search & Sort
- **Real-time search**: Search across titles, descriptions, and sources
- **Clear button**: Easy-to-use clear functionality
- **Sort options**:
  - Latest First (default)
  - Trending (by view count)
  - Oldest First
- **Filter count**: Shows number of results after filtering

### 🌟 Featured Article
- **Hero placement**: Top article displayed in large format
- **Split layout**: Image on left, content on right (responsive)
- **Enhanced metadata**: Source, date, read time
- **Hover effects**: Smooth zoom and shadow transitions

### 📱 Responsive Design
- **Mobile-first**: Optimized for all screen sizes
- **Breakpoints**: 
  - Desktop: 1024px+
  - Tablet: 768px - 1023px
  - Mobile: < 768px
- **Touch-friendly**: Large tap targets and swipeable categories
- **Adaptive layouts**: Grid adjusts based on screen size

### 🎨 Modern UI/UX
- **Glass morphism**: Translucent cards with backdrop blur
- **Smooth animations**: Hover states, transitions, and transforms
- **Color scheme**: Matches brand colors (#d4b483 gold accent)
- **Dark theme**: Optimized for dark backgrounds with proper contrast
- **Safari support**: Webkit prefixes for iOS compatibility

## Architecture

### File Structure
```
src/features/news/
├── EnhancedNewsFeed.jsx      # Main component with all features
├── EnhancedNewsFeed.css      # Comprehensive styling
├── NewsFeed.jsx              # Original component (kept for backup)
├── NewsFeed.css              # Original styles
└── newsSample.json           # Fallback sample data
```

### Data Flow
1. **Load**: Fetches from `/data/news.json` on mount
2. **Enhance**: Adds metadata (categories, trending status, views)
3. **Filter**: Applies category and search filters
4. **Sort**: Orders by selected sort method
5. **Display**: Renders in featured/trending/grid sections
6. **Refresh**: Auto-updates every 30 minutes

### Data Structure
```json
{
  "title": "Article title",
  "description": "Article description",
  "link": "https://source.com/article",
  "image_url": "https://image.url/photo.jpg",
  "creator": ["Author Name"],
  "pubDate": "2025-10-01T10:00:00Z",
  "source": "source.com",
  "category": "wellness",      // Auto-detected
  "isTrending": true,          // Auto-assigned
  "isNew": false,              // Based on pubDate
  "views": 5432                // Simulated
}
```

## Components Breakdown

### 1. News Header
- Title with gradient text effect
- Subtitle explaining the section
- Live update timestamp
- Pulsing red indicator dot

### 2. Search & Controls
- Search input with icon and clear button
- Sort dropdown with 3 options
- Responsive flex layout

### 3. Category Filters
- 7 interactive category chips
- Active state highlighting in gold
- Horizontal scroll on mobile

### 4. Featured Article (when viewing "All News")
- Large format hero article
- 1:1 split layout (desktop)
- Full-width image (mobile)
- Read time calculation

### 5. Trending Section (when viewing "All News")
- Top 3 articles in horizontal grid
- Ranking badges (1, 2, 3)
- Compact image + info layout
- View count display

### 6. News Grid
- Responsive grid (auto-fill, min 320px)
- Card-based layout
- 16:9 image aspect ratio
- Category tags and read links
- Hover animations

### 7. Article Reader
- Back button to return to feed
- Cleaned HTML content
- Max-width for readability
- Styled links and images

## Usage

### Viewing the News Feed
Navigate to `/news` or click the News link in navigation.

### Filtering News
1. Click any category chip to filter
2. Use search box for keyword search
3. Change sort order with dropdown
4. Click "Clear Filters" if no results

### Reading Articles
1. Click any article card
2. Content loads in article reader
3. Click "← Back to News" to return

## Configuration

### Update Frequency
Change auto-refresh interval in `EnhancedNewsFeed.jsx`:
```javascript
const refreshInterval = setInterval(() => {
  loadNews(true);
}, 30 * 60 * 1000); // 30 minutes (in milliseconds)
```

### News Data Source
Update news by editing `/public/data/news.json`:
```json
[
  {
    "title": "Your News Title",
    "description": "Article description...",
    "link": "https://source.com/article",
    "image_url": "/assets/default-thumbnail.png",
    "creator": ["Author"],
    "pubDate": "2025-11-14T00:00:00Z",
    "source": "source.com"
  }
]
```

### Category Detection Keywords
Modify `detectCategory()` function in component:
```javascript
const detectCategory = (article) => {
  const text = `${article.title} ${article.description}`.toLowerCase();
  if (text.includes("mental health")) return "mental-health";
  if (text.includes("recovery")) return "recovery";
  // Add more conditions...
  return "wellness";
};
```

## Browser Support
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (iOS 9+, macOS)
- ✅ Mobile browsers (iOS, Android)

## Performance Optimizations
- **Lazy loading images**: `loading="lazy"` attribute
- **CSS transforms**: Hardware-accelerated animations
- **Debounced search**: Filters apply instantly (can add debounce if needed)
- **Memoization**: Consider adding React.memo for optimization
- **Code splitting**: Component can be lazy-loaded if needed

## Accessibility
- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus states on all interactive elements
- Color contrast meets WCAG AA standards

## Future Enhancements
- [ ] Add real-time news API integration
- [ ] Implement infinite scroll or pagination
- [ ] Add article bookmarking
- [ ] Social sharing buttons
- [ ] Comments section
- [ ] Newsletter subscription
- [ ] Push notifications for breaking news
- [ ] Advanced filters (date range, source)
- [ ] User preferences (saved categories)
- [ ] Analytics tracking

## Troubleshooting

### News not loading
1. Check `/public/data/news.json` exists
2. Verify JSON format is valid
3. Check browser console for errors
4. Ensure API endpoints are accessible

### Images not displaying
1. Verify image URLs are accessible
2. Check image proxy at `/api/image`
3. Fallback to default thumbnail
4. Check CORS headers if external images

### Categories not working
1. Verify article descriptions contain keywords
2. Check `detectCategory()` logic
3. Add console logs to debug categorization

### Search not filtering
1. Check search query state updates
2. Verify filter logic in `useEffect`
3. Test with simple keywords first

## Testing Checklist
- [ ] Page loads without errors
- [ ] Articles display correctly
- [ ] Search filters articles
- [ ] Categories filter correctly
- [ ] Sort options work
- [ ] Featured article appears
- [ ] Trending section shows top 3
- [ ] Article reader opens/closes
- [ ] Auto-refresh works
- [ ] Mobile responsive design
- [ ] Hover effects work
- [ ] Images load properly
- [ ] No console errors
- [ ] Safari/iOS compatible

## Notes
- Original `NewsFeed.jsx` component retained for backward compatibility
- `NewsBlogsPage.js` updated to use `EnhancedNewsFeed`
- News proxy functions in `/functions/newsProxy.js` handle external content
- Sample data in `newsSample.json` used as fallback

## Contact
For issues or enhancements, refer to the project's GitHub repository or contact the development team.
