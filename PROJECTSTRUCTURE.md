# Trello Clone — Project Structure

```text
trello-clone/
│
├── frontend/                          # Frontend (React)
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/                  # Images, icons, fonts
│   │   │
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Button.jsx
│   │   │
│   │   ├── pages/                   # Complete pages
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Board.jsx
│   │   │
│   │   ├── services/                # API calls to backend
│   │   │   └── api.js
│   │   │
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── context/                 # Shared application state
│   │   ├── utils/                   # Helper functions
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   └── package.json
│
├── backend/                          # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/                  # Database and app configuration
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/             # Business logic for requests
│   │   │   ├── authController.js
│   │   │   └── boardController.js
│   │   │
│   │   ├── models/                  # Database models or queries
│   │   │   ├── User.js
│   │   │   ├── Board.js
│   │   │   └── Task.js
│   │   │
│   │   ├── routes/                  # API endpoints
│   │   │   ├── authRoutes.js
│   │   │   └── boardRoutes.js
│   │   │
│   │   ├── middleware/              # Authentication, validation, errors
│   │   ├── services/                # Reusable business services
│   │   ├── utils/                   # Helper functions
│   │   │
│   │   └── app.js                   # Express application setup
│   │
│   ├── .env
│   ├── package.json
│   └── server.js                    # Starts the backend server
│
├── .gitignore
├── README.md
└── package.json                     # Optional root scripts
```


```text
Use index.css or style.css for common shared css and each component css, create folder with component name and keep its .jsx and .css inside it.

If you import App.css or index.css, their regular CSS styles are generally available throughout your application, regardless of which component you import them into. index.css have globally effect because, it gets imported in main.jsx which is root Component of react project.

```