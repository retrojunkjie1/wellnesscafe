git commit -m "feat: Implement new Luxury Navbar with mega-menus and mobile support"git push origin main#!/bin/bash
# 🧠 WELLNESSCAFE AI — VS CODE OPTIMIZATION SCRIPT
# ------------------------------------------------
# This script cleans your environment, optimizes VS Code,
# fixes slowdowns, removes conflicting extensions,
# installs only the essential tools, refreshes Vite,
# and sets up the project-level config for the luxury AI engine.

echo "🔧 Starting WellnessCafeAI VS Code Optimization…"

###############################################################################
# 1. REMOVE BAD / PROBLEMATIC EXTENSIONS
###############################################################################
code --uninstall-extension kisstkondoros.vscode-codemetrics || true
code --uninstall-extension formulahendry.auto-close-tag || true
code --uninstall-extension formulahendry.auto-rename-tag || true
code --uninstall-extension HookyQR.beautify || true
code --uninstall-extension dbaeumer.jshint || true
code --uninstall-extension ms-vscode.vscode-typescript-tslint-plugin || true
code --uninstall-extension streetsidesoftware.code-spell-checker || true

echo "✔ Removed conflicting and slow extensions."

###############################################################################
# 2. INSTALL ONLY ELITE EXTENSIONS
###############################################################################
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension bradlc.vscode-tailwindcss
code --install-extension eamodio.gitlens
code --install-extension usernamehw.errorlens
code --install-extension ritwickdey.liveserver || true
code --install-extension visualstudioexptteam.vscodeintellicode || true

echo "✔ Installed essential high-performance extensions."

###############################################################################
# 3. APPLY USER-LEVEL VS CODE SETTINGS
###############################################################################
SETTINGS_PATH="$HOME/Library/Application Support/Code/User/settings.json"

mkdir -p "$(dirname "$SETTINGS_PATH")"

cat > "$SETTINGS_PATH" << 'EOF'
{
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  "javascript.format.enable": false,
  "typescript.format.enable": false,

  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
  "eslint.run": "onType",
  "eslint.alwaysShowStatus": true,

  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },

  "editor.minimap.enabled": false,
  "terminal.integrated.gpuAcceleration": "on",
  "terminal.integrated.defaultProfile.osx": "zsh",

  "files.autoSave": "onFocusChange",
  "explorer.confirmDelete": false,
  "explorer.confirmDragAndDrop": false,

  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true
  },

  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.turbo": true,
    "**/.next": true
  },

  "editor.inlineSuggest.enabled": true,
  "editor.suggestSelection": "first",

  "typescript.tsserver.maxTsServerMemory": 4096,
  "javascript.suggest.autoImports": true,

  "firebase.enableCrashReporting": false,
  "firebase.enableTelemetry": false,

  "editor.largeFileOptimizations": true,
  "editor.fastScrollSensitivity": 3
}
EOF

echo "✔ Applied global editor settings."

###############################################################################
# 4. CREATE PROJECT-LEVEL CONFIG (.vscode/settings.json)
###############################################################################
mkdir -p .vscode

cat > .vscode/settings.json << 'EOF'
{
  "editor.tabSize": 2,
  "editor.wordWrap": "on",

  "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/node_modules/**": true,
    "**/dist/**": true
  },

  "eslint.workingDirectories": [
    { "mode": "auto" }
  ]
}
EOF

echo "✔ Created project-level VS Code settings."

###############################################################################
# 5. CLEAN VITE CACHES AND REINSTALL DEPENDENCIES
###############################################################################
rm -rf node_modules/.vite || true
rm -rf node_modules/.cache || true
rm -rf node_modules || true
rm -rf dist || true

echo "✔ Removed stale caches."

npm install

echo "✔ Dependencies reinstalled."

###############################################################################
# 6. CLEAR PORT CONFLICTS (3000–3005)
###############################################################################
sudo lsof -ti:3000,3001,3002,3003,3004,3005 | xargs sudo kill -9 2>/dev/null || true

echo "✔ Freed ports used by Vite."

###############################################################################
# 7. UPDATE VITE CONFIG FOR SAFE PORT FALLBACK
###############################################################################
if [ -f "vite.config.js" ]; then
  if ! grep -q "strictPort" vite.config.js; then
    sed -i "" '/server:/a\
    \ \ \ \ strictPort: false,
    ' vite.config.js
  fi
fi

echo "✔ Updated Vite config (safe fallback ports)."

###############################################################################
# 8. SHELL INTEGRATION FIX (zsh)
###############################################################################
/bin/zsh -i -c "code --install-shell-command" || true

echo "✔ Shell integration enabled."

###############################################################################
# 9. MOVE VS CODE OUT OF READ-ONLY (IF NEEDED)
###############################################################################
if [[ "$PWD" == /Volumes/* ]]; then
  echo "⚠️ VS Code is running from a read-only volume!"
  echo "Please drag Visual Studio Code.app into /Applications."
fi

echo "🎉 WellnessCafeAI VS Code optimization COMPLETE!"
echo "Restart VS Code now."
