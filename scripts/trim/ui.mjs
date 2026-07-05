/**
 * Tiny zero-dependency terminal UI helpers for the trim tool:
 * colors, arrow-key multi-select, confirm, and step reporting.
 */
import process from "node:process";
import readline from "node:readline";

const isTTY = process.stdout.isTTY && !process.env.NO_COLOR;
const color = code => text => (isTTY ? `\u001B[${code}m${text}\u001B[0m` : `${text}`);

export const bold = color("1");
export const dim = color("2");
export const cyan = color("36");
export const green = color("32");
export const red = color("31");
export const yellow = color("33");

export function heading(text) {
  console.log(`\n${bold(cyan(text))}\n`);
}

export function note(text) {
  console.log(dim(`  ${text}`));
}

export function fail(text) {
  console.error(`${red("✗")} ${text}`);
}

/**
 * Runs a blocking task behind a single status line:
 *   → label ...   becomes   ✓ label   (or ✗ label)
 */
export function step(label, task) {
  process.stdout.write(`  ${dim("→")} ${label} ${dim("…")}`);
  try {
    const result = task();
    process.stdout.write(`\r  ${green("✓")} ${label}   \n`);
    return result;
  } catch (error) {
    process.stdout.write(`\r  ${red("✗")} ${label}   \n`);
    throw error;
  }
}

function requireTTY() {
  if (!process.stdin.isTTY) {
    fail("Interactive mode needs a terminal. Use --preset, --remove or --yes (see --help).");
    process.exit(1);
  }
}

function withRawInput(handler) {
  return new Promise((resolve) => {
    requireTTY();
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    function cleanup() {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.removeListener("keypress", onKeypress);
    }
    function onKeypress(str, key) {
      if (key?.ctrl && key.name === "c") {
        cleanup();
        console.log("\nAborted.");
        process.exit(0);
      }
      handler(str, key, (value) => {
        cleanup();
        resolve(value);
      });
    }
    process.stdin.on("keypress", onKeypress);
  });
}

/**
 * Checkbox list. options: [{ label, hint, selected }] — returns boolean[].
 */
export async function multiselect(question, options) {
  requireTTY();
  const state = options.map(option => option.selected !== false);
  let cursor = 0;
  let rendered = 0;

  const render = () => {
    if (rendered > 0) {
      process.stdout.write(`\u001B[${rendered}A`);
    }
    const lines = [
      `${bold(question)} ${dim("(↑/↓ move · space toggle · enter confirm)")}`,
      ...options.map((option, i) => {
        const box = state[i] ? green("◉") : dim("◯");
        const label = i === cursor ? bold(option.label) : option.label;
        const pointer = i === cursor ? cyan("❯") : " ";
        return `\u001B[2K${pointer} ${box} ${label}  ${dim(option.hint ?? "")}`;
      }),
    ];
    process.stdout.write(`${lines.join("\n")}\n`);
    rendered = lines.length;
  };

  render();
  return withRawInput((str, key, done) => {
    if (key?.name === "up") {
      cursor = (cursor - 1 + options.length) % options.length;
    } else if (key?.name === "down") {
      cursor = (cursor + 1) % options.length;
    } else if (key?.name === "space") {
      state[cursor] = !state[cursor];
    } else if (key?.name === "return") {
      done([...state]);
      return;
    }
    render();
  });
}

export async function confirm(question, defaultValue = false) {
  requireTTY();
  const hint = defaultValue ? "[Y/n]" : "[y/N]";
  process.stdout.write(`${bold(question)} ${dim(hint)} `);
  return withRawInput((str, key, done) => {
    if (key?.name === "return") {
      console.log(defaultValue ? "y" : "n");
      done(defaultValue);
    } else if (str?.toLowerCase() === "y") {
      console.log("y");
      done(true);
    } else if (str?.toLowerCase() === "n" || key?.name === "escape") {
      console.log("n");
      done(false);
    }
  });
}
