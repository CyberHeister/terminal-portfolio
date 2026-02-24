const output = document.getElementById("output");
const cmd = document.getElementById("cmd");

const USER = "soumalya";
const HOST = "portfolio";

/* Utility print */
function print(text = "") {
  const div = document.createElement("div");
  div.className = "command";
  div.textContent = text;
  output.appendChild(div);
  output.scrollTop = output.scrollHeight;
}

/* Prompt print */
function promptLine(command) {
  print(`${USER}@${HOST}:~$ ${command}`);
}

/* =========================
   SSH LOGIN SIMULATION
========================= */

const sshSequence = [
  `Connecting to ${USER}@${HOST}...`,
  "Authenticating with public key...",
  "Access granted.",
  ""
];

let sshStep = 0;

function startSSH() {
  if (sshStep < sshSequence.length) {
    print(sshSequence[sshStep]);
    sshStep++;
    setTimeout(startSSH, 600);
  } else {
    showHeader();
  }
}

/* =========================
   HEADER / INTRO
========================= */

function showHeader() {
  print("Soumalya Chandr — DevOps Engineer");
  print("AWS | Terraform | Jenkins | Docker | Kubernetes");
  print("");
  print("Type 'help' to see available commands.");
}

/* =========================
   GITHUB PROJECTS
========================= */

const GITHUB_USERNAME = "cyberheister";

async function showProjects() {
  print("Fetching GitHub repositories...");
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated`
    );
    const repos = await res.json();

    repos.slice(0, 5).forEach(repo => {
      print(`• ${repo.name}  ⭐ ${repo.stargazers_count}`);
      if (repo.description) {
        print(`  ${repo.description}`);
      }
    });
  } catch {
    print("Failed to fetch repositories.");
  }
}

/* =========================
   COMMAND HANDLER
========================= */

cmd.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const value = cmd.value.trim();
    promptLine(value);

    switch (value) {
      case "help":
        print("about      → Professional summary");
        print("skills     → Technical skills");
        print("projects   → GitHub projects");
        print("resume     → Download resume");
        print("contact    → Contact details");
        print("clear      → Clear terminal");
        break;

      case "about":
        print(
          "DevOps Engineer with 6+ years of experience building,\n" +
          "automating, and operating AWS cloud infrastructure.\n" +
          "Strong focus on CI/CD, IaC, security, and cost optimization."
        );
        break;

      case "skills":
        print(
          "AWS, Terraform, Jenkins, GitHub Actions,\n" +
          "Docker, Kubernetes, Python, Bash, Linux"
        );
        break;

      case "projects":
        await showProjects();
        break;

      case "resume":
        window.open("resume.pdf", "_blank");
        print("Opening resume...");
        break;

      case "contact":
        print("GitHub   : https://github.com/cyberheister");
        print("LinkedIn : https://linkedin.com/in/yourprofile");
        break;

      case "clear":
        output.innerHTML = "";
        break;

      case "":
        break;

      default:
        print("Command not found. Type 'help'.");
    }

    cmd.value = "";
  }
});

/* =========================
   START
========================= */

startSSH();