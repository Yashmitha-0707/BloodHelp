# BloodHelp – Blood Donor & Emergency Assistance Platform

BloodHelp is a web-based application designed to connect people who need blood with available blood donors. It helps users find donors based on blood group and location, register as donors, and create blood requests during emergencies.

The platform provides a simple way to make blood donation and emergency assistance more accessible.

## Features

### Donor Management
- Register as a blood donor.
- View the list of registered donors.
- Search and filter donors based on blood group.
- View donor availability and verification status.
- Contact donors through phone calls or WhatsApp.
- Edit and delete your own donor registration.
- Users can view all donors, but can manage only their own registrations.

### Blood Request Management
- Create blood requests during emergencies.
- View available blood requests.
- Edit and delete your own blood requests.
- Manage blood request details.

### User Authentication
- User registration and login.
- Secure authentication using Spring Security.
- Dashboard for logged-in users.
- User-specific donor management.
- CSRF protection for secure requests.

## Technologies Used

| Technology | Purpose |
|---|---|
| Next.js | Frontend development |
| React | User interface |
| TypeScript | Frontend programming |
| Java | Backend development |
| Spring Boot | REST API development |
| Spring Security | Authentication and security |
| Maven | Backend dependency management |
| HTML & CSS | Web page structure and styling |

## Project Structure

```text
BloodHelp/
│
├── frontend/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── donors/
│   │   ├── login/
│   │   ├── register/
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── src/
│   └── main/
│       └── java/
│           └── com/
│               └── bloodhelp/
│                   ├── BloodRequest.java
│                   ├── BloodRequestApiController.java
│                   ├── BloodRequestEditApiController.java
│                   ├── DonorApiController.java
│                   ├── DonorEditApiController.java
│                   ├── DonorResponse.java
│                   ├── DashboardApiController.java
│                   ├── SignupApiController.java
│                   ├── SecurityConfig.java
│                   └── ...
│
├── pom.xml
└── README.md
```

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

Install the following software:

- Java Development Kit (JDK)
- Maven
- Node.js and npm
- Visual Studio Code or another code editor

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate into the project folder:

```bash
cd bloodhelp
```

### 2. Configure the Backend

Configure your database and application settings in:

```text
src/main/resources/application.properties
```

Make sure your database is running and the configuration matches your local environment.

### 3. Run the Backend

From the main project folder, execute:

```bash
mvn spring-boot:run
```

The Spring Boot backend runs at:

```text
http://localhost:8080
```

### 4. Run the Frontend

Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install the required dependencies:

```bash
npm install
```

Start the Next.js development server:

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:3000
```
## Screenshotste

### Home Page
![Home Page](home.png)

### Login Page
![Login Page](login.png)



### Search List
![Donor List](donor.png)
)

### Dashboard
![Dashboard](dashboard.png)
## Application Architecture

BloodHelp follows a frontend-backend architecture:

- **Frontend:** Next.js and React provide the user interface.
- **Backend:** Spring Boot handles application logic and REST API requests.
- **Security:** Spring Security manages authentication and access control.
- **Database:** Stores donor information, blood requests, and user-related data.

The frontend communicates with the backend through HTTP requests.

## Future Enhancements

- Email or SMS notifications for emergency blood requests.
- Improved donor verification.
- Location-based donor discovery.
- Real-time emergency request notifications.
- Mobile application support.

## Purpose

The main objective of BloodHelp is to make finding blood donors easier and faster during emergencies. By connecting donors and people in need, the platform aims to encourage blood donation and support the community.

---

**Developed as a student project.**