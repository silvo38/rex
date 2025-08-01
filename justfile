test:
  deno test --allow-read

fix:
  deno fmt
  deno lint --fix

presubmit: test
  deno fmt --check
  deno lint
  cd example && just build

# Updates the version number.
bump version:
  sed -i '' -E 's|("version": ")[0-9]+\.[0-9]+\.[0-9]+"|\1{{version}}"|' deno.jsonc
  sed -i '' -E 's|(jsr:@silvo38/rex@\^?)[0-9]+\.[0-9]+\.[0-9]+"|\1{{version}}"|' README.md example/deno.jsonc example/BUILD.ts
  git commit deno.jsonc README.md -m "Release version {{version}}"

publish: presubmit
  deno publish --dry-run
  read -r -p "Press ENTER to publish:" response
  deno publish
