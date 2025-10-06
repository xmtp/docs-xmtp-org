#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Define the directories to process
const targetDirectories = [
  'docs/pages/agents/**/*.{md,mdx}',
  'docs/pages/chat-apps/**/*.{md,mdx}', 
  'docs/pages/network/**/*.{md,mdx}',
  'docs/pages/protocol/**/*.{md,mdx}'
];

// Function to determine the correct import path based on file location
function getImportPath(filePath) {
  const relativePath = path.relative(path.dirname(filePath), 'docs/components/AutoBreadcrumb');
  // Convert to forward slashes for consistency across platforms
  return relativePath.split(path.sep).join('/');
}

// Function to add breadcrumb to a file
function addBreadcrumbToFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if breadcrumb is already present
    if (content.includes('AutoBreadcrumb')) {
      console.log(`⏭️  Skipping ${filePath} - AutoBreadcrumb already present`);
      return false;
    }
    
    // Get the correct import path
    const importPath = getImportPath(filePath);
    
    // Check if file has frontmatter
    const hasFrontmatter = content.startsWith('---');
    
    let newContent;
    
    if (hasFrontmatter) {
      // Find the end of frontmatter (must be at start of line)
      const frontmatterEnd = content.indexOf('\n---', 3);
      if (frontmatterEnd === -1) {
        console.log(`⚠️  Warning: ${filePath} has malformed frontmatter`);
        return false;
      }
      
      const frontmatter = content.substring(0, frontmatterEnd + 4); // +4 for '\n---'
      const restOfContent = content.substring(frontmatterEnd + 4);
      
      // Find the first heading (line starting with #)
      const lines = restOfContent.split('\n');
      const firstHeadingIndex = lines.findIndex(line => line.trim().startsWith('#'));
      
      if (firstHeadingIndex === -1) {
        console.log(`⚠️  Warning: ${filePath} has no heading found`);
        return false;
      }
      
      // Insert import and breadcrumb before the heading
      const beforeHeading = lines.slice(0, firstHeadingIndex);
      const headingAndAfter = lines.slice(firstHeadingIndex);
      
      // Clean up any empty lines before heading
      while (beforeHeading.length > 0 && beforeHeading[beforeHeading.length - 1].trim() === '') {
        beforeHeading.pop();
      }
      
      const breadcrumbCode = [
        '',
        `import AutoBreadcrumb from '${importPath}'`,
        '',
        '<AutoBreadcrumb />',
        ''
      ];
      
      newContent = frontmatter + '\n' + 
                   beforeHeading.join('\n') + 
                   (beforeHeading.length > 0 ? '\n' : '') +
                   breadcrumbCode.join('\n') + 
                   headingAndAfter.join('\n');
    } else {
      // No frontmatter, find first heading
      const lines = content.split('\n');
      const firstHeadingIndex = lines.findIndex(line => line.trim().startsWith('#'));
      
      if (firstHeadingIndex === -1) {
        console.log(`⚠️  Warning: ${filePath} has no heading found`);
        return false;
      }
      
      const beforeHeading = lines.slice(0, firstHeadingIndex);
      const headingAndAfter = lines.slice(firstHeadingIndex);
      
      // Handle existing imports if any
      let hasImports = false;
      let lastImportIndex = -1;
      
      beforeHeading.forEach((line, index) => {
        if (line.trim().startsWith('import ')) {
          hasImports = true;
          lastImportIndex = index;
        }
      });
      
      if (hasImports) {
        // Add after existing imports
        const beforeImports = beforeHeading.slice(0, lastImportIndex + 1);
        const afterImports = beforeHeading.slice(lastImportIndex + 1);
        
        const breadcrumbCode = [
          `import AutoBreadcrumb from '${importPath}'`,
          '',
          '<AutoBreadcrumb />',
          ''
        ];
        
        newContent = beforeImports.join('\n') + '\n' +
                     breadcrumbCode.join('\n') +
                     (afterImports.length > 0 ? afterImports.join('\n') + '\n' : '') +
                     headingAndAfter.join('\n');
      } else {
        // No existing imports, add at the beginning
        const breadcrumbCode = [
          `import AutoBreadcrumb from '${importPath}'`,
          '',
          '<AutoBreadcrumb />',
          ''
        ];
        
        newContent = breadcrumbCode.join('\n') + content;
      }
    }
    
    // Write the updated content
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ Updated ${filePath}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('🔍 Finding all documentation files...\n');
  
  let allFiles = [];
  
  // Collect all files from target directories
  for (const pattern of targetDirectories) {
    const files = await glob(pattern);
    allFiles = allFiles.concat(files);
  }
  
  // Remove duplicates and sort
  allFiles = [...new Set(allFiles)].sort();
  
  console.log(`📁 Found ${allFiles.length} files to process\n`);
  
  let processedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  // Process each file
  for (const filePath of allFiles) {
    const result = addBreadcrumbToFile(filePath);
    if (result === true) {
      processedCount++;
    } else if (result === false && fs.readFileSync(filePath, 'utf8').includes('AutoBreadcrumb')) {
      skippedCount++;
    } else {
      errorCount++;
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`✅ Successfully updated: ${processedCount} files`);
  console.log(`⏭️  Skipped (already had breadcrumbs): ${skippedCount} files`);
  console.log(`❌ Errors: ${errorCount} files`);
  console.log(`📝 Total files processed: ${allFiles.length} files`);
  
  if (processedCount > 0) {
    console.log('\n🎉 Breadcrumbs have been added to all documentation pages!');
    console.log('💡 You can now navigate to any page in /agents/, /chat-apps/, /network/, or /protocol/ to see the breadcrumbs.');
  }
}

// Run the script
main().catch(console.error);
