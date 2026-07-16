#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

// Simple ANSI colors for console output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
}

const args = process.argv.slice(2)
const command = args[0]
const targetComponent = args[1]

if (!command || command !== "add") {
  console.log(`\n${colors.red}Error: Invalid command.${colors.reset}`)
  console.log(`Usage: npx custs add <componentName>`)
  console.log(`   or: npx custs add all\n`)
  process.exit(1)
}

if (!targetComponent) {
  console.log(`\n${colors.red}Error: No component specified.${colors.reset}`)
  console.log(`Usage: npx custs add <componentName>\n`)
  process.exit(1)
}

const templatesDir = path.join(__dirname, "templates")

if (!fs.existsSync(templatesDir)) {
  console.log(`\n${colors.red}Error: Templates directory not found at ${templatesDir}.${colors.reset}\n`)
  process.exit(1)
}

// Determine destination folder (support for both Next.js/Vite with or without `src` folder)
const cwd = process.cwd()
const hasSrcFolder = fs.existsSync(path.join(cwd, "src"))
const destDir = path.join(cwd, hasSrcFolder ? "src" : "", "components", "custom-components")

function processComponentContent(content) {
  // Rewrite standard monorepo @workspace aliases to standard single-repo Shadcn aliases
  let newContent = content.replace(/@workspace\/ui\/components\//g, "@/components/ui/")
  newContent = newContent.replace(/@workspace\/ui\/lib\/utils/g, "@/lib/utils")
  
  // Since some components might use internal aliases like @/components/molecules/...,
  // We'll leave them as @/components/... but warn the user in README that they might need adjustments.
  return newContent
}

function copyComponent(componentFileName) {
  const sourcePath = path.join(templatesDir, componentFileName)
  const destPath = path.join(destDir, componentFileName)

  if (!fs.existsSync(sourcePath)) {
    console.log(`${colors.red}✗ Component '${componentFileName}' not found in registry.${colors.reset}`)
    return
  }

  // Ensure destination directory exists
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  const content = fs.readFileSync(sourcePath, "utf-8")
  const transformedContent = processComponentContent(content)

  fs.writeFileSync(destPath, transformedContent, "utf-8")
  console.log(`${colors.green}✓ Installed ${componentFileName} to ${path.relative(cwd, destPath)}${colors.reset}`)
}

if (targetComponent === "all") {
  console.log(`\n${colors.cyan}Installing all custom components...${colors.reset}\n`)
  const files = fs.readdirSync(templatesDir).filter((file) => file.endsWith(".tsx"))
  
  if (files.length === 0) {
    console.log(`${colors.yellow}No components found in templates directory.${colors.reset}`)
  } else {
    files.forEach(copyComponent)
    console.log(`\n${colors.green}🎉 Successfully installed ${files.length} components!${colors.reset}\n`)
  }
} else {
  // Try to append .tsx if user didn't provide it
  const fileName = targetComponent.endsWith(".tsx") ? targetComponent : `${targetComponent}.tsx`
  console.log(`\n${colors.cyan}Installing ${fileName}...${colors.reset}\n`)
  copyComponent(fileName)
}
