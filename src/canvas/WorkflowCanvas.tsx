import React, { useState, useCallback, useRef, DragEvent, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  Connection,
  Node,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  ReactFlowInstance,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { getAutomations, Automation, simulateWorkflow, SimulationLog } from '../services/mockAPI';

const StartNode = ({ data }: { data: any }) => {
  return (
    <div style={{
      padding: '10px 20px',
      borderRadius: '50%',
      background: '#2ecc71',
      color: 'white',
      border: '2px solid #27ae60',
      minWidth: '80px',
      minHeight: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold'
    }}>
      {data.label}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

const ProcessNode = ({ data }: { data: any }) => {
  return (
    <div style={{
      padding: '15px 25px',
      borderRadius: '8px',
      background: '#0073e6',
      color: 'white',
      border: '2px solid #005bb5',
      minWidth: '120px',
      fontWeight: 'bold',
      textAlign: 'center'
    }}>
      <Handle type="target" position={Position.Top} />
      {data.label}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

const DecisionNode = ({ data }: { data: any }) => {
  return (
    <div style={{
      position: 'relative',
      width: '100px',
      height: '100px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '100px',
        height: '100px',
        background: '#ff6b6b',
        border: '2px solid #ee5a52',
        transform: 'rotate(45deg)',
        position: 'absolute'
      }} />
      <div style={{
        color: 'white',
        fontWeight: 'bold',
        zIndex: 1,
        textAlign: 'center',
        fontSize: '12px'
      }}>
        {data.label}
      </div>
      <Handle type="target" position={Position.Top} style={{ top: '-5px' }} />
      <Handle type="source" position={Position.Bottom} style={{ bottom: '-5px' }} />
      <Handle type="source" position={Position.Left} style={{ left: '-5px' }} />
      <Handle type="source" position={Position.Right} style={{ right: '-5px' }} />
    </div>
  );
};

const EndNode = ({ data }: { data: any }) => {
  return (
    <div style={{
      padding: '10px 20px',
      borderRadius: '50%',
      background: '#1a192b',
      color: 'white',
      border: '2px solid #000',
      minWidth: '80px',
      minHeight: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold'
    }}>
      <Handle type="target" position={Position.Top} />
      {data.label}
    </div>
  );
};

const nodeTypes = {
  start: StartNode,
  process: ProcessNode,
  decision: DecisionNode,
  end: EndNode,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const SimulationModal = ({ 
  logs, 
  isRunning, 
  errors,
  onClose 
}: { 
  logs: SimulationLog[], 
  isRunning: boolean,
  errors: string[],
  onClose: () => void 
}) => {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div style={{
        background: 'white',
        borderRadius: '8px',
        width: '600px',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          padding: '15px 20px',
          borderBottom: '1px solid #ddd',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, fontSize: '18px' }}>
            {isRunning ? 'Workflow Simulation Running...' : 'Simulation Complete'}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0 5px'
            }}
          >
            ×
          </button>
        </div>
        
        <div style={{
          padding: '20px',
          overflowY: 'auto',
          flexGrow: 1
        }}>
          {errors.length > 0 && (
            <div style={{
              marginBottom: '15px',
              padding: '10px',
              background: '#fee',
              border: '1px solid #fcc',
              borderRadius: '4px',
              color: '#c00'
            }}>
              <strong>Validation Errors:</strong>
              {errors.map((err, i) => (
                <div key={i} style={{ marginTop: '5px' }}>• {err}</div>
              ))}
            </div>
          )}
          
          <div style={{ fontSize: '14px' }}>
            {logs.length === 0 ? (
              <div style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                {isRunning ? 'Initializing...' : 'No logs available'}
              </div>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  style={{
                    padding: '10px',
                    marginBottom: '8px',
                    background: log.status === 'success' ? '#e8f5e9' : 
                               log.status === 'error' ? '#ffebee' : '#fff3e0',
                    border: `1px solid ${
                      log.status === 'success' ? '#c8e6c9' : 
                      log.status === 'error' ? '#ffcdd2' : '#ffe0b2'
                    }`,
                    borderRadius: '4px',
                    fontSize: '13px'
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '3px', color: '#333' }}>
                    {log.nodeName}
                  </div>
                  <div style={{ color: '#666' }}>{log.message}</div>
                  <div style={{ fontSize: '11px', color: '#999', marginTop: '3px' }}>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div style={{
          padding: '15px 20px',
          borderTop: '1px solid #ddd',
          background: '#f9f9f9',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            disabled={isRunning}
            style={{
              padding: '8px 20px',
              background: isRunning ? '#ccc' : '#0073e6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Toolbar = ({ onSave, onTest }: { onSave: () => void, onTest: () => void }) => {
  return (
    <div style={{
      padding: '10px 15px',
      borderBottom: '1px solid #ddd',
      background: '#fff',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h2 style={{ margin: 0, fontSize: '18px', color: '#333' }}>
        HR Workflow Designer
      </h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={onTest}
          style={{
            padding: '8px 16px',
            background: '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px'
          }}
        >
          Test Workflow
        </button>
        <button
          onClick={onSave}
          style={{
            padding: '8px 16px',
            background: '#0073e6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px'
          }}
        >
          Save Workflow
        </button>
      </div>
    </div>
  );
};

const RightPanel = ({ 
  selectedNode, 
  onClose, 
  onUpdateNode 
}: { 
  selectedNode: Node | null, 
  onClose: () => void,
  onUpdateNode: (nodeId: string, data: any) => void
}) => {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loadingAutomations, setLoadingAutomations] = useState(false);

  useEffect(() => {
    if (selectedNode && selectedNode.type === 'process') {
      setLoadingAutomations(true);
      getAutomations()
        .then(data => {
          setAutomations(data);
          setLoadingAutomations(false);
        })
        .catch(() => {
          setLoadingAutomations(false);
        });
    }
  }, [selectedNode?.id, selectedNode?.type]);

  if (!selectedNode) {
    return (
      <aside style={{
        width: '300px',
        padding: '15px',
        borderLeft: '1px solid #ddd',
        background: '#f9f9f9',
        fontSize: '14px'
      }}>
        <div style={{ color: '#999', textAlign: 'center', marginTop: '50px' }}>
          Select a node to edit details
        </div>
      </aside>
    );
  }

  const handleFieldChange = (field: string, value: string) => {
    const updatedData = { ...selectedNode.data, [field]: value };
    onUpdateNode(selectedNode.id, updatedData);
  };

  return (
    <aside style={{
      width: '300px',
      padding: '15px',
      borderLeft: '1px solid #ddd',
      background: '#f9f9f9',
      fontSize: '14px',
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, fontSize: '16px' }}>Configure Node</h3>
        <button 
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '0 5px'
          }}
        >
          ×
        </button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '12px', color: '#666' }}>
          Node ID (read-only)
        </label>
        <div style={{ 
          padding: '8px', 
          background: '#e8e8e8', 
          borderRadius: '4px',
          border: '1px solid #ccc',
          fontSize: '12px',
          color: '#666'
        }}>
          {selectedNode.id}
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '12px', color: '#666' }}>
          Node Type (read-only)
        </label>
        <div style={{ 
          padding: '8px', 
          background: '#e8e8e8', 
          borderRadius: '4px',
          border: '1px solid #ccc',
          textTransform: 'capitalize',
          fontSize: '12px',
          color: '#666'
        }}>
          {selectedNode.type || 'default'}
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
          Label *
        </label>
        <input
          type="text"
          value={selectedNode.data.label || ''}
          onChange={(e) => handleFieldChange('label', e.target.value)}
          placeholder="Enter node label"
          style={{ 
            width: '100%',
            padding: '8px', 
            borderRadius: '4px',
            border: '1px solid #ddd',
            boxSizing: 'border-box',
            fontSize: '14px'
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
          Description
        </label>
        <textarea
          value={selectedNode.data.description || ''}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          placeholder="Add description"
          rows={3}
          style={{ 
            width: '100%',
            padding: '8px', 
            borderRadius: '4px',
            border: '1px solid #ddd',
            boxSizing: 'border-box',
            fontSize: '14px',
            fontFamily: 'inherit',
            resize: 'vertical'
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
          Assignee
        </label>
        <input
          type="text"
          value={selectedNode.data.assignee || ''}
          onChange={(e) => handleFieldChange('assignee', e.target.value)}
          placeholder="Enter assignee name"
          style={{ 
            width: '100%',
            padding: '8px', 
            borderRadius: '4px',
            border: '1px solid #ddd',
            boxSizing: 'border-box',
            fontSize: '14px'
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
          Due Date
        </label>
        <input
          type="date"
          value={selectedNode.data.dueDate || ''}
          onChange={(e) => handleFieldChange('dueDate', e.target.value)}
          style={{ 
            width: '100%',
            padding: '8px', 
            borderRadius: '4px',
            border: '1px solid #ddd',
            boxSizing: 'border-box',
            fontSize: '14px'
          }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
          Priority
        </label>
        <select
          value={selectedNode.data.priority || 'medium'}
          onChange={(e) => handleFieldChange('priority', e.target.value)}
          style={{ 
            width: '100%',
            padding: '8px', 
            borderRadius: '4px',
            border: '1px solid #ddd',
            boxSizing: 'border-box',
            fontSize: '14px'
          }}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {selectedNode.type === 'process' && (
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
            Automation Script
          </label>
          {loadingAutomations ? (
            <div style={{ 
              padding: '8px',
              textAlign: 'center',
              color: '#666',
              fontSize: '12px'
            }}>
              Loading automations...
            </div>
          ) : (
            <select
              value={selectedNode.data.automationId || ''}
              onChange={(e) => {
                handleFieldChange('automationId', e.target.value);
                const selected = automations.find(a => a.id === e.target.value);
                if (selected) {
                  handleFieldChange('automationName', selected.name);
                }
              }}
              style={{ 
                width: '100%',
                padding: '8px', 
                borderRadius: '4px',
                border: '1px solid #ddd',
                boxSizing: 'border-box',
                fontSize: '14px'
              }}
            >
              <option value="">-- Select Automation --</option>
              {automations.map(auto => (
                <option key={auto.id} value={auto.id}>
                  {auto.name} ({auto.category})
                </option>
              ))}
            </select>
          )}
          {selectedNode.data.automationId && (
            <div style={{
              marginTop: '5px',
              padding: '8px',
              background: '#f0f8ff',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#333'
            }}>
              {automations.find(a => a.id === selectedNode.data.automationId)?.description}
            </div>
          )}
        </div>
      )}

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '12px', color: '#666' }}>
          Position
        </label>
        <div style={{ 
          padding: '8px', 
          background: '#e8e8e8', 
          borderRadius: '4px',
          border: '1px solid #ccc',
          fontSize: '12px',
          color: '#666'
        }}>
          X: {Math.round(selectedNode.position.x)}, Y: {Math.round(selectedNode.position.y)}
        </div>
      </div>

      <div style={{
        padding: '10px',
        background: '#e3f2fd',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#1976d2'
      }}>
        All changes are saved automatically!
      </div>
    </aside>
  );
};

const Sidebar = () => {
  const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside style={{
      width: '200px',
      padding: '15px',
      borderRight: '1px solid #ddd',
      background: '#f9f9f9',
      fontSize: '14px'
    }}>
      <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>Drag Nodes</div>
      
      <div
        onDragStart={(event) => onDragStart(event, 'Start')}
        draggable
        style={{
          padding: '10px',
          marginBottom: '10px',
          background: '#1a192b',
          color: 'white',
          borderRadius: '5px',
          cursor: 'grab',
          textAlign: 'center'
        }}
      >
        Start Node
      </div>
      
      <div
        onDragStart={(event) => onDragStart(event, 'Process')}
        draggable
        style={{
          padding: '10px',
          marginBottom: '10px',
          background: '#0073e6',
          color: 'white',
          borderRadius: '5px',
          cursor: 'grab',
          textAlign: 'center'
        }}
      >
        Process Node
      </div>
      
      <div
        onDragStart={(event) => onDragStart(event, 'Decision')}
        draggable
        style={{
          padding: '10px',
          marginBottom: '10px',
          background: '#ff6b6b',
          color: 'white',
          borderRadius: '5px',
          cursor: 'grab',
          textAlign: 'center'
        }}
      >
        Decision Node
      </div>
      
      <div
        onDragStart={(event) => onDragStart(event, 'End')}
        draggable
        style={{
          padding: '10px',
          background: '#2ecc71',
          color: 'white',
          borderRadius: '5px',
          cursor: 'grab',
          textAlign: 'center'
        }}
      >
        End Node
      </div>
    </aside>
  );
};

export default function WorkflowCanvas() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  
  const [showSimulation, setShowSimulation] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<SimulationLog[]>([]);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationErrors, setSimulationErrors] = useState<string[]>([]);
  
  const nodeIdRef = useRef(1);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => {
        const updatedNodes = applyNodeChanges(changes, nds);
        if (selectedNode) {
          const updatedSelectedNode = updatedNodes.find(n => n.id === selectedNode.id);
          if (updatedSelectedNode) {
            setSelectedNode(updatedSelectedNode);
          }
        }
        return updatedNodes;
      });
    },
    [selectedNode]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: newData }
          : node
      )
    );
    setSelectedNode((prev) =>
      prev && prev.id === nodeId
        ? { ...prev, data: newData }
        : prev
    );
  }, []);

  const validateAndTestWorkflow = useCallback(() => {
    setSimulationLogs([]);
    setSimulationErrors([]);
    setShowSimulation(true);
    setSimulationRunning(true);

    const errors: string[] = [];
    
    if (nodes.length === 0) {
      errors.push('Workflow is empty. Add some nodes first.');
    }
    
    if (edges.length === 0 && nodes.length > 1) {
      errors.push('Nodes are not connected. Connect them with edges.');
    }

    const targetIds = new Set(edges.map(e => e.target));
    const startNodes = nodes.filter(n => !targetIds.has(n.id));
    if (startNodes.length === 0 && nodes.length > 0) {
      errors.push('No start node found. Ensure at least one node has no incoming connections.');
    }

    setSimulationErrors(errors);

    if (errors.length > 0) {
      setSimulationRunning(false);
      return;
    }

    simulateWorkflow(nodes, edges)
      .then(result => {
        let logIndex = 0;
        const interval = setInterval(() => {
          if (logIndex < result.logs.length) {
            setSimulationLogs(prev => [...prev, result.logs[logIndex]]);
            logIndex++;
          } else {
            clearInterval(interval);
            setSimulationRunning(false);
          }
        }, 600);
      })
      .catch(() => {
        setSimulationErrors(['Simulation failed. Please try again.']);
        setSimulationRunning(false);
      });
  }, [nodes, edges]);

  const saveWorkflow = useCallback(() => {
    const workflow = {
      nodes,
      edges,
      metadata: {
        createdAt: new Date().toISOString(),
        version: '1.0',
        nodeCount: nodes.length,
        edgeCount: edges.length
      }
    };

    const jsonString = JSON.stringify(workflow, null, 2);

    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workflow-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    alert(`Workflow saved! \n\nNodes: ${nodes.length}\nEdges: ${edges.length}`);
  }, [nodes, edges]);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type || !reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `node_${nodeIdRef.current++}`,
        type: type.toLowerCase(),
        position,
        data: { label: `${type}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh' }}>
      <Toolbar onSave={saveWorkflow} onTest={validateAndTestWorkflow} />
      
      {showSimulation && (
        <SimulationModal
          logs={simulationLogs}
          isRunning={simulationRunning}
          errors={simulationErrors}
          onClose={() => setShowSimulation(false)}
        />
      )}
      
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar />
        
        <div style={{ flexGrow: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background/>
          
          <Controls />
        </ReactFlow>
      </div>

        <RightPanel 
          selectedNode={selectedNode} 
          onClose={() => setSelectedNode(null)}
          onUpdateNode={updateNodeData}
        />
      </div>
    </div>
  );
}
