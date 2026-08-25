# terminal-portfolio

An interactive terminal-style portfolio for Soumalya Chandra, DevOps Engineer.
Static site — no build step, no dependencies, no framework. Three files and an
audio clip, served straight from GitHub Pages.

**Live:** https://cyberheister.github.io/terminal-portfolio/

## Running locally

The `resume` command and the GitHub API call both use `fetch`, which is blocked
on `file://` URLs. Serve over HTTP instead:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Commands

| Command      | Description                          |
| ------------ | ------------------------------------ |
| `help`       | List available commands              |
| `about`      | Professional summary                 |
| `skills`     | Technical skills                     |
| `experience` | Work history                         |
| `projects`   | Five most recently updated GitHub repos |
| `resume`     | Open `resume.pdf` in a new tab       |
| `contact`    | GitHub, LinkedIn, email              |
| `whoami`     | Print the current user               |
| `date`       | Print the current date and time      |
| `ls`         | List the virtual files               |
| `cat <file>` | Print a virtual file                 |
| `banner`     | Reprint the ASCII banner             |
| `sound`      | Toggle the keystroke sound           |
| `clear`      | Clear the screen                     |

Keyboard: <kbd>↑</kbd>/<kbd>↓</kbd> for history, <kbd>Tab</kbd> to complete a
command, <kbd>Ctrl</kbd>+<kbd>L</kbd> to clear, <kbd>Ctrl</kbd>+<kbd>C</kbd> to
abandon the current line.

## Editing content

Everything you are likely to change lives at the top of `script.js`:

- `LINKS` — GitHub, LinkedIn, and email. Empty strings render as `(not set)`
  rather than shipping a dead link, so fill these in.
- `SECTIONS` — the text behind `about` and `skills`. The `cat` command reads
  from the same object, so the two cannot drift apart.
- `EXPERIENCE` — your roles. Ships as a placeholder; replace the entries and
  set `placeholder: false` to remove the warning banner.
- `GITHUB_USERNAME` — drives both the `projects` listing and the contact link.

## Notes

- **`resume.pdf` is not in the repo yet.** Drop it in the project root and the
  `resume` command starts working automatically — it probes for the file at
  boot and reports honestly if it is missing.
- **The GitHub API is called unauthenticated**, which is rate limited to 60
  requests per hour per IP. The `projects` command detects a 403 and says so
  instead of failing silently. Forks and archived repos are filtered out.
- **Keystroke sound is off by default.** Browsers block unprompted autoplay,
  and `typing.mp3` is 259 KB — it is set to `preload="none"` and only
  downloaded once someone runs `sound on`.
- **`.nojekyll`** stops GitHub Pages from running the files through Jekyll.
- **`<noscript>`** carries a plain-HTML copy of the summary and skills, so
  search crawlers and no-JS visitors still get the content.

## Still to do

- Add `resume.pdf`.
- Fill in `LINKS.linkedin` and `LINKS.email`.
- Replace the `EXPERIENCE` placeholders.
- Add an Open Graph preview image (`og:image`) for link unfurls.
