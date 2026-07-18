#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import prompts from 'prompts';
import pc from 'picocolors';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_DIR = path.resolve(__dirname, '../template');

const DEPENDENCIES = {
  "@react-email/components": "^1.0.12",
  "@react-email/render": "^2.0.9",
  "bullmq": "^5.34.4",
  "ioredis": "^5.4.2",
  "nodemailer": "^8.0.11",
  "react": "^19.2.7",
  "react-dom": "^19.2.7",
  "twilio": "^5.4.3"
};

const DEV_DEPENDENCIES = {
  "@types/node": "^20.0.0",
  "@types/nodemailer": "^8.0.1",
  "@types/react": "^19.2.17",
  "@types/react-dom": "^19.2.3"
};

const ENV_VARIABLES = `
# Notification System Credentials
REDIS_URL="redis://localhost:6379"
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="your-smtp-user"
SMTP_PASS="your-smtp-pass"
SMTP_FROM="noreply@example.com"
TWILIO_ACCOUNT_SID="your-twilio-sid"
TWILIO_AUTH_TOKEN="your-twilio-token"
TWILIO_PHONE_NUMBER="+1234567890"
`;

function detectPackageManager(targetDir) {
  if (fs.existsSync(path.join(targetDir, 'pnpm-lock.yaml')) || fs.existsSync(path.join(targetDir, '../pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(targetDir, 'yarn.lock')) || fs.existsSync(path.join(targetDir, '../yarn.lock'))) return 'yarn';
  if (fs.existsSync(path.join(targetDir, 'bun.lockb')) || fs.existsSync(path.join(targetDir, '../bun.lockb'))) return 'bun';
  return 'npm';
}

function isMonorepo(cwd) {
  return fs.existsSync(path.join(cwd, 'pnpm-workspace.yaml')) || fs.existsSync(path.join(cwd, 'lerna.json')) || fs.existsSync(path.join(cwd, 'packages'));
}

async function main() {
  console.log(pc.cyan(pc.bold('Welcome to the Notification System Scaffolding Tool! 🚀')));
  console.log();

  const cwd = process.cwd();
  const monorepo = isMonorepo(cwd);
  
  const defaultDir = monorepo ? './packages/notifications' : './src/notifications';

  const response = await prompts([
    {
      type: 'text',
      name: 'targetDir',
      message: 'Where would you like to install the notification system?',
      initial: defaultDir
    },
    {
      type: 'select',
      name: 'packageManager',
      message: 'Which package manager do you use?',
      choices: [
        { title: 'Auto-detect', value: 'auto' },
        { title: 'npm', value: 'npm' },
        { title: 'pnpm', value: 'pnpm' },
        { title: 'yarn', value: 'yarn' },
        { title: 'bun', value: 'bun' }
      ],
      initial: 0
    }
  ]);

  if (!response.targetDir) {
    console.log(pc.red('Installation cancelled.'));
    process.exit(1);
  }

  const targetPath = path.resolve(cwd, response.targetDir);
  
  // 1. Copy Template Files
  console.log(pc.blue(`\nCopying notification system files to ${pc.green(response.targetDir)}...`));
  fs.ensureDirSync(targetPath);
  fs.copySync(TEMPLATE_DIR, targetPath);
  
  // Create a default package.json in the target dir if it's a monorepo package
  const packageJsonPath = path.join(targetPath, 'package.json');
  if (monorepo && !fs.existsSync(packageJsonPath)) {
    fs.writeFileSync(packageJsonPath, JSON.stringify({
      name: "@your-org/notifications",
      version: "1.0.0",
      private: true,
      main: "index.ts",
      type: "module"
    }, null, 2));
  }
  
  // 2. Inject Dependencies
  const hostPackageJsonPath = monorepo ? packageJsonPath : path.join(cwd, 'package.json');
  if (fs.existsSync(hostPackageJsonPath)) {
    console.log(pc.blue('Injecting dependencies into package.json...'));
    const pkg = fs.readJsonSync(hostPackageJsonPath);
    pkg.dependencies = { ...pkg.dependencies, ...DEPENDENCIES };
    pkg.devDependencies = { ...pkg.devDependencies, ...DEV_DEPENDENCIES };
    fs.writeJsonSync(hostPackageJsonPath, pkg, { spaces: 2 });
  } else {
    console.log(pc.yellow('No package.json found. You will need to install dependencies manually.'));
  }

  // 3. Update .env
  const envPath = path.join(cwd, '.env');
  console.log(pc.blue('Updating .env file...'));
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (!envContent.includes('REDIS_URL')) {
      fs.appendFileSync(envPath, `\n${ENV_VARIABLES}`);
    }
  } else {
    fs.writeFileSync(envPath, ENV_VARIABLES);
  }

  // 4. Install Dependencies
  let pm = response.packageManager;
  if (pm === 'auto') {
    pm = detectPackageManager(monorepo ? targetPath : cwd);
  }
  
  console.log(pc.blue(`Installing dependencies using ${pm}...`));
  try {
    const installCmd = pm === 'yarn' ? 'yarn install' : `${pm} install`;
    const installDir = monorepo ? targetPath : cwd;
    execSync(installCmd, { stdio: 'inherit', cwd: installDir });
    console.log(pc.green('✔ Dependencies installed successfully.'));
  } catch (err) {
    console.log(pc.yellow('Failed to install dependencies automatically. Please run install manually.'));
  }

  console.log(pc.green(pc.bold('\n✨ Notification system installed successfully! ✨\n')));
  console.log('Next steps:');
  console.log(`  1. Update the credentials in ${pc.cyan('.env')}`);
  console.log(`  2. Import and use the notification system from ${pc.cyan(response.targetDir)}\n`);
}

main().catch(console.error);
