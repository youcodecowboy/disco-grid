/**
 * Application Generation Logic
 * 
 * Creates mock data structures (items, workflows, dashboards) based on the
 * completed onboarding contract.
 */

import type { GenerationContractV1 } from '../types.contract';

export interface GenerationResult {
  success: boolean;
  data?: {
    items: any[];
    workflows: any[];
    dashboards: any[];
    teams: any[];
    reports: any[];
  };
  error?: string;
}

/**
 * Simulate the application generation process
 */
export async function generateApplication(
  contract: GenerationContractV1,
  onProgress?: (progress: number, status: string) => void
): Promise<GenerationResult> {
  try {
    // Stage 1: Validate contract (0-10%)
    onProgress?.(5, 'Validating configuration...');
    await sleep(800);
    
    if (!contract.company?.name) {
      throw new Error('Company name is required');
    }
    
    onProgress?.(10, 'Configuration validated');
    await sleep(400);

    // Stage 2: Generate items (10-30%)
    onProgress?.(15, 'Creating item templates...');
    const items = await generateItems(contract);
    onProgress?.(30, `Generated ${items.length} item templates`);
    await sleep(600);

    // Stage 3: Generate workflows (30-50%)
    onProgress?.(35, 'Building workflow stages...');
    const workflows = await generateWorkflows(contract);
    onProgress?.(50, `Created ${workflows.length} workflows`);
    await sleep(600);

    // Stage 4: Generate dashboards (50-70%)
    onProgress?.(55, 'Configuring dashboards...');
    const dashboards = await generateDashboards(contract);
    onProgress?.(70, `Configured ${dashboards.length} dashboards`);
    await sleep(600);

    // Stage 5: Generate teams (70-85%)
    onProgress?.(75, 'Setting up teams and roles...');
    const teams = await generateTeams(contract);
    onProgress?.(85, `Created ${teams.length} teams`);
    await sleep(500);

    // Stage 6: Generate reports (85-95%)
    onProgress?.(88, 'Generating reports...');
    const reports = await generateReports(contract);
    onProgress?.(95, `Generated ${reports.length} report templates`);
    await sleep(500);

    // Stage 7: Finalize (95-100%)
    onProgress?.(98, 'Finalizing workspace...');
    await sleep(400);
    
    onProgress?.(100, 'Complete!');
    await sleep(200);

    return {
      success: true,
      data: {
        items,
        workflows,
        dashboards,
        teams,
        reports,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Generate item templates based on contract
 */
async function generateItems(contract: GenerationContractV1): Promise<any[]> {
  const items: any[] = [];

  contract.items.categories.forEach((category) => {
    items.push({
      id: `item-${category.toLowerCase().replace(/\s+/g, '-')}`,
      name: category,
      category,
      attributes: contract.items.attributes || [],
      trackingLevel: contract.items.trackingLevel,
      createdFrom: 'onboarding',
    });
  });

  // Add component templates if defined
  if (contract.items.components) {
    contract.items.components.forEach((component) => {
      items.push({
        id: `component-${component.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: component.name,
        category: 'Component',
        attributes: component.attributes,
        isComponent: true,
        createdFrom: 'onboarding',
      });
    });
  }

  return items;
}

/**
 * Generate workflow templates based on contract
 */
async function generateWorkflows(contract: GenerationContractV1): Promise<any[]> {
  const workflows: any[] = [];

  // Create main workflow
  workflows.push({
    id: 'main-workflow',
    name: `${contract.company.name} Production Workflow`,
    stages: contract.workflows.stages.map((stage, index) => ({
      id: `stage-${index}`,
      name: stage.name,
      order: index,
      durationHours: stage.durationHours || 8,
      ownerDept: stage.ownerDept || 'Operations',
      quality: stage.quality,
    })),
    industry: contract.company.industry,
    createdFrom: 'onboarding',
  });

  return workflows;
}

/**
 * Generate dashboard configurations based on contract
 */
async function generateDashboards(contract: GenerationContractV1): Promise<any[]> {
  const dashboards: any[] = [];
  const viz = contract.dataVisualization;

  if (!viz) {
    return dashboards;
  }

  // Create dashboards for each audience
  viz.primaryAudience.forEach((audience) => {
    dashboards.push({
      id: `dashboard-${audience.toLowerCase()}`,
      name: `${audience} Dashboard`,
      audience,
      layout: viz.layoutPreference,
      colorScheme: viz.colorScheme,
      styleMood: viz.styleMood,
      motionPreference: viz.motionPreference,
      widgets: generateDashboardWidgets(audience, viz.chartPreference, contract),
      createdFrom: 'onboarding',
    });
  });

  return dashboards;
}

/**
 * Generate widget configurations for a dashboard
 */
function generateDashboardWidgets(audience: string, chartPref: string, contract: GenerationContractV1): any[] {
  const widgets: any[] = [];

  // Common widgets based on audience
  if (audience === 'Operations') {
    widgets.push(
      { type: 'metric', title: 'Active Orders', key: 'active_orders' },
      { type: 'metric', title: 'WIP Items', key: 'wip_items' },
      { type: chartPref === 'trends' ? 'line_chart' : 'bar_chart', title: 'Daily Output', key: 'daily_output' },
      { type: 'metric', title: 'On-Time Delivery', key: 'otd_rate' }
    );
  } else if (audience === 'Executives') {
    widgets.push(
      { type: 'metric', title: 'Monthly Revenue', key: 'monthly_revenue' },
      { type: 'metric', title: 'Order Backlog', key: 'order_backlog' },
      { type: 'line_chart', title: 'Revenue Trend', key: 'revenue_trend' },
      { type: 'metric', title: 'Capacity Utilization', key: 'capacity_utilization' }
    );
  } else if (audience === 'Quality') {
    widgets.push(
      { type: 'metric', title: 'First-Pass Yield', key: 'fpy' },
      { type: 'metric', title: 'Defect Rate', key: 'defect_rate' },
      { type: 'line_chart', title: 'Quality Trend', key: 'quality_trend' },
      { type: 'table', title: 'Recent Issues', key: 'recent_issues' }
    );
  }

  return widgets;
}

/**
 * Generate team structures based on contract
 */
async function generateTeams(contract: GenerationContractV1): Promise<any[]> {
  const teams: any[] = [];

  // Extract departments from workflows
  const departments = new Set<string>();
  contract.workflows.stages.forEach((stage) => {
    if (stage.ownerDept) {
      departments.add(stage.ownerDept);
    }
  });

  // Create teams for each department
  departments.forEach((dept) => {
    teams.push({
      id: `team-${dept.toLowerCase().replace(/\s+/g, '-')}`,
      name: dept,
      department: dept,
      members: [],
      createdFrom: 'onboarding',
    });
  });

  return teams;
}

/**
 * Generate report templates based on contract
 */
async function generateReports(contract: GenerationContractV1): Promise<any[]> {
  const reports: any[] = [];

  // Standard reports based on industry
  reports.push(
    {
      id: 'report-production',
      name: 'Production Summary',
      type: 'production',
      frequency: 'daily',
      createdFrom: 'onboarding',
    },
    {
      id: 'report-quality',
      name: 'Quality Metrics',
      type: 'quality',
      frequency: 'weekly',
      createdFrom: 'onboarding',
    },
    {
      id: 'report-efficiency',
      name: 'Efficiency Report',
      type: 'efficiency',
      frequency: 'weekly',
      createdFrom: 'onboarding',
    }
  );

  return reports;
}

/**
 * Helper to simulate async operations
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

