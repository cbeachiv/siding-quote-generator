# Siding Quote Generator

A simple quote calculator for siding jobs. Enter your materials, labor rates, measurements, and target profit margin — get an instant quote price.

---

## Greg's Setup Guide: From Zero to Running

This guide assumes you're starting from scratch on a Mac. Follow every step in order.

---

### Understanding the Tools (Sports Analogies)

Before we start installing things, here's what each tool does and why you need it:

| Tool | Sports Analogy | What It Does |
|------|---------------|--------------|
| **GitHub** | The Stadium / League HQ | Where the official version of the code lives online. Like the league vault where all the official game tape is stored. Anyone with access can grab a copy. |
| **Git** | The Playbook System | Tracks every change ever made to the code. Imagine if every time a coach tweaked a play, the old version was perfectly preserved. You can always go back. |
| **VS Code** | The Film Room | Your workspace where you open, read, and edit code files. A comfortable environment with everything highlighted and organized. |
| **Node.js** | The Electricity | Powers other tools (like Claude Code). You install it once and forget about it — it just needs to be there. |
| **Claude Code** | Your AI Assistant Coach | An AI that reads your entire codebase and makes changes when you ask in plain English. You say "add a new material type" and it does the work. |

**The big picture:** You're going to download the playbook (clone the repo), set up your film room (VS Code), and hire an assistant coach (Claude Code) who can make changes for you whenever you want.

---

### Step 1: Create a GitHub Account

*This is like registering for the league — you only do it once.*

1. Open your web browser and go to **github.com**
2. Click **"Sign up"**
3. Enter your email address
4. Create a password
5. Choose a username (e.g., `gregs-siding` or whatever you like)
6. Complete the verification puzzle
7. Check your email and click the verification link

---

### Step 2: Install VS Code (The Film Room)

*You're building the room where you'll study and edit the plays.*

1. Go to **code.visualstudio.com** in your browser
2. Click the big **"Download for Mac"** button
3. Open the downloaded `.zip` file — it'll unzip into an app called **Visual Studio Code**
4. **Drag it into your Applications folder**
5. Open it from Applications (or press `Cmd + Space`, type "Visual Studio Code", and hit Enter)
6. If macOS asks "Are you sure you want to open it?" — click **Open**

---

### Step 3: Install Git (The Playbook System)

*This is the system that tracks every version of every change.*

1. Open the **Terminal** app (press `Cmd + Space`, type "Terminal", hit Enter)
2. Type this and press Enter:
   ```
   git --version
   ```
3. **If a popup appears** asking to install "Command Line Developer Tools" — click **Install** and wait (this may take a few minutes)
4. Once it's done, type `git --version` again — you should see something like `git version 2.39.0`
5. Now tell Git who you are (replace with your real name and email):
   ```
   git config --global user.name "Greg YourLastName"
   ```
   ```
   git config --global user.email "greg@youremail.com"
   ```

---

### Step 4: Clone the Repository (Get Your Copy of the Playbook)

*You're downloading the official playbook to your own laptop.*

1. Open **VS Code**
2. Press `Cmd + Shift + P` (this opens the Command Palette — think of it as a search bar for actions)
3. Type **Git: Clone** and click on it
4. Paste this URL:
   ```
   https://github.com/cbeachiv/siding-quote-generator.git
   ```
5. It will ask you to pick a folder — choose your **Desktop** (or wherever you want the project to live)
6. Click **"Select as Repository Destination"**
7. When it asks **"Would you like to open the cloned repository?"** — click **Open**
8. You should now see the project files in the left sidebar: `index.html`, `styles.css`, `app.js`

---

### Step 5: Open the Quote Generator

*Time to see the playbook in action.*

The simplest way — no VS Code needed:

1. Open **Finder**
2. Navigate to where you cloned the project (e.g., Desktop > `siding-quote-generator`)
3. **Double-click `index.html`**
4. It opens in your web browser — that's the quote generator!
5. **Bookmark this page** for quick access

**To set it up:**
1. Click **"Settings & Rates"** to expand the settings panel
2. Add your materials with their costs per square foot
3. Set your extras rates (windows, trim, corners, etc.)
4. Click **"Save Extras Rates"**
5. Your settings are saved automatically and will be there next time you open it

---

### Step 6: Install Node.js (The Electricity)

*Claude Code needs Node.js to run — think of it as the power supply for the assistant coach's headset. You install it once and forget about it.*

1. Go to **nodejs.org** in your browser
2. Click the big green **LTS** button (LTS = the stable version)
3. Open the downloaded installer
4. Click **Continue** through each step, then **Install**
5. Enter your Mac password when asked
6. Once finished, verify it worked. Open **Terminal** and type:
   ```
   node --version
   ```
   You should see a version number like `v22.x.x`

---

### Step 7: Install Claude Code (Your AI Assistant Coach)

*You're hiring an assistant coach who already knows every play in the book. You tell them what you want in plain English, and they make it happen.*

1. Open **Terminal**
2. Install Claude Code by typing:
   ```
   npm install -g @anthropic-ai/claude-code
   ```
   Wait for it to finish (you'll see a progress bar, then it'll return to the prompt)
3. Navigate to your project folder:
   ```
   cd ~/Desktop/siding-quote-generator
   ```
   *(Change this path if you cloned the project somewhere else)*
4. Launch Claude Code:
   ```
   claude
   ```
5. **First time only:** It will ask you to log in:
   - It will open a browser window to **console.anthropic.com**
   - Create an Anthropic account (or sign in if you have one)
   - You'll need to add billing info — Claude Code usage is billed per use (a few cents per conversation typically)
   - Once logged in, go back to Terminal — it should be connected

---

### Step 8: Talk to Claude Code

*Walk into the film room, call the coach over, and tell them what you want.*

Once Claude Code is running (you'll see a prompt waiting for your input), just type what you want in plain English. Examples:

- **"Add a new material called Stone Veneer"**
- **"Change the default profit margin to 25%"**
- **"Make the print view include my business name 'Greg's Siding Co' and phone number 555-123-4567"**
- **"Add a field for waste factor percentage"**
- **"Make the windows extra also account for window size — small, medium, and large"**
- **"Add a notes field where I can type special instructions for each job"**

Claude Code will read your files, make the changes, and show you what it did. You can review the changes and say "looks good" or "actually, change it to..."

**To exit Claude Code:** type `/exit` or press `Ctrl + C`

**To start it again later:**
1. Open Terminal
2. `cd ~/Desktop/siding-quote-generator`
3. `claude`

---

### Quick Reference

| What You Want to Do | How to Do It |
|---------------------|-------------|
| **Use the quote generator** | Double-click `index.html` in Finder (or use your bookmark) |
| **Make changes with AI** | Open Terminal → `cd ~/Desktop/siding-quote-generator` → `claude` → type what you want |
| **View/edit code manually** | Open VS Code → File → Open Folder → pick `siding-quote-generator` |

---

### Glossary

| Term | Plain English |
|------|--------------|
| **Repository (repo)** | A project folder tracked by Git — your playbook |
| **Clone** | Download a copy of someone's project — getting your own copy of the playbook |
| **Commit** | Save a snapshot of changes — like filing an updated play |
| **Terminal** | The text-based command line on your Mac — where you type commands |
| **npm** | A tool that installs JavaScript packages — like an app store for developer tools |
