const output = document.getElementById("output");
const cmd = document.getElementById("cmd");

const GITHUB_USERNAME = "cyberheister";

/* Helper */
function print(text = "") {
  const div = document.createElement("div");
  div.className = "command";
  div.textContent = text;
  output.appendChild(div);
}

/* ASCII Header */
function showHeader() {
  print("Soumalya Chandr — DevOps Engineer");
  print("AWS | Terraform | Jenkins | Docker | Kubernetes");
  print("");
  print("Type 'help' to see available commands.");
}

/* GitHub Projects */
async function showProjects() {
  print("Fetching GitHub repositories...");
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated`);
    const repos = await res.json();

    repos.slice(0, 5).forEach(repo => {
      print(`• ${repo.name} — ⭐ ${repo.stargazers_count}`);
      if (repo.description) {
        print(`  ${repo.description}`);
      }
    });
  } catch (err) {
    print("Unable to fetch repositories.");
  }
}

/* Command Handler */
cmd.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const value = cmd.value.trim();
    print(`$ ${value}`);

    switch (value) {
      case "help":
        print("about      → Professional summary");
        print("skills     → Technical skills");
        print("projects   → GitHub projects");
        print("resume     → Download resume");
        print("contact    → Contact info");
        print("clear      → Clear terminal");
        break;

      case "about":
        print(
          "DevOps Engineer with 6+ years of experience designing,\n" +
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

      default:
        print("Command not found. Type 'help'.");
    }

    cmd.value = "";
    output.scrollTop = output.scrollHeight;
  }
});

/* Start */
showHeader();