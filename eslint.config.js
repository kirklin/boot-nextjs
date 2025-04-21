import kirklin from "@kirklin/eslint-config";

export default kirklin({
  react: true,
  typescript: true,
  unocss: true,
  formatters: true,
  rules: {
    "node/prefer-global/process": "off",
  },
});
