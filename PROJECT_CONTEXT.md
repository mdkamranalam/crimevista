# PROJECT_CONTEXT

This document is the single source of truth for CrimeVista. It is not a normal README. It is a technical and product blueprint for experienced engineers, contributors, and future AI assistants working on this project.

The purpose of this document is to capture everything that matters before implementation begins:

- product vision
- problem analysis
- objectives
- scope
- requirements
- architecture
- technology choices
- engineering principles
- development workflow
- AI development rules
- documentation standards
- quality expectations

This document should guide every decision, every feature, every API, every UI screen, every AI model, every database table, and every architecture choice.

---

## 1. Project Vision

CrimeVista is an AI-driven crime analytics and visualization platform designed for the Karnataka State Police and the State Crime Records Bureau. The platform aims to replace fragmented, manual, spreadsheet-driven crime reporting with an integrated intelligence system that helps investigators and analysts uncover patterns, identify hotspots, understand relationships, and make data-driven decisions.

The long-term vision is to create a practical, explainable, and useful intelligence platform that supports proactive policing and smarter resource allocation.

The project must remain focused on solving real investigator problems rather than becoming a generic dashboard or an overly complex system.

---

## 2. Problem Statement Analysis

The core problem is not simply that crime data exists. The real problem is that the data is fragmented, hard to analyze, poorly connected, and largely unusable for deeper intelligence work.

Current challenges include:

- crime records are split across disconnected sources
- analysis relies heavily on manual reporting and spreadsheets
- investigators lack visibility into cross-cutting patterns
- hidden relationships between incidents, suspects, victims, and locations are difficult to detect
- law enforcement teams need better tools for proactive monitoring and strategic action

CrimeVista addresses this by creating a unified platform that combines:

- data integration
- geospatial visualization
- trend and hotspot analysis
- relationship and link analysis
- AI-assisted prediction and anomaly detection

The solution must be grounded in the actual needs of the problem statement and should avoid unnecessary complexity.

---

## 3. Objectives

### 3.1 Business Objectives

- help investigators and analysts understand crime patterns faster
- support better decision-making for resource deployment
- improve visibility across districts, police stations, and crime categories
- demonstrate how AI and data analytics can improve public safety intelligence
- deliver a strong hackathon solution that is practical, understandable, and impactful

### 3.2 Technical Objectives

- build a modular system that can evolve over time
- create a clear data model for incidents, locations, people, and relationships
- expose analytics through a clean backend and intuitive frontend
- make the system easy to explain and demo
- ensure the architecture remains maintainable and testable

### 3.3 AI Objectives

- detect emerging hotspots or risk zones
- identify unusual or anomalous incidents
- reveal hidden connections between incidents and persons
- provide explainable insights rather than black-box outputs

---

## 4. Scope

### 4.1 What We Will Build

The initial version of CrimeVista will include:

- a unified crime intelligence dashboard
- incident and case visualization
- district and police station drill-down views
- geospatial hotspot analysis
- trend and pattern analytics
- repeat offender and relationship insights
- basic AI-driven risk scoring and anomaly detection
- a clean backend API layer
- a usable frontend presentation layer

### 4.2 What We Will Not Build

The project will not include:

- a citizen-facing mobile app
- a chatbot assistant
- unrelated public safety modules
- a fully production-grade enterprise system
- overbuilt authentication and permission systems unless required later
- unnecessary features that do not directly support the core problem statement

This scope boundary is critical. The team must protect focus and avoid feature creep.

### 4.3 Success Criteria

The project will be considered successful if the MVP clearly demonstrates:

- a usable crime intelligence dashboard
- a working map-based view for hotspots
- at least one meaningful trend or pattern insight
- a relationship or network-based insight
- one AI-driven output that adds value to the investigation workflow

### 4.4 MVP Definition

If the hackathon ended tomorrow, the following must be working:

- dashboard overview
- incident exploration
- map-based hotspot view
- one relationship or network insight
- one AI-based insight
- a clear demo narrative

If time becomes short, the following can be deferred:

- advanced authentication
- highly polished UI
- very large-scale data handling
- multiple AI models

### 4.5 User Personas

#### SCRB Analyst

