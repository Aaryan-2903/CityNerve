<div align="center">
  
# CityNerve

**AI-Powered Disaster Intelligence & Emergency Operations Platform**

An intelligent command dashboard that transforms how disaster management agencies monitor incidents, analyze risks, and coordinate emergency response.

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MapLibre](https://img.shields.io/badge/MapLibre-GL-4A5568?style=for-the-badge)
![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-7EBC6F?style=for-the-badge&logo=openstreetmap&logoColor=white)
![MIT License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Status: In Development](https://img.shields.io/badge/Status-In%20Development-orange?style=for-the-badge)

<br />

![Current Operations Dashboard](./public/dashboard.png)
*Current Operations Dashboard*

</div>

---

## ⚡ About CityNerve

**CityNerve** is an AI-powered Emergency Operations Center (EOC) that helps disaster management agencies monitor incidents, analyze risks, coordinate emergency response, and support faster decision-making through an intelligent command dashboard. Built with a focus on mission-critical clarity and real-time situational awareness, CityNerve aims to bridge the gap between complex data and actionable insights during urban emergencies.

---

## ✨ Key Features

- 🚨 **Live Incident Monitoring:** Track active emergencies, severity levels, and response status in real-time.
- 🗺 **Interactive Risk Map:** High-performance vector maps using MapLibre GL for plotting incidents, risks, and routes.
- 🌦 **Weather Intelligence:** Real-time localized weather conditions, forecasts, and extreme weather alerts.
- 🚒 **Resource Management:** Deploy, track, and manage emergency response assets across the city.
- 🏥 **Shelter Tracking:** Monitor safe zones, evacuation routes, and shelter capacities.
- 📊 **Impact Summary:** Instant aggregation of affected population, road closures, and critical infrastructure status.
- 🤖 **AI Command Center** *(Coming Soon)*: Intelligent decision support, predictive threat modeling, and automated action plans.
- 📡 **Disaster Simulation Engine** *(Coming Soon)*: Run realistic, multi-stage emergency scenarios for training and planning.

---

## 🛠 Technology Stack

### Frontend
- **Next.js** — App Router, SSR, and API routes
- **React** — UI components and state management
- **TypeScript** — Strict type safety across the platform
- **Tailwind CSS** — Utility-first, responsive, premium dark-mode styling
- **shadcn/ui** — Accessible and customizable component primitives
- **Framer Motion** — Fluid micro-animations and transitions

### Maps
- **MapLibre GL** — Open-source, high-performance WebGL map rendering
- **OpenStreetMap** — Free and open geographic data

### Backend *(Planned)*
- **Node.js** & **Express** — Scalable API services

### Artificial Intelligence *(Planned)*
- **Gemini API** — Core engine for the AI decision support and predictive analytics

### Deployment
- **Vercel** — Edge network deployment and CI/CD

---

## 📂 Project Architecture

```text
citynerve/
├── app/                  # Next.js App Router pages and layouts
├── components/           # Reusable UI components
│   ├── ai/               # AI reasoning and briefing panels
│   ├── cards/            # Incident and metric display cards
│   ├── layout/           # Dashboard shell, sidebar, and navigation
│   ├── map/              # MapLibre wrappers and layer controls
│   ├── panels/           # Control widgets (Weather, Resources, etc.)
│   └── shared/           # Generic buttons, badges, and base elements
├── constants/            # Configuration constants and theme setups
├── context/              # React Context providers (e.g., Simulation Engine)
├── data/                 # Mock datasets and simulation scenarios
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and generic helpers
├── public/               # Static assets and images
└── types/                # TypeScript interface definitions
```

---

## 🚀 Current Progress

### Completed
- [x] Dashboard Core Layout
- [x] High-performance Interactive Map
- [x] Live Incident Feed
- [x] Weather Intelligence Widget
- [x] Resource Management Tracking
- [x] Regional Impact Summary

### Upcoming
- [ ] Disaster Simulation Engine
- [ ] AI Command & Decision Support
- [ ] Citizen Reporting Integration
- [ ] Predictive Analytics Module
- [ ] Presentation / Briefing Mode

---

## 🗺 Future Roadmap

| Phase | Milestone | Status |
| :---: | :--- | :---: |
| **Phase 1** | Dashboard & Map Core | ✅ |
| **Phase 2** | Simulation Engine | ⬜ |
| **Phase 3** | AI Decision Support | ⬜ |
| **Phase 4** | Backend Integration | ⬜ |
| **Phase 5** | Real API Data Streams | ⬜ |

---

## 🏁 Getting Started

Clone the repository and install the dependencies to run the dashboard locally.

```bash
# 1. Clone the repository
git clone https://github.com/Aaryan-2903/CityNerve.git

# 2. Navigate to the project directory
cd citynerve

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the platform in action.

---

## 📸 Screenshots

<details>
<summary><b>View Application Screenshots</b></summary>
<br/>

### Operations Dashboard
> *Placeholder: Add your operations dashboard screenshot here*

### AI Command Center
> *Placeholder: Add your AI Command panel screenshot here*

### Disaster Simulation
> *Placeholder: Add your simulation engine screenshot here*

</details>

---

## 🤝 Contributing

We welcome contributions from the open-source community! Whether it's adding new features, fixing bugs, or improving documentation, your help is appreciated.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows the existing style guidelines and includes appropriate type definitions.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Built with ❤️ by <b>Aryan Mandal</b></p>
  <p>
    <a href="https://github.com/Aaryan-2903">GitHub Profile</a>
  </p>
</div>
