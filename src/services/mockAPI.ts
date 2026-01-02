export interface Automation {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const getAutomations = (): Promise<Automation[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'auto_1',
          name: 'Send Welcome Email',
          description: 'Automatically send welcome email to new hires',
          category: 'Onboarding'
        },
        {
          id: 'auto_2',
          name: 'Create IT Ticket',
          description: 'Create IT ticket for equipment setup',
          category: 'IT'
        },
        {
          id: 'auto_3',
          name: 'Schedule Training',
          description: 'Schedule onboarding training sessions',
          category: 'Training'
        },
        {
          id: 'auto_4',
          name: 'Notify Manager',
          description: 'Send notification to manager about new hire',
          category: 'Communication'
        },
        {
          id: 'auto_5',
          name: 'Add to Payroll',
          description: 'Automatically add employee to payroll system',
          category: 'HR'
        },
        {
          id: 'auto_6',
          name: 'Provision Access',
          description: 'Grant access to company systems and tools',
          category: 'IT'
        },
        {
          id: 'auto_7',
          name: 'Exit Checklist',
          description: 'Create exit checklist for offboarding',
          category: 'Offboarding'
        },
        {
          id: 'auto_8',
          name: 'Collect Feedback',
          description: 'Send survey to collect employee feedback',
          category: 'Survey'
        }
      ]);
    }, 500);
  });
};

export const getAutomationById = (id: string): Promise<Automation | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      getAutomations().then(automations => {
        const automation = automations.find(a => a.id === id);
        resolve(automation || null);
      });
    }, 300);
  });
};

export interface SimulationLog {
  timestamp: string;
  nodeId: string;
  nodeName: string;
  status: 'running' | 'success' | 'error';
  message: string;
}

export interface SimulationResult {
  success: boolean;
  logs: SimulationLog[];
  duration: number;
  errors: string[];
}

export const simulateWorkflow = (nodes: any[], edges: any[]): Promise<SimulationResult> => {
  return new Promise((resolve) => {
    const logs: SimulationLog[] = [];
    const errors: string[] = [];
    const startTime = Date.now();

    const targetIds = new Set(edges.map(e => e.target));
    const startNodes = nodes.filter(n => !targetIds.has(n.id));

    if (startNodes.length === 0 && nodes.length > 0) {
      errors.push('No start node found. Add a Start node with no incoming connections.');
    }

    nodes.forEach((node) => {
      logs.push({
        timestamp: new Date().toISOString(),
        nodeId: node.id,
        nodeName: node.data.label || 'Unnamed',
        status: 'running',
        message: `Executing ${node.type} node: ${node.data.label}`
      });
      
      logs.push({
        timestamp: new Date().toISOString(),
        nodeId: node.id,
        nodeName: node.data.label || 'Unnamed',
        status: 'success',
        message: `✓ Completed ${node.data.label}${node.data.automationName ? ` (${node.data.automationName})` : ''}`
      });
    });

    setTimeout(() => {
      const duration = Date.now() - startTime;
      
      resolve({
        success: errors.length === 0,
        logs,
        duration,
        errors
      });
    }, 800);
  });
};
