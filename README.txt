# TOLLÉRA
### RFID-Based Automated Toll Collection System

**SMARTER TOLLING. SEAMLESS MOVEMENT.**

TOLLÉRA is an automated toll collection project that combines RFID technology, Arduino hardware and a Firebase-powered web application to simplify vehicle identification and toll management.

---

## 1. Project Overview

The project consists of two main parts:

- **Hardware:** RFID-based vehicle identification and automated toll barrier control.
- **Software:** A web-based platform for managing vehicles, toll transactions and collection records.

## 2. Hardware Components

| Component | Function |
|---|---|
| Arduino Uno | Main controller |
| MFRC522 RFID Reader | Reads RFID card/tag IDs |
| RFID Cards / Tags | Vehicle identification |
| 16×2 LCD with I2C | Displays system messages |
| Servo Motor | Controls the toll barrier |
| LED | Visual status indication |
| Buzzer | Audio alerts |
| Breadboard & Jumper Wires | Circuit connections |

## 3. Software & Technologies

| Technology | Purpose |
|---|---|
| HTML | Web page structure |
| CSS | Interface design |
| JavaScript | Application functionality |
| Firebase Authentication | User login |
| Cloud Firestore | Vehicle and transaction data |
| Arduino IDE | Arduino programming |
| Git & GitHub | Version control |
| GitHub Pages | Website hosting |

## 4. Working of the System

### Hardware Working

1. A vehicle arrives at the toll point.
2. The driver scans the RFID card or tag.
3. The MFRC522 reader captures its unique ID.
4. Arduino processes the scanned ID.
5. The system checks the vehicle's registration and applicable toll conditions.
6. The LCD displays the status.
7. The LED and buzzer provide alerts when required.
8. The servo motor operates the toll barrier when access is granted.

### Software Working

1. The administrator logs into the TOLLÉRA web application.
2. The dashboard displays toll collection information.
3. Registered vehicles can be viewed and managed.
4. Individual vehicle profiles show pass counts and deducted amounts.
5. Transaction history provides details of toll activity.
6. Analytics presents collection-related insights.
7. Records can be searched, filtered and exported as CSV files.

## 5. Application Modules

| Module | Description |
|---|---|
| Dashboard | Overview of toll operations |
| Vehicle Management | Registered vehicle records |
| Vehicle Profiles | Individual vehicle details |
| Transactions | Toll transaction history |
| Analytics | Collection statistics |
| Toll Rates | Toll rate management |
| Authentication | Secure login interface |

## 6. System Workflow

**Vehicle Identification**

RFID Card → RFID Reader → Arduino → Vehicle Verification → Status Display → Barrier Control

**Web Application**

Login → Dashboard → Vehicle Management → Transaction History → Analytics

## 7. Future Scope

- UPI and digital payment integration
- Automatic Number Plate Recognition (ANPR)
- Multi-lane toll management
- Mobile application
- Advanced traffic monitoring

## 8. Project Links

- **Live Website:** https://urvipandey08.github.io/TOLLERA/
- **GitHub Repository:** https://github.com/urvipandey08/TOLLERA

---

**TOLLÉRA — SMARTER TOLLING. SEAMLESS MOVEMENT.**
