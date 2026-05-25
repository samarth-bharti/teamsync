---
description: Generate a matching test file for the given source file
argument-hint: <path to source file>
allowed-tools: Read, Write, Glob, Grep, Bash
---

Generate a test file for: $ARGUMENTS

1. **Read** the target file and understand its exports and public behavior. If the path doesn't exist, stop and say so.
2. **Match the existing setup.** Check `package.json` and any existing `*.test.*` / `*.spec.*` files to detect the framework (Vitest / Jest), the naming convention, and where tests live. Mirror it. If no test setup exists yet, default to **Vitest** with a `<name>.test.ts(x)` file beside the source, and note that the runner still needs wiring.
3. **Write** the test file at the conventional path. Do **not** modify the source file. Cover:
   - The happy path for each exported function / component.
   - Important edge cases and error paths.
   - For React components: render + key interactions (and mobile-relevant behavior where applicable).
4. **Keep it honest.** Focused, readable tests; no over-mocking; no assertions that can't fail.
5. **Report** the path created, what it covers, and any case you couldn't test (and why).