- goals: identify recurring crime patterns and support regional analysis
- responsibilities: reviewing incidents, comparing districts, preparing summaries
- pain points: fragmented reports, repetitive manual analysis, poor visibility into trends
- expectations from CrimeVista: fast insight discovery, strong filters, clear visual summaries

#### Investigating Officer

- goals: understand local crime behavior and investigate suspicious patterns
- responsibilities: reviewing incidents, connecting cases, identifying suspicious areas
- pain points: limited context, weak link analysis, difficulty seeing broader patterns
- expectations from CrimeVista: quick access to case context, map views, and relationship clues

#### Senior Police Officer

- goals: make informed decisions about deployment and strategy
- responsibilities: reviewing trends, monitoring hotspots, supporting resource allocation
- pain points: lack of strategic visibility, slow reporting, reliance on manual summaries
- expectations from CrimeVista: a concise overview, strong analytics, and actionable insights

### 4.6 User Stories

- As an SCRB analyst, I want to identify hotspot districts so that resources can be allocated efficiently.
- As an investigating officer, I want to inspect linked incidents so that I can understand possible patterns faster.
- As a senior police officer, I want to view trend summaries so that I can make better operational decisions.
- As a user, I want to filter incidents by time and location so that I can focus on relevant cases.

### 4.7 Data Assumptions

The initial version will assume:

- the project will work with curated sample, synthetic, or publicly available crime-related data if real police data is not available
- every incident record should include at least: crime type, date/time, district, police station, location, and case identifier
- the system will treat data quality as an important constraint and may require cleaning or normalization before analysis
- backend and AI logic must be built around a consistent schema rather than ad hoc assumptions

---

## 5. Functional Requirements

The following features are required for the first meaningful version of the product.

### 5.1 Prioritization Model

Requirements should be classified as follows:

#### Must Have

- dashboard overview
- incident exploration and filtering
- map-based hotspot visualization
- trend analysis
- relationship or network insight
- API access for frontend consumption
- demo-ready presentation flow

#### Should Have

- drill-down into district and police station levels
- repeat offender tracking
- basic anomaly or risk alerting
- richer chart and map interactions

#### Nice to Have

- advanced forecasting with multiple models
- advanced user roles and permissions
- export features
- extensive historical comparison views

### 5.2 Dashboard Overview

The system must provide a central dashboard showing overview metrics, recent activity, trends, and key insights.

### 5.3 Incident Exploration

Users must be able to view crime incidents, filter them by type, region, date, and other relevant dimensions, and inspect details.

### 5.4 Geospatial Visualization

The system must display crime incidents on a map and support hotspot visualization at district or local levels.

### 5.5 Drill-down Views

The UI must allow users to drill down into districts and police station levels.

### 5.6 Trend Analysis

The system must show temporal trends such as increase or decrease in specific crime types over time.

### 5.7 Relationship and Network Analysis

The system must help identify links between suspects, victims, locations, and incidents.

### 5.8 Repeat Offender Tracking

The platform should highlight repeat offenders and recurring patterns where possible.

### 5.9 AI-Based Insights

The platform should include at least one or two meaningful AI-driven outputs such as:

- risk scoring
- anomaly detection
- hotspot forecasting

### 5.10 API Access

The backend must expose data and analytics through well-defined API endpoints for the frontend.

### 5.11 Demo Readiness

The product must be easy to explain and demonstrate clearly within the hackathon context.

---

## 6. Non Functional Requirements

### 6.1 Performance

The system should respond quickly for core dashboard and query operations on sample or moderate-sized datasets.

### 6.2 Scalability

The architecture should be modular enough to support future growth in data volume and analytical complexity.

### 6.3 Reliability

The application should behave predictably, handle errors gracefully, and avoid crashing on common invalid inputs.

### 6.4 Security

Sensitive data must be handled carefully. Credentials and secrets should not be hardcoded. Proper data handling practices must be followed.

### 6.5 Usability

The platform should be understandable to analysts and easy to present to a non-technical audience during the hackathon.

---

## 7. System Architecture

### 7.1 High-Level Architecture

The system will follow a simple pipeline:

1. ingest and clean crime data
2. store it in a central database
3. process analytics and AI insights
4. expose results via APIs
5. render the results in a frontend dashboard

### 7.2 Component-Level Architecture

