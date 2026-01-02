# HR Workflow Designer Module

A visual workflow designer built with React and React Flow, enabling HR admins to create, configure, and test internal workflows such as onboarding, leave approval, and document verification.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## 📋 Project Overview

This is a functional prototype demonstrating:
- Deep knowledge of React and React Flow
- Modular, scalable front-end architecture
- Mock API integration
- Configurable nodes with custom edit forms
- Workflow simulation and testing

**Time Investment:** Built following a structured 10-step learning approach (4-6 hours)

## 🏗️ Architecture

### Project Structure

```
hr-workflow-designer/
├── src/
│   ├── app/
│   │   └── App.tsx              # Main application container
│   ├── canvas/
│   │   └── WorkflowCanvas.tsx   # Core workflow canvas component
│   ├── services/
│   │   └── mockAPI.ts           # Mock API layer
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Key Design Decisions

#### 1. **Single-File Component Strategy**
- `WorkflowCanvas.tsx` contains all UI components for clarity and learning
- Demonstrates component composition without over-engineering
- Easy to refactor into separate files as needed

#### 2. **Type-Safe Architecture**
- Full TypeScript implementation
- Strongly typed nodes, edges, and data structures
- Type inference for better IDE support

#### 3. **State Management**
- React useState for local component state
- No external state management (Redux/Zustand) - keeping it simple
- React Flow handles internal canvas state
- Custom callbacks for state updates

#### 4. **Mock API Pattern**
- Promise-based API layer for realistic async behavior
- Simulated network delays (300-500ms)
- Easy to replace with real API calls

## ✅ Requirements Coverage

### 1. Workflow Canvas (React Flow)

#### ✅ Implemented Node Types
- **Start Node** - Green circle, workflow entry point
- **Process Node** - Blue rectangle, represents tasks/automation
- **Decision Node** - Red diamond, approval/branching logic
- **End Node** - Dark circle, workflow completion

#### ✅ Canvas Actions
- ✅ Drag nodes from sidebar onto canvas
- ✅ Connect nodes with edges
- ✅ Select node to edit in right panel
- ✅ Delete nodes (via React Flow built-in: Select + Delete key)
- ✅ Delete edges (via React Flow built-in: Select + Delete key)
- ✅ Auto-validation on simulation

### 2. Node Editing / Configuration Forms ⭐

Each node type has a comprehensive edit panel with the following fields:

#### Common Fields (All Nodes)
- **Node ID** (read-only)
- **Node Type** (read-only)
- **Label*** (required, editable)
- **Description** (textarea, optional)
- **Assignee** (text input)
- **Due Date** (date picker)
- **Priority** (dropdown: Low/Medium/High)

#### Process Node Specific
- **Automation Script** (dropdown, populated from mock API)
- Displays automation description when selected
- Integrates with mock API `getAutomations()`

**Form Features:**
- ✅ Dynamic forms based on node type
- ✅ Controlled components with real-time updates
- ✅ Type-safe state handling
- ✅ Auto-save (no save button needed)
- ✅ Clean validation state

### 3. Mock API Layer ✅

**Location:** `src/services/mockAPI.ts`

#### Available Endpoints (Simulated)

**`getAutomations(): Promise<Automation[]>`**
Returns 8 mock automation actions:
- Send Welcome Email (Onboarding)
- Create IT Ticket (IT)
- Schedule Training (Training)
- Notify Manager (Communication)
- Add to Payroll (HR)
- Provision Access (IT)
- Exit Checklist (Offboarding)
- Collect Feedback (Survey)

**`simulateWorkflow(nodes, edges): Promise<SimulationResult>`**
- Accepts workflow graph
- Returns step-by-step execution logs
- Validates workflow structure
- Simulates progressive execution with timestamps

**`getAutomationById(id): Promise<Automation | null>`**
- Fetch single automation details

### 4. Workflow Testing / Sandbox Panel ✅

**Test Workflow Button** (▶️ in toolbar)

**Validation Checks:**
- ✅ Empty workflow detection
- ✅ Isolated nodes warning
- ✅ Start node verification
- ✅ Connection validation

**Simulation Modal Features:**
- Full-screen overlay with professional modal
- Real-time log display
- Color-coded status (Running/Success/Error)
- Progressive log updates (animated)
- Timestamp tracking
- Shows automation assignments
- Validation errors prominently displayed

### 5. Architecture Quality ⭐

#### ✅ Clean Folder Structure
- Logical separation: `app/`, `canvas/`, `services/`
- Single responsibility principle
- Easy to navigate and extend

#### ✅ Reusable Custom Hooks
- `useCallback` for memoized functions
- `useEffect` for side effects (API calls)
- `useRef` for stable references
- `useState` for reactive state

#### ✅ Component Abstractions
- **Toolbar** - Action buttons (Save, Test)
- **Sidebar** - Draggable node palette
- **RightPanel** - Node configuration form
- **SimulationModal** - Test execution viewer
- **Custom Node Components** - StartNode, ProcessNode, DecisionNode, EndNode

#### ✅ Type Safety & Interfaces
```typescript
interface Automation {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface SimulationLog {
  timestamp: string;
  nodeId: string;
  nodeName: string;
  status: 'running' | 'success' | 'error';
  message: string;
}
```

#### ✅ Form Structure Extensibility
- Conditional rendering based on node type
- Easy to add new fields
- Centralized data update handler
- Scalable to new node types

## 🎯 Feature Highlights

### Implemented Features

1. **Visual Workflow Design**
   - Drag-and-drop interface
   - Custom node shapes (circle, rectangle, diamond)
   - Color-coded nodes by type
   - Connection handles for linking

2. **Node Configuration**
   - Context-sensitive edit forms
   - Auto-save functionality
   - Rich field types (text, textarea, date, dropdown)
   - Read-only metadata display

3. **Mock API Integration**
   - Asynchronous data loading
   - Loading states
   - Error handling
   - Realistic network delays

4. **Workflow Serialization**
   - Export to JSON
   - Includes metadata (timestamp, version, counts)
   - Downloadable file
   - Console logging for debugging

5. **Workflow Simulation**
   - Graph validation
   - Step-by-step execution
   - Visual feedback
   - Detailed logging

### Bonus Features Implemented

- ✅ **Export Workflow as JSON** - Download button in toolbar
- ✅ **Zoom Controls** - React Flow built-in controls
- ✅ **Mini-map** - Can be enabled via React Flow
- ✅ **Pan & Zoom** - Full canvas navigation

## 🧪 Testing the Application

### Basic Workflow Creation

1. **Drag a Start Node** from the sidebar onto the canvas
2. **Drag a Process Node** and drop it below the Start node
3. **Connect them** by dragging from the Start node's bottom handle to the Process node's top handle
4. **Click the Process node** to configure it
5. **Fill in details**: Label, Assignee, Due Date
6. **Select an Automation** from the dropdown (loads from mock API)
7. **Add more nodes** as needed (Decision, more Process, End)
8. **Click "▶️ Test Workflow"** to simulate execution
9. **Click "💾 Save Workflow"** to export as JSON

### Expected Behavior

- Nodes can be freely moved around
- Connections create directed edges
- Form updates reflect immediately on canvas
- Test shows step-by-step logs
- Save downloads a JSON file

## 🔧 Technical Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **React Flow** - Workflow canvas
- **Vite** - Build tool & dev server
- **CSS** - Styling (no framework needed for prototype)

## 📝 Assumptions & Limitations

### Assumptions
1. **No Authentication** - Open access, no login required
2. **No Backend Persistence** - All data is in-memory
3. **Mock API Only** - Simulated async behavior
4. **Single User** - No collaboration features
5. **Chrome/Modern Browsers** - Not tested on legacy browsers

### Known Limitations
1. **No Undo/Redo** - Could be added with state history
2. **No Node Templates** - Nodes created from scratch
3. **No Auto-Layout** - Manual positioning only
4. **No Version History** - Single workflow state
5. **Basic Validation** - Could be more comprehensive
6. **No Real-Time Collaboration** - Single session only

### Future Enhancements
- Import workflow from JSON file
- More sophisticated validation (cycle detection, orphan nodes)
- Conditional branching in Decision nodes
- Workflow versioning
- User roles and permissions
- Backend integration (REST API)
- Database persistence
- Real-time collaboration (WebSockets)
- Advanced automation parameters
- Workflow templates library
- Analytics and metrics
- Audit logs

## 🎓 Learning Path Followed

This project was built following a structured 10-step approach:

1. **Canvas** - Empty React Flow canvas
2. **One Node** - Render a single static node
3. **Node State** - Understand state management
4. **Drag & Drop** - Sidebar with draggable nodes
5. **Custom Nodes** - Different shapes and styles
6. **Node Selection** - Click to select and show form
7. **Forms** - Editable configuration panels
8. **Mock API** - Simulate backend integration
9. **Serialization** - Convert to JSON
10. **Simulation** - Test and validate workflows

Each step builds upon the previous, demonstrating incremental development and deep understanding of React Flow concepts.

## 🚀 Running in Production

To build for production:

```bash
npm run build
npm run preview
```

The `dist/` folder contains the production build.

## 📞 Support

For questions about architecture or implementation details, refer to the inline code comments. Each major component and function is well-documented.

## 📄 License

MIT

---

**Built with ❤️ as a technical demonstration of React Flow mastery and modern frontend architecture.**
