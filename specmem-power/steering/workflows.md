# SpecMem Workflows

## Before Making Changes

1. Use `specmem_impact` to see affected specs
2. Use `specmem_context` to get relevant context
3. Review the TL;DR with `specmem_tldr`

## After Making Changes

1. Run `specmem_validate` to check spec quality
2. Use `specmem_coverage` to identify test gaps
3. Run affected tests from impact analysis

## Code Review Workflow

1. Get context for changed files:
   ```
   specmem_context(files: ["changed_file.py"])
   ```

2. Check if changes align with specs:
   ```
   specmem_query(query: "requirements for changed functionality")
   ```

3. Validate specs are still correct:
   ```
   specmem_validate()
   ```

## Test Planning Workflow

1. Check coverage gaps:
   ```
   specmem_coverage()
   ```

2. Get test suggestions for uncovered criteria

3. Prioritize tests based on impact analysis
