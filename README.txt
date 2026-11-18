# TOLLÉRA

### RFID-Based Automated Toll Collection System

\<p align="center">
&#x20; \<strong>SMARTER TOLLING. SEAMLESS MOVEMENT.\</strong>
\</p>

\<p align="center">
&#x20; An integrated hardware and software solution designed to automate vehicle identification, toll deduction, and transaction management using RFID technology.
\</p>

\<p align="center">
&#x20; \<a href="[https://urvipandey08.github.io/TOLLERA/](https://urvipandey08.github.io/TOLLERA/)">🌐 Live Website\</a> •
&#x20; \<a href="#system-workflow">System Workflow\</a> •
&#x20; \<a href="#technology-stack">Technology Stack\</a>
\</p>

---

## 01. Project Overview

**TOLLÉRA** is an RFID-based Automated Toll Collection System developed to simplify and automate conventional toll collection operations.

The project combines an Arduino-based hardware setup with a Firebase-powered web application to enable RFID-based vehicle identification, automated toll processing, balance management, and digital transaction monitoring.

When a vehicle approaches the toll collection point, its registered RFID tag is scanned by the reader. The system verifies the vehicle, processes the applicable toll deduction, and provides feedback through the hardware interface. The associated transaction information is managed through the web-based platform.

TOLLÉRA aims to reduce manual intervention, improve transaction transparency, and demonstrate how embedded systems and web technologies can work together to create a smarter toll collection solution.

## 02. Key Features

### Hardware Features

- RFID-based vehicle identification.
- Arduino-controlled toll processing.
- Automated barrier mechanism using a servo motor.
- LCD-based system feedback.
- LED and buzzer-based status indication.
- Support for RFID-based vehicle verification.

### Software Features

The TOLLÉRA web application provides a centralized interface for monitoring and managing toll collection operations.

| Module              | Functionality                                                                           |
| ------------------- | --------------------------------------------------------------------------------------- |
| Authentication      | Secure login and access to the management interface                                     |
| Live Operations     | Overview of toll revenue, successful crossings, registered vehicles, and rejected scans |
| Vehicle Management  | View registered vehicles and their associated information                               |
| Vehicle Profiles    | Access individual vehicle details, toll pass count, and deducted amount                 |
| Transaction History | View recorded transactions with vehicle, RFID, toll, status, and balance information    |
| Analytics           | Visual insights into toll collection activity                                           |
| Toll Rates          | Dedicated interface for toll rate management                                            |
| Search & Filters    | Find transactions using vehicle registration or RFID ID and filter by status            |
| CSV Export          | Export transaction records for external analysis                                        |
| Theme Customization | Switch between dark and light interface themes                                          |

**Explore the application:**

