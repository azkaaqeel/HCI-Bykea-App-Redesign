# Colorblind Accessibility Features

This app includes comprehensive accessibility features for users with color vision deficiencies.

## Features

### 1. **Colorblind Mode**
When enabled, the app:
- Replaces green indicators with blue (more distinguishable)
- Adds icons (✓, ⚠, ℹ) to color-coded elements
- Adds text labels to status indicators
- Uses patterns/textures for different categories:
  - **Purple elements**: Diagonal stripes
  - **Yellow elements**: Horizontal stripes
  - **Orange elements**: Diagonal crosshatch

### 2. **High Contrast Mode**
- Increases border widths to 2px
- Enhances text contrast
- Makes buttons more prominent with bold borders
- Improves visibility for low vision users

### 3. **Text Labels**
All color-coded elements include:
- Icons alongside colors
- Text descriptions where applicable
- Status labels (e.g., "Available", "Unavailable")

### 4. **Map Markers**
- Pickup locations: Triangle (▲) shape
- Dropoff locations: Circle (●) shape
- Different shapes make locations distinguishable without color

## How to Enable

1. Navigate to **Help & Support** screen
2. Scroll to **Accessibility / رسائی** section
3. Choose from:
   - **Normal**: Standard view
   - **Colorblind Mode**: Icons, patterns & labels
   - **High Contrast**: Enhanced visibility

## Implementation Details

### CSS Classes
- `.colorblind-mode`: Applied to root element when colorblind mode is active
- `.high-contrast-mode`: Applied to root element when high contrast mode is active

### Context API
The `AccessibilityProvider` manages accessibility state:
```typescript
const { mode, setMode, isColorblindMode, isHighContrast } = useAccessibility();
```

### Color Replacements
- **Green → Blue**: Success/available states
- **Red → Dark Red**: Warnings/errors (with ⚠ icon)
- **Blue → Purple**: Information (with ℹ icon)

## Best Practices

1. **Never rely solely on color** - Always include:
   - Icons
   - Text labels
   - Patterns or shapes
   - Different sizes or positions

2. **Test with colorblind simulators**:
   - Chrome DevTools: Rendering → Emulate vision deficiencies
   - Online tools: Coblis, Color Oracle

3. **Maintain sufficient contrast**:
   - WCAG AA: 4.5:1 for normal text
   - WCAG AAA: 7:1 for normal text

## Future Enhancements

- [ ] Specific colorblind type selection (Protanopia, Deuteranopia, Tritanopia)
- [ ] Custom color palette selection
- [ ] Font size adjustment
- [ ] Screen reader optimizations
- [ ] Motion reduction options

