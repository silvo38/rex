test:
  deno test

fmt:
  deno fmt
  deno lint --fix

presubmit: test
  deno fmt --check
  deno lint

publish: presubmit
  deno publish --dry-run
  read -r -p "Press ENTER to publish:" response
  deno publish
