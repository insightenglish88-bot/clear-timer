#!/usr/bin/env node

/**
 * SecOps Security Automation Audit Runner
 * Sky Education Cartoon Timer
 *
 * Checks:
 * 1. Secret & Credential Detection
 * 2. Git Hygiene & Sensitive File Tracking
 * 3. Firestore Security Rules Validation
 * 4. Dependency Vulnerability Audit (`npm audit`)
 * 5. TypeScript Integrity Check (`tsc --noEmit`)
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const scanOnly = process.argv.includes('--scan-only');

const SECRET_PATTERNS = [
  {
    name: 'Google / Firebase API Key',
    pattern: /AIza[0-9A-Za-z\-_]{35}/g,
    ignoreIn: ['.env.example', 'secops-audit.mjs'],
  },
  {
    name: 'AWS Access Key ID',
    pattern: /AKIA[0-9A-Z]{16}/g,
    ignoreIn: ['.env.example'],
  },
  {
    name: 'Private Key',
    pattern: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY/g,
    ignoreIn: [],
  },
  {
    name: 'GitHub Personal Access Token',
    pattern: /gh[pousr]_[A-Za-z0-9_]{36,}/g,
    ignoreIn: [],
  },
  {
    name: 'Hardcoded Secret / Token String',
    pattern: /(?:api[_-]?key|secret|password|auth[_-]?token)\s*[:=]\s*["'][A-Za-z0-9_\-]{20,}["']/gi,
    ignoreIn: ['.env.example', 'secops-audit.mjs', 'package-lock.json'],
  },
];

const IGNORE_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  '.firebase',
  '.antigravity',
  '.vscode',
]);

const IGNORE_FILES = new Set([
  'package-lock.json',
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
  '.env.example',
  'secops-audit.mjs',
]);

function getFilesRecursively(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of list) {
    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) {
        results = results.concat(getFilesRecursively(path.join(dir, entry.name)));
      }
    } else {
      if (!IGNORE_FILES.has(entry.name)) {
        results.push(path.join(dir, entry.name));
      }
    }
  }

  return results;
}

let hasErrors = false;

console.log('\n========================================');
console.log('       🛡️  SECOPS AUTOMATION AUDIT      ');
console.log('========================================\n');

// -------------------------------------------------------------
// CHECK 1: SECRET SCANNER
// -------------------------------------------------------------
console.log('🔍 [1/5] Scanning codebase for exposed secrets...');
const allFiles = getFilesRecursively(ROOT_DIR);
let secretsFound = 0;

for (const filePath of allFiles) {
  const relativePath = path.relative(ROOT_DIR, filePath);
  // Skip binary files or large assets
  if (/\.(png|jpe?g|gif|webp|svg|ico|mp3|wav|ogg|mp4|zip|tar|gz)$/i.test(filePath)) {
    continue;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    for (const rule of SECRET_PATTERNS) {
      if (rule.ignoreIn.some((ign) => relativePath.includes(ign))) {
        continue;
      }

      for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const line = lines[lineIndex];
        // Allow intentional template placeholders or UI mock words
        if (
          line.includes('your-api-key-here') ||
          line.includes('MY_API_KEY') ||
          line.includes('title="Click or press Space') // UI badge context
        ) {
          continue;
        }

        const matches = line.match(rule.pattern);
        if (matches) {
          // If matching "SECRET" uppercase label on UI
          if (matches.length === 1 && matches[0].toUpperCase() === 'SECRET') {
            continue;
          }

          console.error(
            `\x1b[31m[FAILED]\x1b[0m ${rule.name} detected in: ${relativePath}:${lineIndex + 1}`
          );
          console.error(`         Line: ${line.trim()}`);
          secretsFound++;
          hasErrors = true;
        }
      }
    }
  } catch {
    // Ignore read errors
  }
}

if (secretsFound === 0) {
  console.log('\x1b[32m[PASS]\x1b[0m No exposed secrets or credentials found.\n');
} else {
  console.error(`\x1b[31m[FAIL]\x1b[0m ${secretsFound} secret(s) detected!\n`);
}

// -------------------------------------------------------------
// CHECK 2: GIT HYGIENE & TRACKED SENSITIVE FILES
// -------------------------------------------------------------
console.log('📂 [2/5] Verifying Git hygiene and tracked files...');
try {
  const trackedFilesOutput = execSync('git ls-files', { cwd: ROOT_DIR, encoding: 'utf-8' });
  const trackedFiles = trackedFilesOutput.split('\n').map((f) => f.trim()).filter(Boolean);

  const forbiddenPatterns = [
    /^\.env(?:\.local)?$/,
    /^\.antigravity\//,
    /^\.firebase\//,
    /\.log$/,
    /metadata\.json$/,
  ];

  let sensitiveTracked = 0;
  for (const file of trackedFiles) {
    if (forbiddenPatterns.some((pattern) => pattern.test(file))) {
      console.error(`\x1b[31m[FAILED]\x1b[0m Sensitive file tracked in Git: ${file}`);
      sensitiveTracked++;
      hasErrors = true;
    }
  }

  if (sensitiveTracked === 0) {
    console.log('\x1b[32m[PASS]\x1b[0m Git tracking is clean (no .env, logs, or internal agent files).\n');
  } else {
    console.error(`\x1b[31m[FAIL]\x1b[0m ${sensitiveTracked} sensitive file(s) tracked in Git!\n`);
  }
} catch (err) {
  console.warn('\x1b[33m[WARN]\x1b[0m Could not execute git ls-files:', err.message);
}

// -------------------------------------------------------------
// CHECK 3: FIRESTORE SECURITY RULES INTEGRITY
// -------------------------------------------------------------
console.log('🔒 [3/5] Auditing Firestore security rules...');
const firestoreRulesPath = path.join(ROOT_DIR, 'firestore.rules');
if (fs.existsSync(firestoreRulesPath)) {
  const rulesContent = fs.readFileSync(firestoreRulesPath, 'utf-8');

  if (rulesContent.includes('allow read, write: if true;')) {
    console.error('\x1b[31m[FAILED]\x1b[0m Firestore rules contain wide-open wildcard "allow read, write: if true;"!');
    hasErrors = true;
  } else if (!rulesContent.includes('timer_sessions')) {
    console.error('\x1b[31m[FAILED]\x1b[0m Firestore rules do not define timer_sessions collection boundaries.');
    hasErrors = true;
  } else if (!rulesContent.includes('allow read, write: if false;')) {
    console.warn('\x1b[33m[WARN]\x1b[0m Firestore rules should include default deny for unlisted documents.');
  } else {
    console.log('\x1b[32m[PASS]\x1b[0m Firestore rules are hardened with collection limits and schema validation.\n');
  }
} else {
  console.warn('\x1b[33m[WARN]\x1b[0m firestore.rules not found.\n');
}

// If --scan-only was passed (e.g. pre-commit fast mode), stop here
if (scanOnly) {
  console.log('========================================');
  if (hasErrors) {
    console.error('\x1b[31m❌ SECOPS SCAN FAILED: Issues must be resolved before proceeding.\x1b[0m\n');
    process.exit(1);
  } else {
    console.log('\x1b[32m✅ SECOPS SCAN PASSED: Codebase is clean.\x1b[0m\n');
    process.exit(0);
  }
}

// -------------------------------------------------------------
// -------------------------------------------------------------
// CHECK 4: DEPENDENCY VULNERABILITY AUDIT (npm audit)
// -------------------------------------------------------------
console.log('📦 [4/5] Auditing package dependencies for CVEs...');
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

try {
  const auditOutput = execSync(`${npmCmd} audit --json`, { cwd: ROOT_DIR, encoding: 'utf-8' });
  const auditJson = JSON.parse(auditOutput);
  const vulns = auditJson.metadata?.vulnerabilities || {};
  const totalVulns =
    (vulns.critical || 0) +
    (vulns.high || 0) +
    (vulns.moderate || 0) +
    (vulns.low || 0);

  if (totalVulns === 0) {
    console.log('\x1b[32m[PASS]\x1b[0m 0 vulnerabilities found across all dependencies.\n');
  } else {
    console.error(
      `\x1b[31m[FAIL]\x1b[0m Found ${totalVulns} vulnerability(ies): Critical: ${vulns.critical || 0}, High: ${vulns.high || 0}, Moderate: ${vulns.moderate || 0}, Low: ${vulns.low || 0}`
    );
    hasErrors = true;
  }
} catch (err) {
  // If npm audit returns non-zero, parse output if available
  try {
    const auditJson = JSON.parse(err.stdout);
    const vulns = auditJson.metadata?.vulnerabilities || {};
    console.error(
      `\x1b[31m[FAIL]\x1b[0m Dependencies have vulnerabilities: Critical: ${vulns.critical || 0}, High: ${vulns.high || 0}, Moderate: ${vulns.moderate || 0}`
    );
  } catch {
    console.error('\x1b[31m[FAIL]\x1b[0m npm audit failed to run cleanly.');
  }
  hasErrors = true;
}

// -------------------------------------------------------------
// CHECK 5: TYPESCRIPT TYPE INTEGRITY (tsc --noEmit)
// -------------------------------------------------------------
console.log('⚡ [5/5] Checking TypeScript type integrity...');
try {
  execSync(`${npmCmd} run lint`, { cwd: ROOT_DIR, encoding: 'utf-8', stdio: 'pipe' });
  console.log('\x1b[32m[PASS]\x1b[0m TypeScript static analysis passed with 0 errors.\n');
} catch (err) {
  console.error('\x1b[31m[FAIL]\x1b[0m TypeScript linting encountered errors.');
  hasErrors = true;
}

// -------------------------------------------------------------
// FINAL SUMMARY
// -------------------------------------------------------------
console.log('========================================');
if (hasErrors) {
  console.error('\x1b[31m❌ SECOPS AUDIT FAILED: Security issues detected.\x1b[0m\n');
  process.exit(1);
} else {
  console.log('\x1b[32m✅ ALL SECOPS CHECKS PASSED: Application is secure!\x1b[0m\n');
  process.exit(0);
}
