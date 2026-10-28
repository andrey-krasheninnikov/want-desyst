# Issue tracker: GitHub

Issues and specs live in GitHub Issues for
`andrey-krasheninnikov/want-desyst`. Use the `gh` CLI.

## Operations

- Create: `gh issue create --title "..." --body-file <file>`.
- Read: `gh issue view <number> --comments`.
- List: `gh issue list --state open --json number,title,body,labels`.
- Comment: `gh issue comment <number> --body-file <file>`.
- Label: `gh issue edit <number> --add-label "..."` or `--remove-label "..."`.
- Close: `gh issue close <number>`.

Use an explicit `--repo owner/repo` when operating across repositories.
Link related issues with fully qualified URLs and record blockers.

## Pull requests as a triage surface

**PRs as a request surface: no.**

## Skill conventions

"Publish to the issue tracker" means create a GitHub issue.
"Fetch the relevant ticket" means read the issue and its comments.
