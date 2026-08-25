/* =========================================================
   Soumalya Chandra — terminal portfolio
   ========================================================= */

const output = document.getElementById("output");
const cmd = document.getElementById("cmd");
const form = document.getElementById("cmdform");

const USER = "soumalya";
const HOST = "portfolio";
const GITHUB_USERNAME = "CyberHeister";
const RESUME_FILE = "resume.pdf";

/* Empty string = not published yet. The `contact` command renders these
   as "(not set)" rather than shipping a broken link. Fill them in. */
const LINKS = {
  github: `https://github.com/${GITHUB_USERNAME}`,
  linkedin: "", // TODO: your LinkedIn vanity URL
  email: ""     // TODO: the address you want recruiters to use
};

/* =========================
   OUTPUT
========================= */

/* kind maps to a CSS class: head | ok | err | warn | dim | echo */
function print(text = "", kind = "") {
  const div = document.createElement("div");
  div.className = kind ? `command out-${kind}` : "command";
  div.textContent = text;
  output.appendChild(div);
  scrollToBottom();
  return div;
}

function printHTML(html, kind = "") {
  const div = document.createElement("div");
  div.className = kind ? `command out-${kind}` : "command";
  div.innerHTML = html;
  output.appendChild(div);
  scrollToBottom();
  return div;
}

