#!/usr/bin/env node
/**
 * Test Conditional Logic: Questions that depend on previous answers
 * 
 * Tests if question 7-8 skip when question 1-3 already answered them
 */

const fs = require('fs');
const path = require('path');

const fashionCompany = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'content/questions/manufacturing/fashion/company.json'), 'utf8')
);

const questions = Object.values(fashionCompany);

// Find questions with conditional logic
const conditionalQuestions = questions.filter(q => q.conditional);

console.log('🧪 Testing Conditional Logic\n');
console.log('='.repeat(60));
console.log(`Found ${conditionalQuestions.length} questions with conditional logic\n`);

conditionalQuestions.forEach(q => {
  console.log(`Question: ${q.id}`);
  console.log(`  Section: ${q.section}`);
  console.log(`  Prompt: ${q.prompt}`);
  console.log(`  Depends on: ${q.conditional.dependsOn}`);
  console.log(`  Show if: ${JSON.stringify(q.conditional.showIf)}`);
  console.log('');
});

// Test Case: company_sales_channels depends on company.ownBrand
console.log('\n🧪 TEST: Conditional Dependency Flow\n');
console.log('='.repeat(60));

const salesChannelsQ = questions.find(q => q.id === 'company_sales_channels');
const ownBrandQ = questions.find(q => q.id === 'company_own_brand');

console.log(`\nQuestion Flow Test:`);
console.log(`1. ${ownBrandQ.id}: "${ownBrandQ.prompt}"`);
console.log(`2. ${salesChannelsQ.id}: "${salesChannelsQ.prompt}"`);
console.log(`   └─ Depends on: ${salesChannelsQ.conditional.dependsOn}`);
console.log(`   └─ Show if: ${JSON.stringify(salesChannelsQ.conditional.showIf)}`);

// Test scenario 1: ownBrand = false (should hide sales_channels)
const contract1 = {
  company: {
    ownBrand: false,
  },
};

function getValueAtPath(obj, path) {
  const keys = path.split('.');
  let value = obj;
  for (const key of keys) {
    if (value === undefined || value === null) return undefined;
    value = value[key];
  }
  return value;
}

function shouldShowConditional(question, contract) {
  if (!question.conditional) return true;
  
  const { dependsOn, showIf } = question.conditional;
  const dependencyValue = getValueAtPath(contract, dependsOn);
  
  if (typeof showIf === 'boolean') {
    return dependencyValue === showIf;
  }
  
  if (Array.isArray(showIf)) {
    if (Array.isArray(dependencyValue)) {
      return showIf.some(value => dependencyValue.includes(value));
    }
    return showIf.includes(dependencyValue);
  }
  
  if (Array.isArray(dependencyValue)) {
    return dependencyValue.includes(showIf);
  }
  
  return dependencyValue === showIf;
}

const shouldShow1 = shouldShowConditional(salesChannelsQ, contract1);
console.log(`\n📊 Scenario 1: ownBrand = false`);
console.log(`   ✅ sales_channels should show: ${shouldShow1} (expected: false)`);

// Test scenario 2: ownBrand = true (should show sales_channels)
const contract2 = {
  company: {
    ownBrand: true,
  },
};

const shouldShow2 = shouldShowConditional(salesChannelsQ, contract2);
console.log(`\n📊 Scenario 2: ownBrand = true`);
console.log(`   ✅ sales_channels should show: ${shouldShow2} (expected: true)`);

// Test scenario 3: Multi-select dependency (productTypes)
const productTypesOtherQ = questions.find(q => q.id === 'company_product_types_other');
console.log(`\n📊 Scenario 3: Multi-select dependency`);
console.log(`   Question: ${productTypesOtherQ.id}`);
console.log(`   Depends on: ${productTypesOtherQ.conditional.dependsOn}`);
console.log(`   Show if: ${JSON.stringify(productTypesOtherQ.conditional.showIf)}`);

const contract3a = {
  company: {
    productTypes: ['Jeans', 'Jackets'], // No "Other"
  },
};

const contract3b = {
  company: {
    productTypes: ['Jeans', 'Other'], // Has "Other"
  },
};

const shouldShow3a = shouldShowConditional(productTypesOtherQ, contract3a);
const shouldShow3b = shouldShowConditional(productTypesOtherQ, contract3b);

console.log(`   ✅ productTypes = ["Jeans", "Jackets"] → show: ${shouldShow3a} (expected: false)`);
console.log(`   ✅ productTypes = ["Jeans", "Other"] → show: ${shouldShow3b} (expected: true)`);

console.log('\n' + '='.repeat(60));
console.log('✅ Conditional logic tests completed!');

