/**
 * Demo Mode Data Generator
 * 
 * Generates pre-populated data for fashion manufacturing company demo
 * "Denim Collective" - Istanbul-based denim garment manufacturer
 */

import type { GenerationContractV1 } from '../types.contract';
import { getContractForIndustry } from './contract-factory';

/**
 * Generate complete demo contract for Fashion Manufacturing
 */
export function generateDemoContract(): GenerationContractV1 {
  const contract = getContractForIndustry('manufacturing', 'fashion');
  
  return {
    ...contract,
    company: {
      name: "Denim Collective",
      logoUrl: undefined, // Could add a demo logo URL
      industry: "manufacturing",
      subIndustry: "fashion",
      locations: [
        {
          city: "Istanbul",
          country: "Turkey",
          timezone: "Europe/Istanbul",
          prov: "manual",
          conf: 3,
        },
      ],
      size: "10-50",
      facilities: "single",
    },
    operations: {
      model: "MTO",
      monthlyCapacity: 10000,
      shiftsPerDay: 2,
      seasonality: {
        months: [2, 3, 4, 8, 9], // March, April, May, Sept, Oct (Spring/Fall seasons)
      },
      leadTimes: {
        avgDays: 21,
        prov: "manual",
        conf: 3,
      },
    },
    items: {
      categories: ["Jeans", "Jackets", "Shirts", "Shorts"],
      trackingLevel: "batch",
      attributes: [
        { key: "name", type: "text", required: true },
        { key: "sku", type: "text", required: true },
        { key: "style", type: "text", required: true },
        { key: "size", type: "dropdown", required: true, values: ["XS", "S", "M", "L", "XL", "XXL"] },
        { key: "color", type: "dropdown", required: true, values: ["Indigo", "Black", "Light Blue", "Raw Denim"] },
        { key: "quantity", type: "number", required: true },
        { key: "fabric_weight", type: "text", required: false },
        { key: "wash_type", type: "dropdown", required: false, values: ["Stone Wash", "Enzyme Wash", "Raw", "Acid Wash"] },
      ],
      components: [
        {
          name: "Denim Fabric",
          attributes: [
            { key: "name", type: "text", required: true },
            { key: "weight", type: "number", required: true },
            { key: "color", type: "text", required: true },
            { key: "supplier", type: "text", required: false },
          ],
        },
        {
          name: "Hardware",
          attributes: [
            { key: "name", type: "text", required: true },
            { key: "type", type: "dropdown", required: true, values: ["Button", "Rivet", "Zipper"] },
            { key: "quantity", type: "number", required: true },
          ],
        },
      ],
    },
    workflows: {
      stages: [
        { name: "Receive Fabric", durationHours: 2, ownerDept: "Warehouse" },
        { name: "Cut", durationHours: 4, ownerDept: "Production", quality: { checkpoint: true, criteria: ["Pattern accuracy", "Fabric defects"] } },
        { name: "Sew", durationHours: 8, ownerDept: "Production" },
        { name: "Wash", durationHours: 6, ownerDept: "Production" },
        { name: "QA Inspection", durationHours: 2, ownerDept: "Quality", quality: { checkpoint: true, criteria: ["Stitching quality", "Wash consistency", "Size accuracy"] } },
        { name: "Package", durationHours: 2, ownerDept: "Warehouse" },
        { name: "Ship", durationHours: 1, ownerDept: "Warehouse" },
      ],
    },
    sites: {
      floors: [
        {
          name: "Main Floor",
          zones: [
            { type: "production", name: "Cutting Station", sqft: 1500, supervisor: "Mehmet Yilmaz" },
            { type: "production", name: "Sewing Lines", sqft: 3500, supervisor: "Ayse Demir" },
            { type: "production", name: "Wash House", sqft: 2000, supervisor: "Can Ozturk" },
            { type: "qa", name: "QA Station", sqft: 800, supervisor: "Elif Kaya" },
            { type: "storage", name: "Raw Materials", sqft: 1200 },
            { type: "storage", name: "Finished Goods", sqft: 1000 },
            { type: "shipping", name: "Shipping Dock", sqft: 600 },
            { type: "office", name: "Admin Offices", sqft: 400 },
          ],
        },
      ],
    },
    teams: {
      departments: [
        { name: "Production", roles: ["Line Supervisor", "Sewing Operator", "Cutting Operator", "Wash Technician"], access: "edit" },
        { name: "Quality", roles: ["QA Inspector", "QA Manager"], access: "edit" },
        { name: "Warehouse", roles: ["Warehouse Supervisor", "Material Handler", "Shipping Clerk"], access: "edit" },
        { name: "Admin", roles: ["Production Manager", "Operations Director"], access: "full" },
      ],
      floorAppEnabled: true,
    },
    integrations: null,
    analytics: {
      audience: ["exec", "ops", "floor"],
      keyMetrics: [
        "On-Time Delivery",
        "First-Pass Yield",
        "WIP Age",
        "Capacity Utilization",
        "Defect Rate",
        "Lead Time",
        "Order Backlog",
      ],
      chartPreference: "metrics",
      reportFrequency: "realtime",
    },
    playbooks: null,
    metadata: {
      ...contract.metadata,
      committedFields: [
        "company.name",
        "company.industry",
        "company.subIndustry",
        "company.locations",
        "company.size",
        "company.facilities",
        "operations.model",
        "operations.monthlyCapacity",
        "operations.shiftsPerDay",
        "operations.seasonality",
        "items.categories",
        "items.trackingLevel",
        "items.attributes",
        "teams.departments",
        "teams.floorAppEnabled",
        "analytics.keyMetrics",
      ],
    },
    manufacturingExt: {
      subIndustry: "fashion",
      production: {
        lineCount: 2,
        stationsPerLine: 12,
        averageSetupTime: 30,
        averageCycleTime: 45,
        dailyTargetUnits: 500,
      },
      quality: {
        defectTracking: true,
        firstPassYield: 92,
        qualityStages: ["Pre-Cut", "Post-Sew", "Post-Wash", "Final"],
        rejectionProcess: "rework",
      },
      fashion: {
        garmentTypes: ["Jeans", "Jackets", "Shirts", "Shorts"],
        fabricTypes: ["12oz Denim", "14oz Denim", "Stretch Denim", "Raw Denim"],
        washProcesses: ["Stone Wash", "Enzyme Wash", "Acid Wash", "Raw (No Wash)"],
        sizeRanges: {
          system: "US",
          ranges: ["28-42 (Waist)", "XS-XXL (Tops)"],
        },
        colorVariants: ["Indigo", "Black", "Light Blue", "Raw Denim", "Gray"],
        seasonalCollections: {
          enabled: true,
          seasons: ["Spring", "Summer", "Fall", "Winter"],
        },
        qualityCheckpoints: {
          preCut: true,
          preSew: false,
          postSew: true,
          preWash: false,
          postWash: true,
          finalInspection: true,
        },
      },
      materials: {
        rawMaterials: ["Denim Fabric", "Thread", "Zippers", "Buttons", "Rivets", "Labels"],
        suppliers: ["Istanbul Textile Co.", "Aegean Fabrics", "Hardware Supply Ltd."],
        leadTimesDays: {
          "Denim Fabric": 14,
          "Hardware": 7,
          "Thread": 3,
        },
      },
    },
  };
}

