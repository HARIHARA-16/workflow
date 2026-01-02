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

 enabled via React Flow
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
