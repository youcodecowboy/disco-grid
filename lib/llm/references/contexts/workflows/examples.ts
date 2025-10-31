/**
 * Workflows Context - Real-World Examples
 * 
 * Examples for workflow generation with stages, dependencies, and limbo zones.
 */

export interface WorkflowExample {
  input: string;
  output: {
    stages: Array<{
      name: string;
      sequence: number;
      type: 'sequential' | 'parallel';
      description?: string;
      suggestedInputs?: string[];
      suggestedOutputs?: string[];
      dependencies?: Array<{ type: string; description: string }>;
    }>;
    limboZones?: Array<{
      betweenStages: string[];
      dependencies: Array<{ type: string; description: string }>;
    }>;
  };
  complexity: 'simple' | 'medium' | 'complex';
}

/**
 * Simple Sequential Workflow Examples
 */
export const SIMPLE_WORKFLOW_EXAMPLES: WorkflowExample[] = [
  {
    input: "Our process is cutting, then sewing, then washing, finishing, QA, and packing",
    output: {
      stages: [
        { name: "Cutting", sequence: 1, type: "sequential" },
        { name: "Sewing", sequence: 2, type: "sequential" },
        { name: "Washing", sequence: 3, type: "sequential" },
        { name: "Finishing", sequence: 4, type: "sequential" },
        { name: "QA", sequence: 5, type: "sequential" },
        { name: "Packing", sequence: 6, type: "sequential" }
      ]
    },
    complexity: 'simple'
  },
  {
    input: "We start with fabric inspection, then cut, sew, wash, finish, inspect quality, and ship",
    output: {
      stages: [
        { name: "Fabric Inspection", sequence: 1, type: "sequential" },
        { name: "Cutting", sequence: 2, type: "sequential" },
        { name: "Sewing", sequence: 3, type: "sequential" },
        { name: "Washing", sequence: 4, type: "sequential" },
        { name: "Finishing", sequence: 5, type: "sequential" },
        { name: "Quality Inspection", sequence: 6, type: "sequential" },
        { name: "Shipping", sequence: 7, type: "sequential" }
      ]
    },
    complexity: 'simple'
  }
];

/**
 * Complex Workflow with Dependencies Examples
 */
export const COMPLEX_WORKFLOW_EXAMPLES: WorkflowExample[] = [
  {
    input: "We run a denim factory. Process: inspection, cutting, sewing, washing, finishing, QA, packing. Between cutting and sewing, fabric rests 2 hours. Sewing needs manager approval to start.",
    output: {
      stages: [
        { name: "Inspection", sequence: 1, type: "sequential" },
        { name: "Cutting", sequence: 2, type: "sequential" },
        { 
          name: "Sewing", 
          sequence: 3, 
          type: "sequential",
          dependencies: [{ type: "approval", description: "Manager approval required" }]
        },
        { name: "Washing", sequence: 4, type: "sequential" },
        { name: "Finishing", sequence: 5, type: "sequential" },
        { name: "QA", sequence: 6, type: "sequential" },
        { name: "Packing", sequence: 7, type: "sequential" }
      ],
      limboZones: [
        {
          betweenStages: ["Cutting", "Sewing"],
          dependencies: [
            { type: "time_based", description: "Fabric rests 2 hours" }
          ]
        }
      ]
    },
    complexity: 'complex'
  }
];

/**
 * Parallel Workflow Examples
 */
export const PARALLEL_WORKFLOW_EXAMPLES: WorkflowExample[] = [
  {
    input: "We produce jackets with two halves. The left side and right side are cut and sewn simultaneously, then assembled together, followed by washing, finishing, and packing.",
    output: {
      stages: [
        { name: "Cut Left Half", sequence: 1, type: "parallel" },
        { name: "Cut Right Half", sequence: 1, type: "parallel" },
        { name: "Sew Left Half", sequence: 2, type: "parallel" },
        { name: "Sew Right Half", sequence: 2, type: "parallel" },
        { name: "Assembly", sequence: 3, type: "sequential" },
        { name: "Washing", sequence: 4, type: "sequential" },
        { name: "Finishing", sequence: 5, type: "sequential" },
        { name: "Packing", sequence: 6, type: "sequential" }
      ]
    },
    complexity: 'medium'
  }
];

/**
 * Get examples formatted for prompt inclusion
 */
export function getWorkflowExamples(count: number = 2, complexity?: 'simple' | 'medium' | 'complex'): string {
  let examples: WorkflowExample[] = [];
  
  if (complexity === 'simple') {
    examples = SIMPLE_WORKFLOW_EXAMPLES.slice(0, count);
  } else if (complexity === 'complex') {
    examples = COMPLEX_WORKFLOW_EXAMPLES.slice(0, count);
  } else if (complexity === 'medium') {
    examples = PARALLEL_WORKFLOW_EXAMPLES.slice(0, count);
  } else {
    // Mix of all types
    examples = [
      ...SIMPLE_WORKFLOW_EXAMPLES.slice(0, 1),
      ...PARALLEL_WORKFLOW_EXAMPLES.slice(0, 1)
    ].slice(0, count);
  }
  
  return examples.map((ex, i) => 
    `Example ${i + 1}:\nInput: "${ex.input}"\nOutput: ${JSON.stringify(ex.output)}`
  ).join('\n\n');
}

