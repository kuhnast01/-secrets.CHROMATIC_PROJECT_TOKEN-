# Cosmetics QA Checklist

## General
- [ ] All cosmetics categories (commanders, ships, profile, guild) display correct data
- [ ] Tabs switch and load data without errors
- [ ] Loading, error, and empty states are handled gracefully
- [ ] Retry is available on data load failure

## Cosmetic Grid
- [ ] All owned/unowned cosmetics display correct status
- [ ] Cosmetic cards are clickable/tappable and open detail view
- [ ] Grid layout is responsive (web) and scrollable (mobile)

## Cosmetic Detail
- [ ] Detail screen shows all cosmetic info (name, rarity, type, unlock source, ownership)
- [ ] Equip button is disabled while equipping
- [ ] Equip flow shows success and error feedback
- [ ] Retry is available on equip failure
- [ ] Cannot double-submit equip
- [ ] Go to Source works for unowned cosmetics

## State & Profile
- [ ] Equipping a cosmetic updates global state and profile header
- [ ] Equipped cosmetics persist across navigation
- [ ] State updates are reflected in all relevant UI

## Edge Cases
- [ ] Handles missing or malformed cosmetic data
- [ ] Handles network errors and retries
- [ ] Handles rapid tab switching and equip attempts
- [ ] No crashes or unhandled exceptions

## Accessibility & UX
- [ ] All buttons and interactive elements are accessible
- [ ] Error and success messages are clear and visible
- [ ] UI is visually consistent across devices

## Manual Test Scenarios
- [ ] Equip each cosmetic type and verify profile update
- [ ] Simulate network failure and verify error handling
- [ ] Attempt to equip unowned cosmetic (should not allow)
- [ ] Switch tabs rapidly and verify no UI breakage

---

Use this checklist to verify all core and edge case flows for the Cosmetics Hub and equip system on both web and mobile.
