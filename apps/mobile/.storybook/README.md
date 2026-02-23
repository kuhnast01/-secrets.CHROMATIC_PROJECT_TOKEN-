# Storybook for ShopScreen

This folder contains stories for the ShopScreen and related components. To run Storybook:

1. Install dependencies:

```sh
pnpm install -w @storybook/react-native
```

1. Start Storybook:

```sh
pnpm storybook
```

1. View stories for ShopScreen and verify component documentation (JSDoc is auto-imported for props).

## Adding Stories

- Place new stories in this folder, following the pattern in `ShopScreen.stories.tsx`.
- Use JSDoc comments in your components for automatic prop documentation.

## Best Practices

- Keep stories minimal and focused.
- Use mock data for props where possible.
- Document all props and usage with JSDoc.

---

For more, see the [Storybook docs](https://storybook.js.org/docs/react-native/get-started/introduction).