/**
 * Get demo data for a specific question by ID
 * Returns the appropriate value from the demo contract
 */
export function getDemoValueForQuestion(questionId: string): any {
  const demoContract = generateDemoContract();
  
  // Map question IDs to demo values
  const demoMap: Record<string, any> = {
    // Industry selection
    industry_select: "manufacturing",
    
    // Company info
    company_name: "Denim Collective",
    manufacturing_subindustry: "fashion",
    manufacturing_intro_nlp: "We manufacture denim jeans in Istanbul, producing 10,000 units per month with 45 employees",
    company_logo: undefined,
    company_size: "10-50",
    company_facilities: "single",
    
    // Manufacturing specific
    manufacturing_products: ["Jeans", "Jackets", "Shirts", "Shorts"],
    manufacturing_production_model: "MTO",
    manufacturing_capacity: "10000",
    manufacturing_shifts: 2,
    manufacturing_seasonality: true,
    
    // Fashion specific
    fashion_garment_types: ["Jeans", "Jackets", "Denim Shirts"],
    fashion_variants: true,
    fashion_seasonal: true,
    
    // Items
    manufacturing_items_complexity: true,
    manufacturing_tracking_level: "batch",
    
    // Teams
    manufacturing_teams_nlp: "We have a production team, quality team, warehouse team, and admin team. Production has 30 people, quality has 5, warehouse has 8, and admin has 2.",
    manufacturing_floor_app: true,
    
    // Sites
    manufacturing_sites_mapping: true,
    
    // Analytics
    manufacturing_analytics_audience: ["exec", "ops", "floor"],
    manufacturing_metrics: ["On-Time Delivery", "First-Pass Yield", "WIP Age", "Capacity Utilization", "Defect Rate"],
    manufacturing_chart_preference: "metrics",
    
    // Review
    review: undefined,
    review_confirm: undefined,
  };
  
  return demoMap[questionId];
}

/**
 * Check if demo mode should auto-fill a question
 */
export function shouldAutoFillQuestion(questionId: string): boolean {
  const demoValue = getDemoValueForQuestion(questionId);
  return demoValue !== undefined;
}

