# Mock Interview Runner Usage

Generate a timed mock interview session by level.

## Commands

From this folder:

- `npm run mock:run`
- `npm run mock:run -- --level novice`
- `npm run mock:run -- --level intermediate`
- `npm run mock:run -- --level advanced`
- `npm run mock:run -- --level expert`
- `npm run mock:run -- --level roku`
- `npm run mock:roku`
- `npm run mock:run -- --level expert --seed 42`

## Notes

- `--seed` gives deterministic sessions for repeatable practice.
- Levels map to interview depth from novice to principal.
- `roku` maps to a role-targeted Senior SWE Advertising loop.