- frontend interface for dashboards and visualizations
- backend services for business logic and API delivery
- database layer for structured and geospatial data
- analytics/ML services for insights and forecasting
- optional data processing scripts for cleaning and transformation

### 7.3 Deployment-Level Architecture

The system should be deployable locally for development and, if possible, on a simple cloud environment for demo purposes.

The architecture should remain simple enough to be understandable during the project presentation.

### 7.4 Architecture Constraints

The architecture should respect the following constraints:

- the backend must remain stateless wherever possible
- the database must remain the single source of truth
- AI logic should be separated from the frontend and exposed through services or APIs
- business logic should live on the server side rather than in UI components
- the system should stay modular so that each feature can be developed and tested independently

---

## 8. Technology Stack

### 8.1 Frontend

- React
- optional charting libraries
- optional mapping libraries
- optional graph visualization libraries

### 8.2 Backend

- Python with FastAPI is preferred for analytics-friendly APIs
- Node.js may also be used if team familiarity favors it

### 8.3 Database

- PostgreSQL
- PostGIS for geospatial support

### 8.4 ML

- Python
- scikit-learn or comparable libraries
- simple explainable models first

### 8.5 Visualization

- charts for trends and comparisons
- maps for geospatial analysis
- graphs for relationship analysis

### 8.6 Deployment

- local development environment first
- cloud deployment if feasible for demo purposes

### 8.7 Technology Decision Records

The team should record why major technology choices were made:

- PostgreSQL and PostGIS are preferred because they support structured data and geospatial queries cleanly.
- FastAPI is preferred for the backend because it is simple, modern, and friendly for analytics and ML workflows.
- React is preferred for the frontend because it supports interactive dashboards and reusable components well.
- Python is preferred for ML work because it has strong data science and modeling libraries.
- Map and graph visualization libraries are chosen to make insights understandable and visually compelling during the demo.

---

## 9. Project Principles

The following principles must guide the project:

- never overengineer
- never add features outside the problem statement
- always solve investigator problems
- always keep the architecture modular
- always explain concepts clearly
- prefer simple solutions that work well over complex ones that are hard to explain
- optimize for clarity, usefulness, and hackathon impact

---

## 10. Development Philosophy

The team should think like experienced engineers.

That means:

- understand the problem before coding
- define the minimum valuable solution first
- build iteratively
- validate every major decision
- keep the system understandable
- avoid unnecessary abstraction
- make the solution explainable and presentable

Implementation should be driven by user value, not by flashy but irrelevant features.

### 10.1 Folder Ownership

Once team roles are finalized, ownership should be explicit:

- frontend/ or src/ — frontend engineer
- backend/ or api/ — backend engineer
- models/ or ai/ — AI engineer
- docs/ and dev_docs/ — team lead or project coordinator

### 10.2 Git Workflow

The team should follow a simple collaboration process:

- create short-lived feature branches
- use clear commit messages
- open pull requests for review
- keep main branch demo-ready
- merge only after review and basic verification

---

## 11. Coding Philosophy

### 11.1 Folder Structure

The repository should remain organized and easy to follow.

Suggested structure:

- docs/ for product and solution documentation
- dev_docs/ for internal engineering guidance
- src/ or frontend/ for UI code
- api/ or backend/ for server logic
- data/ for sample or seed data
- models/ for ML-related code
- tests/ for verification and regression checks

### 11.2 Naming Conventions

Use clear, descriptive, and consistent names.

### 11.3 Error Handling

Errors must be handled gracefully. The application should not fail silently.

### 11.4 Comments

Comments should be meaningful and sparse. The code should be self-explanatory where possible.

### 11.5 Clean Code Principles

Follow these principles:

- SOLID
- DRY
- KISS
- YAGNI

The code should be readable, maintainable, and easy to review.

### 11.6 Coding Standards Summary

The team should follow these conventions:

- use small, focused components and functions
- keep file responsibilities clear
- write explicit, readable code over clever code
- use consistent API and component naming
- avoid mixing unrelated logic in the same file

### 11.7 Testing Philosophy

Testing should be part of the build process, not an afterthought.

The project should include:

- unit tests for core logic
- integration tests for API and data flow
- manual checks for UI behavior and dashboard usability
- demo-focused smoke tests before the final presentation

