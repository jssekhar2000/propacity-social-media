# Propacity - Social Media App

A production-level social media application built with React Native and Expo, featuring Instagram-like functionality with working like, comment, and share features.

## 🚀 Features

### Core Social Media Features
- **Like Posts**: Heart animation with real-time like/unlike functionality
- **Comment System**: Full comment interface with like/unlike comments
- **Share Posts**: Share to multiple platforms (Instagram, Facebook, Twitter, WhatsApp, etc.)
- **Save Posts**: Bookmark posts for later viewing
- **Stories**: Instagram-style stories with add/view functionality
- **User Authentication**: Login/logout with persistent state
- **Real-time Updates**: All interactions update immediately across the app

### UI/UX Features
- **Modern Design**: Instagram-inspired interface with smooth animations
- **Dark/Light Theme**: Dynamic theme switching with persistent preferences
- **Responsive Layout**: Optimized for different screen sizes
- **Loading States**: Skeleton loaders and smooth transitions
- **Pull to Refresh**: Refresh feed with pull-to-refresh gesture
- **Infinite Scroll**: Load more posts as you scroll
- **Search Functionality**: Search posts with real-time results

### Technical Features
- **State Management**: Zustand for global state management
- **Data Persistence**: AsyncStorage for offline data
- **API Integration**: Multiple data sources (JSONPlaceholder, DummyJSON)
- **TypeScript**: Full type safety throughout the application
- **Performance Optimized**: Efficient rendering and memory management

## 📱 Screenshots

The app includes:
- **Feed Screen**: Main social feed with posts, stories, and interactions
- **Comment Modal**: Full-screen comment interface
- **Share Modal**: Platform selection for sharing
- **Authentication**: Login/register screens
- **Profile**: User profile with stats
- **Search**: Post search functionality

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd propacity-social-media
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Run on your preferred platform:
- iOS: Press `i` in the terminal or scan QR code with Expo Go
- Android: Press `a` in the terminal or scan QR code with Expo Go
- Web: Press `w` in the terminal

## 🏗️ Project Structure

```
propacity-social-media/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main app tabs
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── feed/             # Feed-specific components
│   │   ├── PostCard.tsx  # Main post component
│   │   ├── StoriesBar.tsx # Stories component
│   │   ├── CommentModal.tsx # Comment interface
│   │   ├── ShareModal.tsx # Share interface
│   │   └── FloatingActionButton.tsx # FAB for creating posts
│   └── ui/               # Generic UI components
├── store/                # State management
│   ├── authStore.ts      # Authentication state
│   ├── socialStore.ts    # Social interactions state
│   └── themeStore.ts     # Theme state
├── hooks/                # Custom hooks
├── services/             # API services
└── types/                # TypeScript type definitions
```

## 🔧 Key Components

### PostCard
- Displays posts with images, text, and metadata
- Handles like, comment, share, and save actions
- Shows user information and post statistics
- Integrates with comment and share modals

### CommentModal
- Full-screen comment interface
- Real-time comment posting
- Like/unlike comments
- Reply functionality (UI ready)

### ShareModal
- Multiple platform sharing options
- Post preview before sharing
- Native share integration
- Copy link functionality

### StoriesBar
- Horizontal scrollable stories
- Add story button
- Story status indicators
- User avatars with story rings

## 🎨 State Management

### AuthStore
- User authentication state
- Login/logout functionality
- User profile data
- Follow/unfollow actions

### SocialStore
- Posts data and interactions
- Like/unlike state management
- Comment system
- Share tracking
- Save/bookmark functionality

### ThemeStore
- Dark/light theme switching
- Color scheme management
- Persistent theme preferences

## 🔌 API Integration

The app integrates with multiple APIs:
- **JSONPlaceholder**: Basic posts and users
- **DummyJSON**: Enhanced posts with reactions and tags
- **Local State**: Real-time interactions and comments

## 🚀 Performance Features

- **Optimized Rendering**: Efficient list rendering with FlatList
- **Image Optimization**: Lazy loading and caching
- **Memory Management**: Proper cleanup and state management
- **Smooth Animations**: Hardware-accelerated animations

## 📦 Dependencies

Key dependencies include:
- **React Native**: Core framework
- **Expo**: Development platform
- **Zustand**: State management
- **React Query**: Data fetching
- **Lucide React Native**: Icons
- **AsyncStorage**: Data persistence

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Roadmap

- [ ] Post creation functionality
- [ ] Image upload and editing
- [ ] Push notifications
- [ ] Direct messaging
- [ ] Video support
- [ ] Advanced search filters
- [ ] User profiles and settings
- [ ] Social features (followers, following)
- [ ] Analytics and insights