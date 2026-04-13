Create a file called `README.md` in your root `taskmanager` folder and paste this:

```markdown
# ⚡ TaskFlow - Smart Task Manager

A full-stack task management application built with Spring Boot and React, featuring Google OAuth2 authentication.

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.5-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![Gradle](https://img.shields.io/badge/Build-Gradle-02303A)

---

## 🚀 Features

- 🔐 Google OAuth2 Login
- ✅ Create / Complete / Delete Tasks
- 📅 Task history with created & deleted dates
- 🗂 Filter by All / In Progress / Completed / Deleted
- 📊 Dashboard with task statistics
- 🎨 Professional responsive UI

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Java 21 + Spring Boot 4.0.5 |
| Database | H2 In-Memory |
| Security | Spring Security + OAuth2 |
| Frontend | React 18 |
| Build Tool | Gradle |

---

## 📁 Project Structure

```
taskmanager/
├── backend/                          ← Spring Boot
│   ├── src/
│   │   └── main/
│   │       ├── java/com/taskmanager/taskmanager/
│   │       │   ├── config/
│   │       │   │   ├── CorsConfig.java
│   │       │   │   └── SecurityConfig.java
│   │       │   ├── controller/
│   │       │   │   └── TaskController.java
│   │       │   ├── model/
│   │       │   │   └── Task.java
│   │       │   ├── repository/
│   │       │   │   └── TaskRepository.java
│   │       │   └── service/
│   │       │       └── TaskService.java
│   │       └── resources/
│   │           └── application.yaml.example
│   └── build.gradle
└── frontend/                         ← React
    ├── src/
    │   ├── App.js
    │   └── App.css
    └── package.json
```

---

## ⚙️ Local Setup

### Prerequisites
- Java 21
- Node.js 18+
- Google OAuth2 credentials

### 1. Clone the repo
```bash
git clone https://github.com/AKvibhute/taskflow-.git
cd taskflow-
```

### 2. Backend Setup
```bash
cd backend
```

Copy the example config:
```bash
cp src/main/resources/application.yaml.example src/main/resources/application.yaml
```

Fill in your Google credentials in `application.yaml`:
```yaml
client-id: YOUR_GOOGLE_CLIENT_ID
client-secret: YOUR_GOOGLE_CLIENT_SECRET
```

Run the backend:
```bash
./gradlew bootRun
```

Backend runs on `http://localhost:8080`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

---

## 🔐 Google OAuth2 Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Go to **APIs & Services** → **Credentials**
4. Create **OAuth 2.0 Client ID** → Web Application
5. Add Authorized redirect URI:
```
http://localhost:8080/login/oauth2/code/google
```
6. Copy Client ID and Secret into `application.yaml`

---

## 📸 Screenshots

### Login Page
> <img width="1913" height="958" alt="image" src="https://github.com/user-attachments/assets/4be32ee2-eaab-4645-9278-19a90da0f2a5" />

### Dashboard and My Tasks
> <img width="1904" height="900" alt="image" src="https://github.com/user-attachments/assets/7b646ac9-2f98-4c37-8c24-86b7eceff199" />

> <img width="1857" height="843" alt="image" src="https://github.com/user-attachments/assets/0b70ac66-c211-40ae-9daf-8971b40edf44" />

<img width="1901" height="892" alt="image" src="https://github.com/user-attachments/assets/1231ce26-e8aa-4693-887c-b17d7d0f5927" />

### All Tasks
> <img width="1866" height="895" alt="image" src="https://github.com/user-attachments/assets/97ac1f25-24e4-410d-a2ac-7be7c5d40ee1" />


---

## 🔜 Roadmap

- [ ] Deploy to Google Cloud Run
- [ ] PostgreSQL database
- [ ] Task due dates and reminders
- [ ] Team collaboration features
- [ ] Mobile app

---

Save it then run:
```powershell
git add .
git commit -m "Add README"
git push
```
