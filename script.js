/************************
 * MATRIX BACKGROUND
 ************************/
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = Array.from({ length: columns }).fill(1);

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00ff88";
  ctx.font = fontSize + "px monospace";

  drops.forEach((y, i) => {
    const text = letters.charAt(Math.random() * letters.length);
    ctx.fillText(text, i * fontSize, y * fontSize);
    drops[i] = y * fontSize > canvas.height || Math.random() > 0.95 ? 0 : y + 1;
  });
}

setInterval(drawMatrix, 50);

/************************
 * TERMINAL LOGIC
 ************************/
const output = document.getElementById("output");
const cmd = document.getElementById("cmd");
const sound = document.getElementById("typeSound");

function playSound() {
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

/* ASCII ART */
function showAscii() {
  output.innerHTML += `
<pre class="command">
   ____                  _                 
  / ___|  ___  _   _  __| | ___  _ __ ___  
  \\___ \\ / _ \\| | | |/ _\` |/ _ \\| '_ \` _ \\ 
   ___) | (_) | |_| | (_| | (_) | | | | | |
  |____/ \\___/ \\__,_|\\__,_|\\___/|_| |_| |_|
</pre>
`;
}

/* SSH Boot Sequence */
const boot = [
  "Connecting to soumalya@portfolio...",
  "Authenticating with public key...",
  "Access granted.",
  ""
];

let b = 0;

function bootSequence() {
  if (b < boot.length) {
    output.innerHTML += `<div class="command">${boot[b]}</div>`;
    playSound();
    b++;
    setTimeout(bootSequence, 600);
  } else {
    showAscii();
    printIntro();
  }
}

/* Initial Commands */
const introCommands = [
  "whoami",
  "Soumalya Chandr - DevOps Engineer (6+ YOE)",
  "",
  "ls skills/",
  "AWS  Terraform  Jenkins  Docker  Kubernetes  Python",
  "",
  "cat about.txt",
  "I design, automate, and optimize scalable AWS cloud infrastructure.",
  "",
  "Type 'help' to see available commands."
];

let i = 0;

function printIntro() {
  if (i < introCommands.length) {
    output.innerHTML += `<div class="command">${introCommands[i]}</div>`;
    playSound();
    i++;
    setTimeout(printIntro, 500);
  }
}

/* Interactive Commands */
cmd.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const value = cmd.value.trim();
    output.innerHTML += `<div class="command">$ ${value}</div>`;
    playSound();

    switch (value) {
      case "help":
        output.innerHTML += `<div class="command">
about      - About me
skills     - Technical skills
projects   - My projects
contact    - Contact info
clear      - Clear terminal
</div>`;
        break;

      case "about":
        output.innerHTML += `<div class="command">
DevOps Engineer focused on AWS, CI/CD automation,
security best practices, and cost optimization.
</div>`;
        break;

      case "skills":
        output.innerHTML += `<div class="command">
AWS | Terraform | Jenkins | Docker | Kubernetes | Python | GitHub Actions
</div>`;
        break;

      case "projects":
        output.innerHTML += `<div class="command">
1. AWS Cost Optimizer
2. CI/CD Automation Pipelines
3. Tax Consultancy SaaS (In Progress)
</div>`;
        break;

      case "contact":
        output.innerHTML += `<div class="command">
GitHub  : https://github.com/yourusername
LinkedIn: https://linkedin.com/in/yourprofile
</div>`;
        break;

      case "clear":
        output.innerHTML = "";
        break;

      default:
        output.innerHTML += `<div class="command">Command not found: ${value}</div>`;
    }

    cmd.value = "";
    output.scrollTop = output.scrollHeight;
  }
});

/* Start */
bootSequence();