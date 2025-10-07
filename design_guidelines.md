# Secret Missions Multiplayer - Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern gaming interfaces like Discord, Among Us, and party game platforms. The design emphasizes playful energy while maintaining clarity for competitive gameplay.

## Core Design Elements

### Color Palette
**Primary Colors:**
- Dark mode primary: 220 25% 15% (deep navy background)
- Light mode primary: 220 15% 95% (soft white)
- Brand accent: 280 85% 65% (vibrant purple for game elements)
- Success: 140 60% 50% (mission completion)
- Warning: 35 85% 60% (timer alerts)
- Danger: 0 75% 55% (eliminations)

**Gaming Theme Colors:**
- Mission cards: 260 40% 25% (dark purple backgrounds)
- Player highlights: 190 70% 55% (cyan for active players)
- Lobby elements: 45 25% 80% (warm beige for neutral areas)

### Typography
- **Primary**: Inter via Google Fonts for clean readability
- **Gaming accent**: Orbitron for headers and mission titles
- Sizes: text-sm for labels, text-base for body, text-xl for headers

### Layout System
**Spacing**: Consistent use of Tailwind units 2, 4, 6, and 8 (p-4, m-6, gap-8)
- Cards and containers: p-6, m-4
- Component spacing: gap-4
- Section margins: mb-8

### Component Library

**Game Interface:**
- **Mission Cards**: Gradient backgrounds (280 85% 65% to 260 40% 25%) with rounded-xl borders
- **Player Avatars**: Circular with colored rings indicating status
- **Timer Display**: Large, prominent with pulsing animation when under 30 seconds
- **Lobby Interface**: Card-based layout with room codes prominently displayed

**Interactive Elements:**
- **Guess Buttons**: Primary purple with subtle hover states
- **Mission Submit**: Green success buttons with confirmation feedback
- **Elimination Indicators**: Red badges with cross icons

**Navigation:**
- **Game Modes**: Large card selection with icons
- **Settings Panel**: Slide-out drawer with game configuration options

### Visual Treatments

**Gradients**: Subtle gradients on mission cards and lobby backgrounds
- Mission backgrounds: vertical gradient from brand accent to darker variant
- Lobby headers: horizontal gradient with purple and cyan tones

**Background**: Dark theme primary with subtle texture overlay for depth

### Gaming-Specific Elements

**Status Indicators:**
- Active mission: glowing border animation
- Eliminated players: grayscale with strikethrough
- Timer warnings: pulsing red overlay

**Feedback Systems:**
- Success animations: green checkmark with scale effect
- Wrong guess: red shake animation
- Mission completion: confetti particle effect

## Images
No large hero image needed. Instead, use:
- Small mission category icons (64x64px) for different mission types
- Player avatar placeholders (80x80px circular)
- Game mode illustration cards (200x120px) showing local vs online play
- Achievement badges (40x40px) for player progression

## Key Design Principles
1. **Clarity First**: All game state information must be immediately readable
2. **Retro-Futuristic Energy**: Smooth, fluid animations with glowing effects and seamless transitions enhance the gaming atmosphere
3. **Mobile Optimized**: Touch-friendly sizing with minimum 44px tap targets
4. **Quick Recognition**: Color coding for different player states and mission types
5. **Immersive Animations**: All transitions should feel smooth and maintain the retro-futuristic vibe with subtle glow effects, smooth slides, and elegant fades

## Animation Guidelines
- **Page Transitions**: Smooth slide and fade transitions between game states
- **Component Entry**: Elements should animate in with subtle glow and scale effects
- **Interactive Feedback**: Buttons and cards should have smooth hover states with gentle pulse effects
- **Mission Reveals**: Special animation sequences for mission discovery with retro-style reveals
- **Timer Warnings**: Pulsing glow effects that intensify as time runs low
- **Player Turn Indicators**: Smooth highlighting and focus transitions for local mode turn management