---

## 12. Documentation Philosophy

Every document should be written with a clear purpose.

Documents must:

- explain the why behind decisions
- be concise but complete
- remain aligned with the project scope
- help future contributors understand the system quickly

Documentation is part of the product, not an afterthought.

---

## 13. AI Development Rules

The AI working on this project must behave like a senior software engineer, not like a generic code generator.

The AI must:

- understand the problem deeply before suggesting implementation
- explain the reasoning behind architectural or technical decisions
- ask clarifying questions when the task is underspecified
- propose clean and practical solutions
- review code for quality, structure, and maintainability
- refactor when necessary
- avoid blindly generating code without context

The AI must teach, explain, guide, review, and refactor when appropriate.

It must not simply output code without context or justification.

---

## 14. Beginner Guidelines

Since the team may include beginners, the AI must not simply provide code. It must explain:

- why a solution is appropriate
- how it works
- when it should be used
- what tradeoffs exist

The goal is to build understanding, not only produce output.

---

## 15. Project Workflow

The development workflow should follow this sequence:

Idea
↓
Research
↓
Architecture
↓
Database
↓
Backend
↓
Frontend
↓
AI
↓
Testing
↓
Deployment
↓
Presentation

Each stage should be completed with enough clarity before moving to the next.

---

## 16. Definition of Done

A feature is complete only when all of the following are true:

- implemented
- tested
- reviewed
- documented
- connected to the rest of the system where necessary

A feature is not considered done if it exists only in isolation.

---

## 17. Review Checklist

Before merging any change, the team should ask:

- does this solve the intended problem?
- is the implementation aligned with the project scope?
- is the code clean and understandable?
- is the feature tested?
- is the documentation updated if needed?
- does this improve the demo story?
- is the change maintainable?

---

## 18. Demo Philosophy

The hackathon judges will primarily evaluate the product through the demo, so the experience should be intentionally designed.

The demo should:

- begin with the problem statement
- show the main pain point clearly
- highlight one or two strong insights visually
- demonstrate a simple but compelling end-to-end flow
- end with a clear takeaway about why CrimeVista matters

The wow moment should be the transformation from fragmented data to actionable intelligence.

---

## 19. Prompting Rules

Every future AI conversation should follow these rules:

- understand the task before answering
- keep the request aligned with the project context
- prefer explanation over blind code generation
- avoid unnecessary features
- respect the hackathon scope
- ground suggestions in the project’s documented principles

Future AI work should always be anchored to this document.

---

## 20. Project Constraints

The project operates under several constraints:

- hackathon timeline
- limited time and team capacity
- limited data availability
- need for a strong presentation story
- need to stay focused on the original problem statement

These constraints should shape every decision.

---

## 21. Risks and Mitigations

The main risks include:

- limited or inconsistent dataset quality
- time pressure during implementation
- model accuracy or explainability issues
- browser performance problems with large graphs or maps
- integration complexity between frontend, backend, and AI services

Mitigation strategies:

- use a small but realistic sample dataset first
- prioritize the MVP and defer non-essential features
- keep AI outputs simple and explainable
- validate core flows early and often
- maintain modular interfaces between system layers

---

## 22. Glossary

- SCRB: State Crime Records Bureau
- FIR: First Information Report
- Crime hotspot: a geographic area with elevated or concentrated criminal activity
- Modus operandi: a recurring method or pattern used by an offender
- Link analysis: the study of relationships between people, incidents, and locations
- Spatiotemporal: analysis involving both space and time
- Risk score: a model-based estimate of potential risk or concern
- Incident: a recorded crime event or case entry
- Case: a unit of investigation or related set of incidents

---

## 23. Project Timeline

A practical timeline should look like this:

- Week 1: define architecture, data model, and core UI direction
- Week 2: build backend, data pipeline, and initial dashboards
- Integration: connect frontend, backend, and AI outputs
- Testing: verify core flows and demo readiness
- Demo preparation: refine story, visuals, and presentation flow

---

## 24. Learning Philosophy

Every implementation should improve the team’s understanding of:

- backend development
- frontend development
- machine learning
- architecture
- engineering practices

The project should be a learning experience as well as a solution prototype.
