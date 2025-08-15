// UI Constants
export const UI_CONSTANTS = {
  BORDER_RADIUS: {
    SMALL: 8,
    MEDIUM: 12,
    LARGE: 16,
    XLARGE: 20,
    CIRCULAR: 50,
  },
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 12,
    LG: 16,
    XL: 20,
    XXL: 24,
  },
  FONT_SIZE: {
    XS: 10,
    SM: 12,
    MD: 14,
    LG: 16,
    XL: 18,
    XXL: 20,
    TITLE: 24,
  },
  ANIMATION: {
    DURATION: {
      FAST: 300,
      NORMAL: 600,
      SLOW: 800,
    },
  },
} as const;

// Post Creation Constants
export const POST_CREATION = {
  STEPS: [
    { id: 1, title: 'Content', description: 'Write your post' },
    { id: 2, title: 'Media', description: 'Add images' },
    { id: 3, title: 'Enhance', description: 'Add tags & location' },
    { id: 4, title: 'Review', description: 'Preview & publish' },
  ],
  AI_SUGGESTIONS: [
    "Share your thoughts on today's events!",
    "What's the highlight of your day?",
    "Tell us about your latest adventure!",
    "Share a moment that made you smile today.",
    "What are you grateful for right now?",
    "Share a tip or advice with the community!",
    "What's your current mood? Express it!",
    "Share something you learned today.",
  ],
  FORMATTING_OPTIONS: [
    { id: 'bold', label: 'Bold' },
    { id: 'italic', label: 'Italic' },
    { id: 'list', label: 'List' },
    { id: 'quote', label: 'Quote' },
  ],
} as const;

// Analytics Constants
export const ANALYTICS = {
  PERIODS: [
    { id: '7d', label: '7D' },
    { id: '30d', label: '30D' },
    { id: '90d', label: '90D' },
  ],
  METRICS: [
    { id: 'engagement', label: 'Engagement' },
    { id: 'posts', label: 'Posts' },
    { id: 'reach', label: 'Reach' },
    { id: 'growth', label: 'Growth' },
  ],
  CHART: {
    BAR_WIDTH: 20,
    MIN_BAR_HEIGHT: 4,
    MAX_BAR_HEIGHT: 150,
    LABEL_FONT_SIZE: 10,
  },
} as const;

// Tab Bar Constants
export const TAB_BAR = {
  HEIGHT: 80, // Increased height for better touch targets
  PADDING: {
    TOP: 12,
    BOTTOM: 16, // Increased bottom padding for device compatibility
  },
  ICON_SIZE: 24,
} as const;

// Device Constants
export const DEVICE = {
  SAFE_AREA_BOTTOM: 34, // iPhone X and newer
  TAB_BAR_OFFSET: 20, // Additional offset for better positioning
} as const;

