import kirklin from "@kirklin/eslint-config";
import nextPlugin from "@next/eslint-plugin-next";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default kirklin({
  react: true,
  typescript: true,
  formatters: true,
},
// --- Next.js Specific Rules ---
{
  plugins: {
    "@next/next": nextPlugin,
  },
  rules: {
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs["core-web-vitals"].rules,
  },
},
// --- Accessibility Rules ---
jsxA11y.flatConfigs.recommended,

// --- Custom Rule Overrides ---
{
  rules: {
    "node/prefer-global/process": "off", // Allow using `process.env`
  },
});
