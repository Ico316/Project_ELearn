# Nordic Moms Lab

A community platform built by moms, for parents, where children are always welcome and your journey matters.

## Project Structure

Project_ELearn/
│    nordic-moms-lab/
│    │
│    ├── index.html # Home page
│    ├── about.html # About us page
│   ├── course.html # Course playlist page
│   │
│   ├── css/
│   │ ├── style.css # Main styles
│   │ ├── about.css # About page styles
│   │ └── course.css # Course page styles
│   │
│   ├── js/
│   │ ├── main.js # Home page functionality
│   │ ├── about.js # About page functionality
│   │ ├── course.js # Course page functionality
│   │ ├── firebase-config.js # Firebase configuration
│   │ ├── theme.js # Theme switching
│   │ ├── search.js # Search functionality
│   │ └── favorites.js # Favorites management
│   │
│   ├── assets/
│   │ └── logo.svg # Site logo
│   │
│   └── README.md


## Features

- ✅ **Theme Switching** - Toggle between light and dark modes
- ✅ **Search Functionality** - Real-time course search with highlighting
- ✅ **Favorites System** - Save and manage favorite courses
- ✅ **Course Playlists** - Structured video lessons
- ✅ **About Page** - Team information and gallery
- ✅ **Responsive Design** - Works on all devices
- ✅ **Firebase Integration** - Real-time database

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ico316/Project_ELearn.git
   cd nordic-moms-lab
2. **Configure Firebase**
    Create a Firebase project at https://console.firebase.google.com
    Enable Realtime Database
    Copy your config to js/firebase-config.js

3. **Open in VS Code**
   code .

4. **Run with Live Server**
    Install "Live Server" extension
    Right-click index.html → "Open with Live Server"

**Firebase Database Rules**
    {
    "rules": {
        "videos": {
        ".read": true,
        ".write": true
        },
        "favorites": {
        "$user_id": {
            ".read": "$user_id === auth.uid",
            ".write": "$user_id === auth.uid"
        }
        }
    }
    }

**Color Palette**
    Primary Pink: #E6A4B4 - Warm, welcoming accent
    Secondary Sage: #B5D1C9 - Calming, natural tone
    Background Cream: #FAF7F2 - Soft, friendly base
    Text Dark: #4A4A4A - Readable, warm gray
    Text Light: #6B6B6B - Softer contrast

**Contributing**
    Fork the repository
    Create your feature branch (git checkout -b feature/AmazingFeature)
    Commit your changes (git commit -m 'Add some AmazingFeature')
    Push to the branch (git push origin feature/AmazingFeature)
    Open a Pull Request

**License**
    This project is licensed under the MIT License.

**Contact**
    Nordic Moms Lab - hello@nordicmomslab.com


## How to Use

1. **Create the folder structure** exactly as shown above in VS Code
2. **Copy each code block** into its respective file
3. **Update Firebase config** in `js/firebase-config.js` with your actual Firebase credentials
4. **Run with Live Server** - right-click `index.html` and select "Open with Live Server"

All buttons and functionality now work:

- **Home/About navigation** - Switches between pages
- **Theme toggle** - Smoothly transitions between light/dark
- **Search bar** - Real-time search with results dropdown
- **Magnifier button** - Submits search and redirects to first result
- **Course cards** - Click to go to course playlist
- **Favorites** - Add/remove with visual feedback
- **Play buttons** - Open course pages
- **About page gallery** - Click images to view full size