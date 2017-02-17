# Contributing Guidelines for FocusPro

> Think of them more as rules, rather than guidelines

### Fork the repo

Use github’s interface to make a fork of the repo, then add master repo as an upstream remote:

```
git remote add upstream <REPO_LINK_HERE>
```
### Make changes

- Commit often
- Don't push to your fork until you want to make a pull request

### Commits
- Present tense verb as first word (e.g. Add function, Fix bug)
- Capitalize first verb (NOT 'add function, fix bug')
- If you want to explain the commit in more depth, follow the first line with a blank line and then a more detailed description of the commit

### Making the pull request
Do not make pull request with features that are not fully functional or tested.

1. git pull --rebase upstream master
2. git push (to your fork)
3. From the Github website, make a pull request from your fork to the upstream repo

If working with another member on the same feature, make a pull request from your fork to the upstream repo feature branch