function printLink(label, href) {
  const pad = label.padEnd(9, " ");
  const safe = href.replace(/"/g, "&quot;");
  printHTML(
    `${pad}: <a href="${safe}" target="_blank" rel="noopener noreferrer">${href}</a>`
  );
}

function promptLine(command) {
  printHTML(
    `${USER}@${HOST}:~$ <span class="cmd-text">${escapeHTML(command)}</span>`,
    "echo"
  );
}

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function scrollToBottom() {
  output.scrollTop = output.scrollHeight;
}

/* =========================
   KEYSTROKE SOUND
   Muted by default: browsers block unprompted autoplay, and surprise
   audio is hostile. `sound on` opts in.
========================= */

const typingAudio = new Audio("typing.mp3");
typingAudio.preload = "none";
typingAudio.volume = 0.35;

let soundOn = false;

function blip() {
  if (!soundOn) return;
  try {
    const a = typingAudio.cloneNode();
    a.volume = typingAudio.volume;
    a.play().catch(() => {});
  } catch {
    /* audio unsupported — silently ignore */
  }
}

function toggleSound(arg) {
  if (arg === "on") soundOn = true;
  else if (arg === "off") soundOn = false;
  else soundOn = !soundOn;

  if (soundOn) {
    typingAudio.preload = "auto";
    typingAudio.load();
    print("Keystroke sound: ON", "ok");
    blip();
  } else {
    print("Keystroke sound: OFF", "dim");
  }
}

/* =========================
   BOOT / SSH SIMULATION
========================= */

/* ASCII-only so it cannot mis-align in a fallback monospace font. */
const BANNER = [
  "+------------------------------------------+",
  "|   S O U M A L Y A   C H A N D R A        |",
  "|   DevOps Engineer - AWS - Terraform      |",
  "+------------------------------------------+"
].join("\n");

function showBanner() {
  const pre = document.createElement("pre");
  pre.className = "banner";
  pre.setAttribute("aria-label", "Soumalya");
  pre.textContent = BANNER;
  output.appendChild(pre);
  scrollToBottom();
}

const sshSequence = [
  `Connecting to ${USER}@${HOST}...`,
  "Authenticating with public key...",
  "Access granted."
];

let bootCursor = null;

function startBoot() {
  cmd.disabled = true;
  let step = 0;

  bootCursor = document.createElement("div");
  bootCursor.className = "command out-dim boot-cursor";
  output.appendChild(bootCursor);

  (function tick() {
    if (step < sshSequence.length) {
      const line = document.createElement("div");
      line.className = "command out-dim";
      line.textContent = sshSequence[step];
      output.insertBefore(line, bootCursor);
      scrollToBottom();
      step++;
      setTimeout(tick, 600);
      return;
    }
    bootCursor.remove();
    bootCursor = null;
    showHeader();
  })();
}

function showHeader() {
  showBanner();
  print("Soumalya Chandra — DevOps Engineer", "head");
  print("AWS | Terraform | Jenkins | Docker | Kubernetes");
  print("");
  print("Type 'help' to see available commands.", "dim");
  print("");

  cmd.disabled = false;
  cmd.focus();
}
/* =========================
   CONTENT
   Single source of truth: `about`/`skills`/... and `cat <file>` both read
   from here, so the two can never drift apart.
========================= */

const SECTIONS = {
  about:
    "DevOps Engineer with 6+ years of experience building,\n" +
    "automating, and operating AWS cloud infrastructure.\n" +
    "Strong focus on CI/CD, IaC, security, and cost optimization.",

  skills:
    "Cloud       : AWS (EC2, ECS, EKS, S3, RDS, IAM, VPC, Lambda)\n" +
    "IaC         : Terraform, CloudFormation\n" +
    "CI/CD       : Jenkins, GitHub Actions\n" +
    "Containers  : Docker, Kubernetes\n" +
    "Languages   : Python, Bash\n" +
    "Platform    : Linux"
};

/* TODO: replace these placeholders with your real roles, then set
   `placeholder: false` so the warning line stops printing. */
const EXPERIENCE = {
  placeholder: true,
  roles: [
    {
      period: "20XX — Present",
      title: "DevOps Engineer",
      company: "TODO: company",
      notes: [
        "TODO: headline achievement, with a number in it.",
        "TODO: the infrastructure you own."
      ]
    },
    {
      period: "20XX — 20XX",
      title: "TODO: previous title",
      company: "TODO: company",
      notes: ["TODO: what you built or migrated."]
    }
  ]
};

const VFS = {
  "about.txt": () => SECTIONS.about,
  "skills.txt": () => SECTIONS.skills,
  "experience.txt": () => renderExperience(),
  "contact.txt": () => contactPlain(),
  "resume.pdf": () => null // binary — handled specially
};

function renderExperience() {
  return EXPERIENCE.roles
    .map((r) => `${r.period}  ${r.title} @ ${r.company}\n` +
                r.notes.map((n) => `  - ${n}`).join("\n"))
    .join("\n\n");
}

function contactPlain() {
  return [
    `GitHub   : ${LINKS.github}`,
    `LinkedIn : ${LINKS.linkedin || "(not set)"}`,
    `Email    : ${LINKS.email || "(not set)"}`
  ].join("\n");
}

/* =========================
   COMMANDS
========================= */

const HELP = [
  ["about", "Professional summary"],
  ["skills", "Technical skills"],
  ["experience", "Work history"],
  ["projects", "GitHub projects"],
  ["resume", "Open resume PDF"],
  ["contact", "Contact details"],
  ["whoami", "Current user"],
  ["date", "Current date and time"],
  ["ls", "List files"],
  ["cat <file>", "Print a file"],
  ["banner", "Show the ASCII banner"],
  ["sound", "Toggle keystroke sound"],
  ["clear", "Clear terminal  (Ctrl+L)"],
  ["help", "This list"]
];

const COMMANDS = [
  "about", "banner", "cat", "clear", "contact", "date", "experience",
  "help", "ls", "projects", "resume", "skills", "sound", "whoami"
];

function showHelp() {
  HELP.forEach(([name, desc]) => {
    print(`${name.padEnd(12, " ")}${desc}`);
  });
}

function showContact() {
  printLink("GitHub", LINKS.github);

  if (LINKS.linkedin) printLink("LinkedIn", LINKS.linkedin);
  else print("LinkedIn : (not set)", "dim");

  if (LINKS.email) {
    printHTML(
      `Email    : <a href="mailto:${escapeHTML(LINKS.email)}">${escapeHTML(LINKS.email)}</a>`
    );
  } else {
    print("Email    : (not set)", "dim");
  }
}

function showExperience() {
  if (EXPERIENCE.placeholder) {
    print("Placeholder content — update EXPERIENCE in script.js.", "warn");
    print("");
  }
  print(renderExperience());
}

function listFiles() {
  print(Object.keys(VFS).join("   "));
}

function catFile(name) {
  if (!name) {
    print("cat: missing operand. Try 'ls' to see available files.", "err");
    return;
  }
  const key = name.toLowerCase();
  if (!(key in VFS)) {
    print(`cat: ${name}: No such file or directory`, "err");
    return;
  }
  if (key === "resume.pdf") {
    print("cat: resume.pdf: binary file — use 'resume' instead.", "warn");
    return;
  }
  print(VFS[key]());
}

/* ---------- resume ----------
   Probed once at boot so the `resume` command can call window.open()
   synchronously inside the user gesture. An awaited open gets blocked
   as a popup by most browsers. */

let resumeReady = null;

async function probeResume() {
  try {
    const res = await fetch(RESUME_FILE, { method: "HEAD", cache: "no-store" });
    resumeReady = res.ok;
  } catch {
    resumeReady = null; // unknown (offline, or opened over file://)
  }
}

function openResume() {
  if (resumeReady === false) {
    print("resume: resume.pdf not published yet.", "err");
    printLink("GitHub", LINKS.github);
    return;
  }
  const win = window.open(RESUME_FILE, "_blank", "noopener");
  if (!win) {
    printHTML(
      `Popup blocked. <a href="${RESUME_FILE}" target="_blank" rel="noopener noreferrer">Open resume.pdf</a>`,
      "warn"
    );
    return;
  }
  print("Opening resume...", "ok");
}

/* ---------- projects ---------- */

async function showProjects() {
  print("Fetching GitHub repositories...", "dim");

  let res;
  try {
    res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
      { headers: { Accept: "application/vnd.github+json" } }
    );
  } catch (err) {
    print(`Network error: ${err.message}`, "err");
    return;
  }

  if (!res.ok) {
    if (res.status === 403 || res.status === 429) {
      print("GitHub API rate limit reached (60 requests/hour per IP).", "err");
      printLink("Browse", LINKS.github);
    } else if (res.status === 404) {
      print(`GitHub user '${GITHUB_USERNAME}' not found.`, "err");
    } else {
      print(`GitHub API error: ${res.status} ${res.statusText}`, "err");
    }
    return;
  }

  let repos;
  try {
    repos = await res.json();
  } catch {
    print("Could not parse the GitHub response.", "err");
    return;
  }

  if (!Array.isArray(repos)) {
    print("Unexpected response from GitHub.", "err");
    return;
  }

  const owned = repos.filter((r) => !r.fork && !r.archived);

  if (!owned.length) {
    print("No public repositories to show.", "dim");
    return;
  }

  owned.slice(0, 5).forEach((repo) => {
    printHTML(
      `• <a href="${escapeHTML(repo.html_url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(repo.name)}</a>` +
      `  <span class="out-dim">★ ${repo.stargazers_count}</span>`
    );
    if (repo.description) print(`  ${repo.description}`, "dim");
    if (repo.language) print(`  ${repo.language}`, "dim");
  });

  if (owned.length > 5) {
    print(`… and ${owned.length - 5} more.`, "dim");
    printLink("All repos", LINKS.github);
  }
}

