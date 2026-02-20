#!/usr/bin/env node

/**
 * Template Validation Script
 *
 * Validates that a Uhuu template meets minimum requirements
 * Usage: node scripts/validate-template.js [template-path]
 */

import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

const REQUIRED_FILES = [
  'package.json',
  'vite.config.mjs',
  'src/App.tsx',
  'test/sample_data.json'
];

const RECOMMENDED_FILES = [
  'styles/print.css',
  'README.md'
];

const PRINT_CSS_REQUIREMENTS = [
  '@page',
  'margin',
  'page-break'
];

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

  // Validate print.css
  console.log('\n🎨 Validating print.css...');
  const printCssPath = join(templatePath, 'styles/print.css');
  if (existsSync(printCssPath)) {
    const printCss = readFileSync(printCssPath, 'utf-8');

    for (const requirement of PRINT_CSS_REQUIREMENTS) {
      if (!printCss.includes(requirement)) {
        warnings.push(`print.css missing recommended: ${requirement}`);
      }
    }

    if (!printCss.includes('margin:') && !printCss.includes('margin ')) {
      warnings.push('print.css should include page margins (margin: 12mm)');
    }

    info.push('✓ print.css exists and has basic requirements');
  } else {
    warnings.push('Consider adding styles/print.css for better print control');
  }

  // Validate App.tsx
  console.log('\n⚛️  Validating App.tsx...');
  const appPath = join(templatePath, 'src/App.tsx');
  if (existsSync(appPath)) {
    const appContent = readFileSync(appPath, 'utf-8');

    if (!appContent.includes('uhuu-components')) {
      warnings.push('App.tsx should import from uhuu-components');
    }

    if (!appContent.includes('Pagination')) {
      warnings.push('App.tsx should use Pagination component');
    }

    if (!appContent.includes('$uhuu.payload')) {
      warnings.push('App.tsx should use $uhuu.payload() for data');
    }

    if (!appContent.includes('printCssRaw') && !existsSync(printCssPath)) {
      warnings.push('App.tsx should provide printCssRaw or create print.css');
    }

    info.push('✓ App.tsx structure looks good');
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
  console.log(`  • Total files checked: ${REQUIRED_FILES.length + RECOMMENDED_FILES.length}`);
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
