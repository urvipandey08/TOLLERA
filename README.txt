# TOLLÉRA
### RFID-Based Automated Toll Collection System

**SMARTER TOLLING. SEAMLESS MOVEMENT.**

An Arduino, RFID and Firebase-powered solution for automated vehicle identification and toll management.

[🌐 Live Website](https://urvipandey08.github.io/TOLLERA/) | [💻 GitHub Repository](https://github.com/urvipandey08/TOLLERA)

---

## 01. Overview

TOLLÉRA automates toll collection through RFID-based vehicle identification, toll processing and digital transaction management.

## 02. System Architecture

```mermaid
flowchart TD
    A[RFID Card / Tag] --> B[RFID Reader]
    B --> C[Arduino Uno]
    C --> D[Toll Processing]
    D --> E[Servo Barrier]
    D --> F[LCD / LED / Buzzer]
    D --> G[Firebase]
    G --> H[Web Dashboard]
```

## 03. Toll Collection Process

```mermaid
flowchart TD
    A([Vehicle Arrives]) --> B[Scan RFID]
    B --> C{Registered?}
    C -->|No| D[Access Denied]
    C -->|Yes| E{Balance Available?}
    E -->|No| D
    E -->|Yes| F[Deduct Toll]
    F --> G[Update Records]
    G --> H[Open Barrier]
    H --> I([Vehicle Passes])
```

## 04. Web Application

```mermaid
flowchart TD
    A[Login] --> B[Dashboard]
    B --> C[Live Operations]
    B --> D[Vehicle Profiles]
    B --> E[Transaction History]
    B --> F[Analytics]
    B --> G[Toll Rates]
```

## 05. Key Features

- RFID vehicle identification
- Automated toll deduction
- Servo-controlled barrier
- LCD and alert indicators
- Vehicle and transaction management
- Dashboard and analytics
- Search, filters and CSV export
- Dark and light themes

## 06. Hardware

| Component | Purpose |
|---|---|
| Arduino Uno | Main controller |
| MFRC522 | RFID reader |
| RFID Cards / Tags | Vehicle identification |
| 16×2 LCD | Status display |
| Servo Motor | Barrier control |
| LED & Buzzer | Alerts |

## 07. Technology Stack

| Technology | Purpose |
|---|---|
| HTML, CSS, JavaScript | Web application |
| Firebase Authentication | Login |
| Cloud Firestore | Data management |
| Arduino IDE | Hardware programming |
| GitHub | Version control |
| GitHub Pages | Deployment |

## 08. Future Scope

- UPI payment integration
- Automatic Number Plate Recognition
- Multi-lane toll management
- Mobile application
- Advanced traffic analytics

---

### TOLLÉRA
**SMARTER TOLLING. SEAMLESS MOVEMENT.**

*An academic engineering project.*