[https://urvipandey08.github.io/TOLLERA/](https://urvipandey08.github.io/TOLLERA/)

## 03. System Architecture

TOLLÉRA consists of two interconnected components:

**A. Hardware Layer**

Responsible for RFID scanning, vehicle identification input, physical feedback, and barrier control.

**B. Software Layer**

Responsible for authentication, vehicle records, toll transaction management, balance tracking, analytics, and operational monitoring.

The hardware and software components work together to provide an integrated toll collection workflow.

## 04. System Workflow

The following flowchart illustrates the overall operation of TOLLÉRA, from vehicle arrival to transaction recording.

```mermaid
flowchart TD
    A([Vehicle Arrives at Toll Point]) --> B[RFID Tag Scanned]
    B --> C[Arduino Processes RFID UID]
    C --> D{Vehicle Registered?}

    D -->|No| E[Access Denied]
    E --> F[Red LED / Buzzer Alert]
    F --> G[Transaction Rejection Recorded]

    D -->|Yes| H[Retrieve Vehicle Information]
    H --> I{Sufficient Balance?}

    I -->|No| E
    I -->|Yes| J[Calculate Applicable Toll]
    J --> K[Deduct Toll Amount]
    K --> L[Update Vehicle Balance]
    L --> M[Record Transaction]
    M --> N[Update Firebase Records]
    N --> O[Display Status on LCD]
    O --> P[Servo Opens Barrier]
    P --> Q([Vehicle Passes])

    G --> R[Web Dashboard]
    N --> R
    R --> S[Transaction History]
    R --> T[Vehicle Profiles]
    R --> U[Analytics and Reports]
```

## 05. Hardware Components

| Component             | Purpose                                           |
| --------------------- | ------------------------------------------------- |
| Arduino Uno           | Main microcontroller for hardware operations      |
| RFID Reader (MFRC522) | Reads RFID card and tag information               |
| RFID Cards / Tags     | Provide unique identification for vehicles        |
| 16×2 LCD with I2C     | Displays system messages and transaction feedback |
| Servo Motor           | Controls the toll barrier mechanism               |
| LED                   | Provides visual status indication                 |
| Buzzer                | Provides audible alerts                           |
| Breadboard            | Supports circuit connections                      |
| Jumper Wires          | Establish electrical connections                  |
| USB Cable             | Provides programming and power connectivity       |

## 06. Software & Technologies

| Technology              | Application                                  |
| ----------------------- | -------------------------------------------- |
| HTML5                   | Web application structure                    |
| CSS3                    | Interface styling and responsive layouts     |
| JavaScript              | Frontend functionality and application logic |
| Firebase Authentication | User authentication                          |
| Cloud Firestore         | Vehicle and transaction data management      |
| Git & GitHub            | Version control and project hosting          |
| GitHub Pages            | Web application deployment                   |
| Arduino IDE             | Microcontroller programming                  |

## 07. Web Application

The TOLLÉRA web platform is designed as an operational management interface rather than a basic static website.

Its major sections include:

**Live Operations**

- Toll collection overview.
- Revenue and crossing statistics.
- Recent transaction records.
- Transaction search and filtering.
- CSV export.

**Vehicle Management**

- Registered vehicle information.
- Individual vehicle profiles.
- Toll pass counts and deduction history.

**Analytics**

- Visual representation of collection activity.
- Transaction and operational insights.

**Toll Rates**

- Dedicated interface for managing applicable toll rates.

**Authentication**

- Login-based access to the management platform.

## 08. Project Objectives

- Automate conventional toll collection procedures.
- Minimize manual vehicle identification and payment processing.
- Demonstrate practical RFID and microcontroller integration.
- Maintain digital records of toll transactions.
- Enable centralized vehicle and balance management.
- Provide an accessible interface for monitoring toll operations.

## 09. Future Scope

- Integration with UPI and other digital payment methods.
- Automatic number plate recognition (ANPR).
- Cloud-based multi-lane toll management.
- Advanced traffic monitoring and reporting.
- Mobile application for vehicle owners.
- Enhanced operational analytics and notifications.

## 10. Project Demonstration

**Live Web Application:**

[https://urvipandey08.github.io/TOLLERA/](https://urvipandey08.github.io/TOLLERA/)

The deployed application demonstrates the software interface and its operational management modules.

Hardware demonstrations can be included here to showcase the physical RFID scanning, vehicle verification, and automated barrier mechanism.

## 11. Repository Structure

```text
TOLLERA/
│
├── index.html
├── login.html
├── analytics.html
├── vehicles.html
├── vehicle-profile.html
├── rates.html
│
├── css/
│   └── styles.css
│
├── js/
│   ├── app.js
│   ├── firebase.js
│   ├── auth-ui.js
│   ├── auth-guard.js
│   ├── dashboard-firestore.js
│   ├── analytics-firestore.js
│   ├── vehicles-firestore.js
│   ├── vehicle-profile-firestore.js
│   └── rates-firestore.js
│
├── hardware/
│   └── Arduino_Code/
│
├── documentation/
│
├── screenshots/
│
└── README.md
```

*Note: The hardware, documentation, and screenshots folders are intended for organising the corresponding project files.*

## 12. Conclusion

TOLLÉRA demonstrates the practical integration of embedded systems, RFID technology, and cloud-based web development to create an automated toll collection solution.

By combining physical vehicle identification with digital transaction management, the project presents a scalable foundation for smarter and more efficient toll operations.

---

\<p align="center">   \<strong>TOLLÉRA\</strong>\<br>   SMARTER TOLLING. SEAMLESS MOVEMENT. \</p>

\<p align="center">   Developed as an academic engineering project. \</p>
