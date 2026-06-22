<p align="center">
  <img src="./logo.png" alt="B.O.B.D.S. Logo" width="150" />
</p>

<h1 align="center">B.O.B.D.S. Client</h1>

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP" />
</p>

## About The Project

B.O.B.D.S. Client is the frontend application for the Base Operativa de Batalla y Defensa del Sistema (B.O.B.D.S.). It provides a highly immersive, futuristic, and interactive user interface for operators to monitor units, register new robotic components, and manage the system's defenses. Built with a modern glassmorphism design philosophy and complex GSAP animations, the application guarantees a premium, cinematic user experience.

## Key Features

* **Real-time Order & Unit History:** Live updates driven by Server-Sent Events (SSE), dynamically sorting orders chronologically via ID tiebreakers without manual refreshing.
* **Immersive Landing Page:** A dynamic entry point with 3D canvas rendering and smooth scroll-triggered animations.
* **Unit Management Dashboard:** A centralized hub to inspect, delete, and monitor the status of all registered robotic units in real-time, with clear separation between owned and linked units.
* **Role-Based Views & Permissions:** Complex UI conditional rendering strictly governed by the operator's role hierarchy (Propietario, Co-Propietario, Administrador, Operador, Invitado).
* **Audit & Monitoring Panel:** Dedicated interface for Administrators and Owners to trace platform-wide interaction logs with custom combobox filters.
* **Order Management & History:** Create and inject orders directly into units, with full traceability and dynamic history.
* **Immersive UI/UX:** High-performance animations powered by GSAP (including timeline-managed deletions), glowing glassmorphism aesthetics, custom comboboxes replacing native selects, and responsive layouts.

## Prerequisites

Before running the application, ensure you have the following installed:
* Node.js (v16.x or higher recommended)
* npm or yarn package manager
* The B.O.B.D.S. Backend server running locally or remotely

> [!IMPORTANT]
> A running B.O.B.D.S Backend server is strictly required. Without it, the UI will successfully load but authentication and SSE connections will fail.

## Installation

1. Clone the repository.
2. Navigate to the `FrontEnd` directory.
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory if environment variables are required.

   > [!NOTE]
   > Vite proxies requests to the backend natively via `vite.config.js`, so you might not need to set the backend URL in `.env` for local development.

5. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

Once the development server is running, navigate to the provided localhost port (typically `http://localhost:5173`).

* **Landing Page:** Introduces the ecosystem.
* **Authentication:** Access is restricted to authorized operators.
* **Dashboard:** The central command interface to manage units and view system status.

> [!CAUTION]
> Deleting a unit from the dashboard will permanently revoke access to all operators linked to it.

## Code Structure

* `FrontEnd/src/pages/`: Primary application views and complex interfaces.
  * `LoginPage.jsx` & `SignupPage.jsx`: Authentication, verification, and password recovery workflows.
  * `UnitsPage.jsx`: Central dashboard for real-time unit management featuring complex GSAP animations and dynamic overlays.
  * `WriteOrderPage.jsx`: Interfaces for dispatching payload orders to units.
* `FrontEnd/src/components/`: Reusable UI elements, navigation bars, and structural layouts.
* `FrontEnd/src/context/`: React context providers managing global state (`AlertContext`, `AuthContext`, `LoadingContext`).
* `FrontEnd/src/services/`: Abstraction layer for HTTP client interactions with the backend API.
* `FrontEnd/src/assets/`: Static resources including images, 3D models, and typography files.
* `FrontEnd/tailwind.config.js` & `FrontEnd/postcss.config.js`: Configuration files for the Tailwind CSS utility framework.
* `FrontEnd/src/index.css`: Global stylesheet containing Tailwind directives, CSS variables, and custom layout adjustments.
## Deployment (Docker & .env)
This component is fully containerized using Docker and served via Nginx. It also serves as the main orchestrator repository for the Dokploy PaaS, housing the global docker-compose.yml. Configuration is managed via a .env file located in the root directory (excluded via .gitignore).
