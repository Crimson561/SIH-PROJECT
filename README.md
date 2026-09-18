# 🚆 RailOptX

## AI-Powered Integrated Railway Maintenance Block Optimization

**Smart India Hackathon 2026 | Problem ID: SIH26027**

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge)](https://sih-project-six-self.vercel.app/)
[![SIH 2026](https://img.shields.io/badge/SIH-2026-blue?style=for-the-badge)](https://www.sih.gov.in/)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61DAFB?style=for-the-badge\&logo=react\&logoColor=white)](https://react.dev/)
[![Express](https://img.shields.io/badge/Backend-Express.js-black?style=for-the-badge\&logo=express\&logoColor=white)](https://expressjs.com/)

> **RailOptX is a decision-support system for railway maintenance block planning that brings maintenance requirements, asset information, train operations, and corridor context together to recommend how a scarce maintenance block can be used more effectively, while keeping final authorization with an authorized human operator.**

### 🌐 Live Demo

**[Open RailOptX →](https://sih-project-six-self.vercel.app/)**

---

## 📌 Overview

Railway maintenance activities are distributed across multiple departments such as **Engineering, S&T, and Traction/OHE**. Each department may have legitimate maintenance requirements, but these requirements can compete for the same corridor and operational time window.

RailOptX addresses this coordination problem by treating the **maintenance block as the scarce operational resource**.

The system brings fragmented maintenance and operational information together, identifies potentially compatible maintenance work, checks operational constraints, and recommends how available maintenance blocks can be utilized more effectively.

The final decision remains with the authorized human operator.

---

## 🎯 Problem Statement

Railway maintenance planning involves multiple departments, assets, locations, resources, and operational constraints.

Independent planning can lead to:

* Conflicting maintenance windows
* Under-utilized maintenance blocks
* Difficulty coordinating cross-department maintenance
* Conflicts with train operations
* Fragmented maintenance and operational information
* Difficulty adapting to changing operational conditions

### Core Insight

> **The scarce resource is not simply the individual maintenance task — it is the operational maintenance block.**

RailOptX therefore focuses on coordinating and optimizing work around the available maintenance block rather than optimizing maintenance tasks in isolation.

---

## 💡 Proposed Solution

RailOptX acts as a **coordination and optimization layer** between maintenance information, asset information, train operations, corridor availability, and the human control desk.

The overall workflow is:

```text
Maintenance Requests
        +
Asset Health
        +
Train Operations
        +
Corridor Availability
        ↓
    DATA FUSION
        ↓
    PRIORITIZATION
        ↓
 COMPATIBILITY CHECK
        ↓
   CONSTRAINT CHECK
        ↓
    OPTIMIZATION
        ↓
 HUMAN REVIEW / APPROVAL
        ↓
     PLAN / REPORT
```

---

## ✨ Key Features

### 🧩 Integrated Maintenance Planning

Combines relevant maintenance requirements from different departments into a unified planning context.

### 🤖 AI-Assisted Prioritization

The planned AI layer can help prioritize maintenance work using signals such as:

* Criticality
* Urgency
* Asset impact
* Validated historical and operational information

AI is intended to help determine **which maintenance work should receive more attention**.

### 🔗 Cross-Department Compatibility

The system can identify potentially compatible maintenance activities based on:

* Corridor or segment
* Time window
* Duration
* Department and resource availability
* Protection requirements
* Operational feasibility
* Possible interference between activities

### 🚦 Constraint Checking

The planning process considers important operational constraints such as:

* Train-path protection
* Corridor capacity
* Block duration
* Resource availability
* Protection conditions
* Task compatibility

### 📊 Operational Dashboard

The prototype provides a unified dashboard containing planning and operational context, including:

* AI Block Decision
* Corridor Status
* KPI Metrics
* Corridor Map
* Exceptions Feed
* 24-hour Timeline
* Cross-check and Approval Flow

### 👤 Human-in-the-Loop

RailOptX does not autonomously authorize safety-critical railway blocks.

The intended flow is:

```text
AI Recommendation
        ↓
Constraint / Optimization Check
        ↓
Human Operator Review
        ↓
Authorized Approval
        ↓
Plan Recorded / Audited
```

---

## 🧠 AI and Optimization

RailOptX separates **AI-based prioritization** from **optimization**.

### AI — Prioritization

AI is intended to answer:

> **"What maintenance work should receive more attention?"**

Possible signals include:

* Criticality
* Urgency
* Asset impact
* Validated historical information
* Operational information

### Optimization — Feasibility

The optimization layer is intended to answer:

> **"What can actually be scheduled while obeying the rules?"**

The planning architecture is designed around constraint-heavy scheduling.

Potential optimization approaches include:

* Mixed Integer Linear Programming (MILP)
* Constraint Programming
* CP-SAT
* OR-Tools

The exact production formulation would need to be defined and validated with railway-domain experts.

---

## 🔗 Maintenance Task Compatibility

Before maintenance tasks are combined into a candidate block, the system should consider:

* Same or compatible corridor/segment
* Compatible time windows
* Required duration
* Block duration limits
* Department/team/resource availability
* Protection and safety requirements
* Whether activities interfere with each other
* Train-path constraints
* Corridor capacity
* Overall operational feasibility

For example, Engineering, S&T, and Traction/OHE work may be bundled when their locations, timing, resources, protection requirements, and operational constraints permit.

---

## ⚙️ Constraint Handling

RailOptX distinguishes between **hard constraints** and **soft considerations**.

### Hard Constraints

Rules that must not be violated:

* Incompatible tasks cannot overlap
* Minimum and maximum block duration must be respected
* Required resources must be available
* Train-path protection cannot be violated
* Corridor capacity constraints must be respected
* Required operational and protection conditions must hold

### Soft Considerations

These may influence planning preferences or objective value, depending on the validated formulation:

* Maintenance priority
* Avoidable idle time
* Other validated planning preferences

---

## 🏗️ System Architecture

### Production-Oriented Architecture

```text
TMS / SMMS / TDMS / Timetable / Operational Sources
                        ↓
                 Adapter / API Layer
                        ↓
                Normalize + Validate
                        ↓
                   Data Platform
                    ↙          ↘
       AI Prioritization    Constraint Engine
                    ↘          ↙
                     Optimizer
                         ↓
                 Explainable Plan
                         ↓
                    Control Desk
                         ↓
                Human Authorization
                         ↓
                    Audit + Report
```

RailOptX is intended as a coordination and optimization layer over relevant information rather than a replacement for existing railway systems.

---

## 🔄 Maintenance Request Workflow

A maintenance request follows the following conceptual workflow:

```text
1. Request enters the system
2. Validate / normalize data
3. Determine asset, location, duration, department and priority
4. Consider operational window
5. Find potentially compatible tasks
6. Check hard constraints
7. Build candidate block(s)
8. Optimize useful work subject to constraints
9. Explain recommendation
10. Human operator reviews
11. Authorized plan is finalized
12. Report / audit output is generated
```

---

## 🚄 Railway Concepts

### Maintenance Block

A maintenance block is an allocated operational window in which specified maintenance work can be performed under the required operational and protection conditions.

RailOptX treats this block as a **scarce scheduling resource**.

### Departments

| Department   | Area                                       |
| ------------ | ------------------------------------------ |
| Engineering  | Track and civil infrastructure             |
| S&T          | Signalling and telecommunications          |
| Traction/OHE | Electrical traction and overhead equipment |

### Corridor / Section

A corridor or section represents the railway segment where maintenance work and train movement interact.

Location matters because tasks that are far apart are generally not useful as one combined maintenance block.

---

## 🗃️ Data Model

### Train

* ID
* Route / segment
* Movement information
* Timetable information
* Current / forecast position

### Maintenance Task

* ID
* Department
* Asset
* Location / corridor
* Duration
* Priority
* Status
* Overdue state

### Asset

* Type
* Location
* Health / defect information
* Inspection history

### Block

* Corridor / segment
* Proposed start and end
* Duration
* Included tasks
* Protection / constraint state

### Conflict

* Involved train, task, or block
* Time / location
* Conflict type
* Status
* Explanation

### Audit Log

The production design includes records of:

* Recommendation events
* Changes
* Approvals
* Actor information

---

## 🚦 Operational Conflict Handling

A conceptual production conflict-detection workflow is:

```text
Identify Block Segment
        ↓
Find Trains Intersecting the Segment
        ↓
Calculate Relevant Train Time Windows
        ↓
Compare With Proposed Block + Safety Buffers
        ↓
Apply Operational / Safety Constraints
        ↓
Create Explainable Conflict Record
        ↓
Present to Authorized Operator
        ↓
Human Authorization
```

The current prototype does not perform live railway conflict detection.

---

## 🖥️ Frontend Architecture

The current frontend flow is:

```text
index.html
    ↓
src/main.tsx
    ↓
React createRoot()
    ↓
Pages / Components
    ↓
State + Mock/API Data
    ↓
User Interaction
    ↓
fetch()
    ↓
Backend API
    ↓
Response
    ↓
UI Update
```

---

## 📊 Dashboard

The RailOptX dashboard provides a unified view of maintenance planning and operational context.

### AI Block Decision

Displays proposed block and recommendation information.

### Corridor Status

Provides operational context for the relevant corridor.

### KPI Metrics

Provides summary measures related to planning and maintenance.

### Mini Corridor Map

Provides visual context for corridor and train activity.

### Exceptions Feed

Highlights conflicts or conditions requiring attention.

### 24-Hour Timeline

Provides a temporal view of planned maintenance activity.

### Cross-Check & Approval

Keeps the human operator involved in the final decision process.

---

## 🔌 API Endpoints

The current prototype backend provides the following API endpoints:

| Method  | Endpoint               | Description                             |
| ------- | ---------------------- | --------------------------------------- |
| `GET`   | `/api/test`            | Test the backend API                    |
| `GET`   | `/api/trains`          | Retrieve train records                  |
| `GET`   | `/api/maintenance`     | Retrieve maintenance records            |
| `POST`  | `/api/maintenance`     | Create a maintenance resource           |
| `PATCH` | `/api/maintenance/:id` | Partially update a maintenance resource |

### HTTP Status Codes

```text
200 → Successful response
201 → Successful resource creation
400 → Bad request
404 → Resource not found
```

The current maintenance store is **in-memory**, and the current train endpoint returns synthetic records.

---

## 🛠️ Technology Stack

### Current Prototype

| Layer           | Technology            |
| --------------- | --------------------- |
| Frontend        | React                 |
| Language        | TypeScript            |
| Backend         | Express.js            |
| Communication   | REST API              |
| Client Requests | `fetch()`             |
| Data            | Synthetic / Mock Data |

### Planned Production Architecture

| Layer        | Technology                     |
| ------------ | ------------------------------ |
| Backend      | Python + FastAPI               |
| Database     | PostgreSQL                     |
| Optimization | OR-Tools / MILP / CP-SAT       |
| Integration  | Controlled API / Adapter Layer |
| Security     | Authentication + Authorization |
| Auditing     | Persistent Audit Trail         |

---

## 🔐 Safety and Security

RailOptX follows a **human-in-the-loop** approach for safety-critical decisions.

Production readiness would require:

* Authentication
* Role-based authorization
* Input and schema validation
* Persistent storage
* Audit logs
* HTTPS
* Secure integration
* Monitoring
* Error handling
* Controlled adapters to approved railway systems
* Role-based approval for safety-critical actions

> **RailOptX is a decision-support system and is not intended to autonomously authorize railway safety-critical operations.**

---

## 🔄 Handling Changing Conditions

### Train Delays

Operational conditions can change after a maintenance recommendation has been generated.

If a train is delayed, the affected proposed block should be:

1. Flagged for conflict/review
2. Re-evaluated
3. Potentially re-optimized

The system should not blindly assume that an earlier recommendation remains valid.

### No Feasible Solution

If a requested combination cannot satisfy the current constraints, the system should not force an invalid plan.

Instead, it should:

* Report infeasibility
* Identify blocking constraints where possible
* Consider another time window
* Consider another task grouping
* Consider deferred work
* Allow the operator/planner to review alternatives

---

## 📈 KPIs

Potential performance indicators include:

* Block utilization
* Planned vs. actual maintenance
* Overdue-task reduction
* Avoidable conflict reduction
* Useful maintenance work completed per granted block
* Asset availability
* Operational outcomes after pilot validation

Prototype confidence values should not be treated as substitutes for real-world KPI validation.

---

## 🧪 Current Prototype vs Production

| Area         | Current Prototype            | Production Direction                         |
| ------------ | ---------------------------- | -------------------------------------------- |
| Data         | Synthetic / Mock             | Approved operational sources                 |
| Train Data   | Hard-coded synthetic records | Authenticated / validated feeds              |
| Maintenance  | In-memory array + API        | Persistent database                          |
| AI           | Mock recommendation workflow | Validated ML / rule component                |
| Optimization | Concept / Architecture       | Validated OR-Tools / MILP / constraint model |
| Map          | Simulated positions          | Validated operational / geospatial feed      |
| Settings     | Local UI state               | Persisted configuration service              |
| Approval     | Demo UI flow                 | Role-based authorization + audit trail       |
| Reports      | Demo / export flow           | Actual report-generation service             |

---

## 🚀 Future Scope

### 1. Real Operational Data Integration

Connect RailOptX to approved railway information and operational sources through controlled adapters and APIs.

### 2. Persistent Database

Move prototype in-memory data to a persistent PostgreSQL-backed data platform.

### 3. Validated AI Component

Develop and validate an ML or rule-based prioritization component using appropriate operational data.

### 4. Production Optimization Engine

Implement and validate a formal scheduling model using suitable MILP, CP-SAT, or OR-Tools approaches.

### 5. Dynamic Re-Optimization

Re-evaluate maintenance plans when:

* Train delays occur
* Operational conditions change
* New maintenance requests arrive
* Resources change
* Corridor conditions change

### 6. Enterprise Security

Introduce:

* Authentication
* Authorization
* Secure APIs
* Audit trails
* Monitoring
* Controlled system integration

### 7. Safety Validation

Production deployment involving safety-critical railway operations would require appropriate railway-domain validation, controlled integration, and safety approval processes.

---

## 🎬 Demo Flow

The prototype can be demonstrated using the following flow:

```text
Open Dashboard
      ↓
Show Proposed Block RB-104
      ↓
Explain Recommendation / Confidence
      ↓
Show Conflict / Exception Context
      ↓
Show Maintenance Tasks
      ↓
Show Asset Health
      ↓
Show Train / Corridor Information
      ↓
Explain Compatible Cross-Department Work
      ↓
Show Review / Approval Flow
      ↓
Show Report / Export Output
```

> Prototype values should be presented as synthetic/mock data and not as live railway operational information.

---

## 🎯 What Makes RailOptX Different?

The central concept of RailOptX is to coordinate maintenance activities around the **scarce maintenance block**.

Instead of looking at each maintenance task independently, RailOptX brings together:

```text
Maintenance
     +
Assets
     +
Trains
     +
Corridor
     +
Resources
     +
Constraints
     ↓
Integrated Planning View
```

This allows potentially compatible cross-department work to be considered within the same operational planning context.

---

## 🧭 Final Mental Model

```text
Many Maintenance Requests
            ↓
     One Operational Picture
            ↓
      Which Work Matters?
            ↓
   Which Work Can Be Combined?
            ↓
    What Is Actually Feasible?
            ↓
Which Block Uses The Window Best?
            ↓
        Human Review
            ↓
      Authorized Plan
            ↓
        Audit / Report
```

RailOptX is therefore not simply an "AI dashboard".

It is designed as a **coordination and optimization layer between fragmented information sources and the human control desk**.

---

## 📌 Project Status

**Status:** 🚧 Prototype / SIH 2026 Demonstration

The current prototype demonstrates the RailOptX decision-support workflow using synthetic/mock data.

The current prototype should not be represented as:

* A live railway control system
* A production railway database
* A live railway data integration
* A trained AI inference pipeline
* An autonomous block-authorization system
* A production safety-validated system

These capabilities represent future production directions.

---

## 🏆 Smart India Hackathon

**Event:** Smart India Hackathon 2026
**Problem ID:** SIH26027
**Project:** RailOptX
**Category:** Railway Maintenance / AI-Assisted Optimization

---

## 👥 Team

Add your team details below:

| Name            | Role             |
| -------------   | ---------        |
| Deepak Banga    | Leader/Backend   |
| Pratyush Kapoor | Frontend         |
| Niyati Gupta    | AI Developer     |
| Damanpreet Kaur | Product Designer |
| Devansh Bhalla  | Workflow Manager |
| Alankrita Garg  | Representer      |

---

## 📄 Disclaimer

RailOptX is a prototype developed for demonstrating an AI-assisted railway maintenance block planning concept.

The current prototype uses synthetic/mock data and is intended for demonstration and decision-support purposes.

Production deployment would require validated operational data, railway-domain validation, safety validation, secure system integration, authentication and authorization, persistent data infrastructure, auditability, and authorized human oversight.

**Final safety-critical decisions remain with authorized human operators.**

---

## ⭐ RailOptX

### Coordinate. Optimize. Review. Authorize.

**Turning fragmented railway maintenance information into an integrated planning view.**
