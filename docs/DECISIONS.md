# Decisions

- Phase 0 — Use the planned `patramail/` directory as the repository root so the supplied project plan stays outside the package.
- Phase 0 — Track this decision log and the npm lockfile for request traceability and reproducible development installs.
- Phase 0 — Use a local Git repository because GitHub CLI has no authenticated account in this environment.
- Phase 0 — Start at version 0.0.0 so Phase 8 can explicitly bump to 0.1.0.
- Phase 0 — Use the package manifest's `files` allowlist in place of `.npmignore`, as the plan permits.
- Phase 0 — Use ESLint 8.57.1 for development on all Node 18 minor versions; it is end-of-life.
- Phase 0 — Use Sarthak Gupta as the commit display name because the configured name contains pasted command text.
- Phase 1 — Accept absolute HTTP(S), mailto and tel links, and HTTP(S) logos only, to keep active URL schemes out of generated HTML.
- Phase 1 — Size logos at 160 × 48 with the product name as alt text because the draft has no image dimensions.
- Phase 1 — Support footer.address as optional text because the project structure calls for an address.
- Phase 1 — Use environment variable UPDATE_SNAPSHOTS=1 for deliberate snapshot updates across supported Node versions.
