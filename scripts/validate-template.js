#!/usr/bin/env node

/**
 * Template Validation Script
 *
 * Validates that a Uhuu template meets minimum requirements
 * Usage: node scripts/validate-template.js [template-path]
 */

const { existsSync, readFileSync, readdirSync, statSync } = require('fs');
const { join, resolve } = require('path');

const REQUIRED_FILES = [
  'package.json',
  'vite.config.mjs',
  'test/sample_data.json'
];

const RECOMMENDED_FILES = [
  'README.md'
];

function readSourceFiles(directory) {
  if (!existsSync(directory)) return '';

  return readdirSync(directory).map((entry) => {
    const filePath = join(directory, entry);
    const stat = statSync(filePath);

    if (stat.isDirectory()) return readSourceFiles(filePath);
    if (!/\.(jsx?|tsx?)$/.test(entry)) return '';

    return readFileSync(filePath, 'utf-8');
  }).join('\n');
}

function validateTemplate(templatePath) {
  const errors = [];
  const warnings = [];
  const info = [];

  console.log('🔍 Validating template:', templatePath);
  console.log('');

  // Check required files
  console.log('📁 Checking required files...');
  for (const file of REQUIRED_FILES) {
    const filePath = join(templatePath, file);
    if (!existsSync(filePath)) {
      errors.push(`Missing required file: ${file}`);
    } else {
      info.push(`✓ ${file}`);
    }
  }

  const appEntries = ['src/App.tsx', 'src/App.jsx'];
  const appPath = appEntries.map((file) => join(templatePath, file)).find((filePath) => existsSync(filePath));
  if (!appPath) {
    errors.push('Missing required file: src/App.tsx or src/App.jsx');
  } else {
    info.push(`✓ ${appPath.replace(`${templatePath}/`, '')}`);
  }

  // Check recommended files
  console.log('\n📋 Checking recommended files...');
  for (const file of RECOMMENDED_FILES) {
    const filePath = join(templatePath, file);
    if (!existsSync(filePath)) {
      warnings.push(`Missing recommended file: ${file}`);
    } else {
      info.push(`✓ ${file}`);
    }
  }

  // Validate package.json
  console.log('\n📦 Validating package.json...');
  const packageJsonPath = join(templatePath, 'package.json');
  if (existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

      // Check for uhuu-components dependency
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      if (!deps['uhuu-components']) {
        errors.push('Missing uhuu-components in dependencies');
      } else {
        info.push('✓ uhuu-components dependency found');
      }

      // Check for required scripts
      const requiredScripts = ['dev', 'build', 'uhuu'];
      for (const script of requiredScripts) {
        if (!packageJson.scripts?.[script]) {
          warnings.push(`Missing script: ${script}`);
        }
      }
    } catch (err) {
      errors.push(`Invalid package.json: ${err.message}`);
    }
  }

  // Validate app entry
  console.log('\n⚛️  Validating app entry...');
  if (appPath) {
    const appContent = readFileSync(appPath, 'utf-8');
    const sourceContent = readSourceFiles(join(templatePath, 'src'));

    if (!sourceContent.includes('uhuu-components')) {
      warnings.push('Template source should import from uhuu-components');
    }

    if (!sourceContent.includes('PageEditor') && !sourceContent.includes('Pagination')) {
      warnings.push('Template source should use EditorShell.PageEditor or Static.Pagination');
    }

    if (!appContent.includes('$uhuu.payload')) {
      warnings.push('App entry should use $uhuu.payload() for data');
    }

    info.push('✓ App entry structure looks good');
  }

  // Validate sample_data.json
  console.log('\n📊 Validating sample_data.json...');
  const sampleDataPath = join(templatePath, 'test/sample_data.json');
  if (existsSync(sampleDataPath)) {
    try {
      const sampleData = JSON.parse(readFileSync(sampleDataPath, 'utf-8'));
      if (Object.keys(sampleData).length === 0) {
        warnings.push('sample_data.json is empty - add example data');
      } else {
        info.push('✓ sample_data.json is valid JSON');
      }
    } catch (err) {
      errors.push(`Invalid sample_data.json: ${err.message}`);
    }
  }

  // Print results
  console.log('\n' + '='.repeat(60));
  console.log('📊 VALIDATION RESULTS');
  console.log('='.repeat(60));

  if (errors.length > 0) {
    console.log('\n❌ ERRORS:');
    errors.forEach(err => console.log(`  • ${err}`));
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    warnings.forEach(warn => console.log(`  • ${warn}`));
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('\n✅ All checks passed!');
  }

  console.log('\n💡 INFO:');
  console.log(`  • Total files checked: ${REQUIRED_FILES.length + RECOMMENDED_FILES.length + 1}`);
  console.log(`  • Errors: ${errors.length}`);
  console.log(`  • Warnings: ${warnings.length}`);

  console.log('\n📚 For more info, see TEMPLATE_AUTHORING.md');
  console.log('');

  // Exit with error code if there are errors
  if (errors.length > 0) {
    process.exit(1);
  }
}

// Get template path from args or use current directory
const templatePath = resolve(process.argv[2] || '.');
validateTemplate(templatePath);