/* ---------- dispatch ---------- */

function clearScreen() {
  output.innerHTML = "";
}

async function run(raw) {
  const parts = raw.trim().split(/\s+/);
  const name = (parts[0] || "").toLowerCase();
  const arg = parts[1] || "";

  switch (name) {
    case "":
      break;
    case "help":
    case "?":
      showHelp();
      break;
    case "about":
      print(SECTIONS.about);
      break;
    case "skills":
      print(SECTIONS.skills);
      break;
    case "experience":
      showExperience();
      break;
    case "projects":
      await showProjects();
      break;
    case "resume":
      openResume();
      break;
    case "contact":
      showContact();
      break;
    case "whoami":
      print(USER);
      break;
    case "date":
      print(new Date().toString());
      break;
    case "ls":
      listFiles();
      break;
    case "cat":
      catFile(arg);
      break;
    case "banner":
      showBanner();
      break;
    case "sound":
      toggleSound(arg.toLowerCase());
      break;
    case "clear":
      clearScreen();
      break;

    /* easter eggs */
    case "sudo":
      print(`${USER} is not in the sudoers file. This incident has been reported.`, "err");
      break;
    case "rm":
      if (arg === "-rf") {
        print("Nice try. This terminal is immutable infrastructure.", "warn");
      } else {
        print(`rm: missing operand`, "err");
      }
      break;
    case "exit":
    case "logout":
      print("Connection to portfolio closed.", "dim");
      print("…just kidding. Type 'help'.", "dim");
      break;

    default:
      print(`${name}: command not found. Type 'help'.`, "err");
  }
}

/* =========================
   INPUT
========================= */

const history = [];
let historyIndex = -1;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (cmd.disabled) return;

  const raw = cmd.value;
  cmd.value = "";

  promptLine(raw);

  if (raw.trim()) {
    history.unshift(raw.trim());
    if (history.length > 100) history.pop();
  }
  historyIndex = -1;

  await run(raw);
  print("");
});

cmd.addEventListener("keydown", (e) => {
  /* history */
  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (historyIndex + 1 < history.length) {
      historyIndex++;
      cmd.value = history[historyIndex];
      cmd.setSelectionRange(cmd.value.length, cmd.value.length);
    }
    return;
  }

  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      cmd.value = history[historyIndex];
    } else {
      historyIndex = -1;
      cmd.value = "";
    }
    cmd.setSelectionRange(cmd.value.length, cmd.value.length);
    return;
  }

  /* tab completion */
  if (e.key === "Tab") {
    e.preventDefault();
    const typed = cmd.value.trim().toLowerCase();
    if (!typed || typed.includes(" ")) return;

    const matches = COMMANDS.filter((c) => c.startsWith(typed));
    if (matches.length === 1) {
      cmd.value = matches[0] + (matches[0] === "cat" ? " " : "");
    } else if (matches.length > 1) {
      promptLine(cmd.value);
      print(matches.join("   "), "dim");
      cmd.value = commonPrefix(matches);
    }
    return;
  }

  /* Ctrl+L — clear */
  if (e.ctrlKey && e.key.toLowerCase() === "l") {
    e.preventDefault();
    clearScreen();
    return;
  }

  /* Ctrl+C — abandon the current line */
  if (e.ctrlKey && e.key.toLowerCase() === "c" && !window.getSelection().toString()) {
    e.preventDefault();
    promptLine(cmd.value + "^C");
    cmd.value = "";
    historyIndex = -1;
    return;
  }

  blip();
});

function commonPrefix(list) {
  let prefix = list[0];
  for (const item of list) {
    while (!item.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
}

/* Tapping anywhere refocuses the input — but never steal focus mid-selection
   or while the user is following a link. */
document.addEventListener("click", (e) => {
  if (cmd.disabled) return;
  if (e.target.closest("a")) return;
  if (window.getSelection().toString()) return;
  cmd.focus();
});

/* =========================
   START
========================= */

probeResume();
startBoot();

