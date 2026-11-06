# CEVOS
## Community EV Operating System

**Affordable • Modular • Open Source**

CEVOS is an open-source prototype for planning electric vehicle conversions.

The current web app brings vehicle data, powertrain selection, preliminary screening, planning estimates, and project reports into one workflow. The longer-term vision is a collaborative engineering workspace; not all planned capabilities are implemented yet.

---

## Vision

Converting a vehicle to electric power often requires information scattered across forums, spreadsheets, CAD files, build threads, and vendor catalogs.

CEVOS brings these tools together into a single platform.

The current prototype lets users:

- Browse or search donor vehicles and load an Infiniti QX60 demo build
- Select a battery pack and motor
- Review preliminary compatibility findings and planning estimates
- Generate a bill of materials and PDF conversion report
- Save, reload, and compare builds in the current browser

---

## Core Objectives

### Affordable

Reduce the cost and complexity of planning EV conversions.

### Modular

Support multiple vehicle platforms, battery architectures, and powertrain options.

### Open Source

Enable builders, engineers, educators, and enthusiasts to collaborate and contribute.

### Community Driven

Create a shared knowledge base of proven EV conversion designs.

---

## Current Prototype

### Vehicle

**2017 Infiniti QX60**

| Specification | Value |
|---------------|---------|
| Vehicle Type | Mid-Size Luxury SUV |
| Drivetrain | AWD |
| Battery | 95 kWh NMC |
| Voltage | 400V |
| Motor | Phoenix HyperDrive 250 |
| Peak Power | 250 kW |
| Peak Torque | 450 Nm |
| Estimated Range | 285 Miles |
| 0-60 MPH | 5.6 Seconds |

### Engineering Guidance Limitations

CEVOS compatibility guidance is preliminary rule-based screening, not engineering validation or approval. Physical fitment, voltage/current compatibility, axle loads, thermal capacity, structural mounting, and wiring integration are not assessed. Range and cost values are estimates based on limited assumptions. Have a qualified engineer review vehicle-specific measurements and component specifications before purchasing parts or beginning fabrication.

---

## Future Roadmap

Planned capabilities include physical fitment and weight-distribution analysis, interactive 3D packaging, deeper simulation, AI-supported recommendations, wiring diagrams, and shared project storage. See [ROADMAP.md](ROADMAP.md) for milestones and scope.

## Run Locally

```bash
cd frontend
npm ci
npm run dev -- --host 0.0.0.0
```

Run the frontend checks with `npm test` and create a production build with `npm run build`.

The frontend requests the vehicle catalog from `http://localhost:5000/api` by default. Override this with `VITE_API_URL`; if the API is unavailable, the app uses its local vehicle catalog.

## Data and Storage

- Saved projects are stored in the browser's local storage. They are not shared across browsers or devices.
- The backend currently uses an in-memory project repository. The PostgreSQL migration is not yet wired to project CRUD, so it does not provide durable backend storage.
- Range, cost, and compatibility results are planning estimates, not engineering validation. See the limitations below before relying on them.

---

## Project Architecture

```text
cevos-platform/
├── backend/
├── data/
├── database/
├── docs/
├── engineering-engine/
└── frontend/
```

### Frontend

- React 18 and Vite
- JSX and CSS, with TypeScript service and type modules
- jsPDF for report exports

### Backend

- .NET 9 Web API
- Catalog API with local frontend fallback
- In-memory project repository; PostgreSQL persistence is not integrated yet

---

## Development Roadmap

- Current release: v0.2.0
- Next target: v0.3, focused on expanded engineering analysis and design guidance
- Detailed milestones: [ROADMAP.md](ROADMAP.md)

---

## Contributing

Contributions are welcome.

Areas of interest include:

- Vehicle data
- CAD models
- Wiring diagrams
- Battery designs
- Software development
- Testing and validation
- Documentation

Please submit issues, feature requests, and pull requests through GitHub.

---

## Mission Statement

Our mission is to accelerate EV adoption by making vehicle electrification practical, understandable, and accessible to builders everywhere.

Together we can create an open platform that enables anyone to design, simulate, and share reliable EV conversions.

---

## Status

**Project Status:** Prototype

**Current Release:** v0.2.0

**Next Target:** v0.3

**Project Type:** Open Source

**License:** MIT

---

*"Build the future. Together."* ⚡🚗
