import "@testing-library/jest-dom";
import "vitest-axe/extend-expect";
import { configureAxe } from "vitest-axe";

configureAxe({
  globalOptions: {
    rules: [
      { id: "color-contrast", enabled: false },
    ],
  },
});
