# Player Dashboard Theme/Skin System & Maintenance Guide

## Overview
This project uses a modular theme/skin system for the player dashboard, enabling easy updates, customization, and maintenance. All UI components are integrated and follow best practices for clean, professional code.

## Theme/Skin System
- **ThemeProvider:** Uses MUI ThemeProvider for centralized theme management.
- **Skins:** Multiple skins (default, cyberpunk, military) are defined as TypeScript objects and can be extended.
- **Skin Manager:** Switch skins instantly via UI buttons. Add more skins by editing the `skins` object in PlayerDashboardContainer.tsx.

## Component Structure
- All components (PlayerAnalyticsDashboard, AchievementPopup, Leaderboard, ChallengeTracker, BattleHighlights, SocialShareButton) accept props and use theme context.
- Visual logic is separated from business logic for maintainability.

## Customization & Visual Editor
- To enable drag-and-drop or cut-and-paste customization, build a visual editor/dashboard UI. (Future work)
- All components are modular and can be rearranged or styled via theme/skin configs.

## Maintenance & Troubleshooting
- Code is well-commented and modular.
- To update visuals or add new skins, edit the `skins` object and component props.
- For troubleshooting, check component props, theme context, and API endpoints.

## Adding/Editing Skins
1. Open PlayerDashboardContainer.tsx.
2. Add a new skin to the `skins` object using `createTheme`.
3. Add a button in the AppBar to switch to the new skin.

## Documentation
- All theme/skin logic is documented in PlayerDashboardContainer.tsx.
- Component usage and props are documented in their respective files.

## Future Enhancements
- Build a visual editor for drag-and-drop customization.
- Add import/export functionality for skins.
- Enable live preview for theme changes.

---
For questions or updates, see PlayerDashboardContainer.tsx and component files in apps/web/src/components.
