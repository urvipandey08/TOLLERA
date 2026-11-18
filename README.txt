# TOLLÉRA

### RFID-Based Automated Toll Collection System

\<p align="center"> \<strong>SMARTER TOLLING. SEAMLESS MOVEMENT.\</strong> \</p>

\<p align="center"> An integrated Arduino, RFID and Firebase-based toll collection solution. \</p>

\<p align="center"> \<a href="[https://urvipandey08.github.io/TOLLERA/](https://urvipandey08.github.io/TOLLERA/)">🌐 Live Website\</a> • \<a href="[https://github.com/urvipandey08/TOLLERA](https://github.com/urvipandey08/TOLLERA)">GitHub Repository\</a> \</p>

---

## 01. Project Overview

**TOLLÉRA** automates vehicle identification and toll collection using RFID technology. It combines an Arduino-based hardware system with a Firebase-powered web application for vehicle and transaction management.

## 02. System Architecture

```mermaid
flowchart TD
    A[RFID Card / Tag] --> B[MFRC522 Reader]
    B --> C[Arduino Uno]
    C --> D[Toll Processing]
    D --> E[Servo Barrier]
    D --> F[LCD / LED / Buzzer]
    D --> G[Firebase]
    G --> H[Web Application]
```

## 03. Toll Collection Workflow

```mermaid
flowchart TD
    A([Vehicle Arrives]) --> B[Scan RFID]
    B --> C[Process RFID UID]
    C --> D{Registered?}
    D -->|No| E[Access Denied]
    D -->|Yes| F{Sufficient Balance?}
    F -->|No| E
    F -->|Yes| G[Calculate and Deduct Toll]
    G --> H[Update Vehicle Records]
    H --> I[Record Transaction]
    I --> J[Open Barrier]
    J --> K([Vehicle Passes])
    E --> L[Alert: LED / Buzzer]
```

## 04. Web Application Workflow

```mermaid
flowchart TD
    A[Login] --> B[Dashboard]
    B --> C[Live Operations]
    B --> D[Vehicle Management]
    B --> E[Transaction History]
    B --> F[Analytics]
    B --> G[Toll Rates]
    D --> H[Individual Vehicle Profiles]
```

## 05. Key Features

- RFID-based vehicle identification
- Automated toll deduction and balance tracking
- Servo-controlled barrier
- LCD display, LED and buzzer alerts
- Vehicle profiles and transaction history
- Live dashboard and analytics
- Search, filters and CSV export
- Login authentication
- Dark and light themes

## 06. Hardware Components

| Component          | Purpose                |
| ------------------ | ---------------------- |
| Arduino Uno        | Main controller        |
| MFRC522            | RFID scanning          |
| RFID Cards / Tags  | Vehicle identification |
| 16×2 LCD with I2C  | Status display         |
| Servo Motor        | Barrier control        |
| LED & Buzzer       | Alerts                 |
| Breadboard & Wires | Circuit connections    |

## 07. Technology Stack

| Technology              | Purpose              |
| ----------------------- | -------------------- |
| HTML, CSS, JavaScript   | Web application      |
| Firebase Authentication | Login                |
| Cloud Firestore         | Data management      |
| Arduino IDE             | Hardware programming |
| Git & GitHub            | Version control      |
| GitHub Pages            | Deployment           |

## 08. Future Scope

- UPI and digital payment integration
- Automatic Number Plate Recognition
- Multi-lane toll management
- Mobile application
- Advanced traffic analytics

## 09. Project Links

🌐 **Live Website:** [TOLLÉRA](https://urvipandey08.github.io/TOLLERA/)

💻 **Source Code:** [GitHub Repository](https://github.com/urvipandey08/TOLLERA)

---

\<p align="center">
\<strong>TOLLÉRA\</strong>\<br>
SMARTER TOLLING. SEAMLESS MOVEMENT.
\</p>

\<p align="center">
Developed as an academic engineering project.
\</p>
