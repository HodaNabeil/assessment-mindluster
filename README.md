# Mindluster Kanban 🚀

Mindluster is a high-performance, aesthetically pleasing Kanban board built with the latest industry-standard technologies. It features smooth drag-and-drop interactions, real-time-like updates, and a responsive design tailored for productivity.

## ✨ Features

- **Intuitive Kanban Board**: Drag and drop tasks seamlessly across multiple stages (Backlog, Todo, In Progress, Review, Done).
- **Task Management**: Easily create, edit, and delete tasks through a refined modal interface.
- **Robust Searching**: Find your tasks instantly with the integrated search functionality.
- **Infinite Scrolling**: Handles large task lists with ease using TanStack Query.
- **Responsive Layout**: Designed to look stunning on desktops and function perfectly on mobile devices.
- **Theming & Accessibility**: Built with Material UI 6 for a consistent, themeable, and accessible experience.

## 🛠 Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Styling**: Material UI 6 + Emotion
- **State Management**: Zustand (UI State), TanStack Query v5 (Server State)
- **Data Persistence**: Axios + json-server (Mock Backend)
- **Drag & Drop**: @hello-pangea/dnd
- **Toast Notifications**: Sonner

## 🚀 Getting Started

### 1. Prerequisites

Ensure you have **Node.js (v20+)** and **pnpm** installed.

### 2. Installation

```bash
pnpm install
```

### 3. Run the Project

The project requires both the Next.js server and the mock API to be running simultaneously.

**Start the API Server:**
```bash
pnpm run api
```
*API will run on [http://localhost:4000](http://localhost:4000)*

**Start the Development Server:**
```bash
pnpm run dev
```
*App will be available on [http://localhost:3000](http://localhost:3000)*

## 📂 Project Structure

```
├── src/
│   ├── app/                # Next.js App Router & Global Config
│   ├── components/         # Shared UI components
│   ├── features/           # Feature-based organization (Tasks)
│   │   ├── hooks/          # Custom Hooks (Queries & Mutations)
│   │   ├── services/       # API interaction layer
│   │   └── store/          # Zustand state store
│   └── lib/                # Shared utilities & configurations
├── db.json                 # Mock database
└── package.json            # Scripts & Dependencies
```

## 📋 Road Map

- [x] Scaffolding & Setup
- [x] Basic Task Management (CRUD)
- [x] Advanced Drag & Drop Integration
- [ ] Optimistic Updates for real-time feel
- [ ] Unit & Integration Testing
- [ ] Comprehensive Accessibility Audit
- [ ] Dark Mode Support

---

Generated with ❤️ by Antigravity
