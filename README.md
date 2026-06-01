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

* **Immersive Landing Page:** A dynamic entry point with 3D canvas rendering and smooth scroll-triggered animations.
* **Unit Management Dashboard:** A centralized hub to inspect, delete, and monitor the status of all registered robotic units in real-time.
* **Unit Registration:** A streamlined, highly animated form to register new units and generate secure linking codes.
* **Secure Authentication:** Seamless login and registration flows tailored for operators.
* **Immersive UI/UX:** High-performance animations powered by GSAP, glowing glassmorphism aesthetics, dynamic background pulses, and responsive layouts that adapt to any terminal screen.

## Prerequisites

Before running the application, ensure you have the following installed:
* Node.js (v16.x or higher recommended)
* npm or yarn package manager
* The B.O.B.D.S. Backend server running locally or remotely

## Installation

1. Clone the repository.
2. Navigate to the `FrontEnd` directory.
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory if environment variables are required (Vite proxies requests to the backend natively via `vite.config.js`).
5. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

Once the development server is running, navigate to the provided localhost port (typically `http://localhost:5173`).

* **Landing Page:** Introduces the ecosystem.
* **Authentication:** Access is restricted to authorized operators.
* **Dashboard:** The central command interface to manage units and view system status.

## Code Structure

* `FrontEnd/src/components/`: Contains all React functional components and layouts.
* `FrontEnd/src/pages/`: Contains the main route views (Dashboard, Register, Auth).
* `FrontEnd/src/assets/`: Houses static assets like images, 3D models, and global fonts.
* `FrontEnd/src/index.css`: Global styles including custom scrollbar behaviors and Tailwind directives.