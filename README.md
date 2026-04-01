<div align="center">
  <h1>🚀 Mindluster Kanban</h1>
  <p><strong>A high-performance, aesthetically pleasing Kanban board for modern productivity.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Material%20UI-v6-007FFF?style=flat-square&logo=mui" alt="MUI" />
    <img src="https://img.shields.io/badge/TanStack%20Query-v5-FF4154?style=flat-square&logo=react-query" alt="TanStack Query" />
    <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  </p>
</div>

---

## 📖 Overview

**Mindluster** is a cutting-edge Kanban solution designed to bridge the gap between performance and aesthetics. Built with the latest React ecosystem tools, it provides a seamless, fluid experience for managing tasks across various stages of completion. Whether you're a developer tracking bugs or a project manager organizing sprints, Mindluster offers the precision and speed you need.

## ✨ Key Features

- 🏗️ **Smart Kanban Board**: Effortless drag-and-drop interactions using `@hello-pangea/dnd`.
- 🔄 **Real-Time Synchronicity**: Powered by TanStack Query for blazing-fast state management and optimistic updates.
- 📱 **Adaptive UI**: A truly mobile-first responsive design that feels native on any device.
- 🎨 **Premium Aesthetics**: Built on Material UI v6 with a focus on modern typography and smooth transitions.
- 🔍 **Instant Search**: Find any task across all columns with zero-latency filtering.
- 🛡️ **Type-Safe Validation**: Robust form handling and input validation using Zod and React Hook Form.

## 🛠 Project Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | Material UI v6 |
| **State Management** | Zustand & TanStack Query v5 |
| **Form Management** | React Hook Form & Zod |
| **API Client** | Axios |
| **Mock Backend** | json-server |
| **Icons** | Material Icons |

## 🚀 Getting Started

Follow these steps to get a local development environment running.

### 1. Prerequisites

- **Node.js** (v20 or higher recommended)
- **pnpm** (preferred package manager)

### 2. Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/HodaNabeil/assessment-mindluster.git
cd assessment-mindluster
pnpm install
```

### 3. Local Development

You need to run the mock API server and the development server concurrently:

**Start the JSON API Server:**
```bash
pnpm run api
```
*The API will be available at [http://localhost:4000](http://localhost:4000)*

**Start the Next.js Dev Server:**
```bash
pnpm run dev
```
*The application will be live at [http://localhost:3000](http://localhost:3000)*

## 📂 Project Architecture

The project follows a feature-based folder structure for maximum scalability and maintainability.

```bash
src/
├── app/              # Next.js App Router, global styles, and layout
├── components/       # Shared UI components (Layout, Feedbacks, etc.)
├── constants/        # Application-wide configuration and static data
├── features/         # Core business modules (e.g., tasks)
│   ├── components/   # Feature-specific UI components
│   ├── hooks/        # Custom queries, mutations, and domain logic
│   ├── services/     # API request definitions
│   ├── store/        # Zustand state definitions
│   └── types/        # TypeScript interfaces for the feature
├── lib/              # Shared utilities, API client, and theme config
├── providers/        # Global React Context providers (Query, Theme)
└── validation/       # Zod schemas for entity validation
```

## 📋 Development Roadmap

- [x] Initial System Architecture & Setup
- [x] CRUD Functionality for Tasks
- [x] Kanban Drag-and-Drop Integration
- [x] Optimistic Updates for Smooth UX
- [x] Responsive Design & Layout Optimization
- [x] Refined Form Validation (Zod)
- [ ] Unit & Integration Testing
- [ ] Accessibility (A11y) Certification
- [ ] Interactive Onboarding Tutorial

---

<div align="center">
  Developed by <strong>Hoda Nabeil</strong>. Built for productivity.
</div>

