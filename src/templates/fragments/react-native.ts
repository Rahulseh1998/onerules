import type { RuleSet } from "../../types.js";

export function getReactNativeRules(): RuleSet {
  return {
    projectContext: "This is a React Native application.",
    codingPatterns: [
      "Use `StyleSheet.create()` for styles. Not inline style objects — they create new references on every render.",
      "Use `FlatList` for long lists. Never use `ScrollView` with `.map()` for lists longer than ~20 items — it renders everything at once.",
      "Use `React.memo` on list item components that receive stable props. FlatList re-renders are expensive on mobile.",
      "Use platform-specific file extensions (`.ios.tsx`, `.android.tsx`) for platform-specific code. Use `Platform.select()` for small differences.",
      "Use React Navigation for routing. Follow the stack/tab/drawer composition pattern.",
    ],
    performance: [
      "Avoid unnecessary re-renders. Use `useCallback` for handlers passed to list items — this is one of the few cases where it genuinely matters.",
      "Use `Animated` API or Reanimated for animations. Never animate with `setState` — it runs on the JS thread and janks.",
      "Keep the JS bundle small. Use lazy loading with `React.lazy` for screens not in the initial route.",
    ],
    doNot: [
      "DO NOT use web CSS properties. React Native uses Flexbox with `flexDirection: 'column'` as default (opposite of web).",
      "DO NOT use `<div>`, `<span>`, `<p>`. Use `<View>`, `<Text>`, `<Pressable>`. There are no HTML elements.",
      "DO NOT use `ScrollView` for long lists. Use `FlatList` with `keyExtractor` and `renderItem`.",
      "DO NOT use `opacity: 0` to hide elements. Use conditional rendering — hidden elements still consume layout and memory.",
      "DO NOT import from `react-native-web` in a mobile-only project.",
    ],
  };
}
