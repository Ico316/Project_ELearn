// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const videoGrid = document.getElementById("videoGrid");
  const favoritesList = document.getElementById("favoritesList");

  let currentUser = "user123"; // In production, this would come from auth
  let allVideos = [];

  // Load videos from Firebase
  function loadVideos() {
    const videosRef = database.ref('videos');
    videosRef.on('value', (snapshot) => {
      const videos = snapshot.val();
      if (videos) {
        allVideos = Object.keys(videos).map(key => ({
          id: key,
          ...videos[key]
        }));
        renderVideos(allVideos);
      }
    });
  }

  // Render videos grid
  function renderVideos(videos) {
    videoGrid.innerHTML = videos.map(video => `
      <div class="video-card" data-id="${video.id}">
        <div class="video-thumbnail">
          <img src="${video.thumbnail || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400'}" alt="${video.title}">
          <div class="video-overlay">
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" stroke="#00ff88" stroke-width="2" fill="none"/>
              <polygon points="15,12 30,20 15,28" fill="#00ff88"/>
            </svg>
          </div>
          <span class="video-duration">${video.duration || '10:30'}</span>
        </div>
        <button class="favorite-btn" onclick="toggleFavorite('${video.id}')" data-id="${video.id}">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/>
          </svg>
        </button>
        <div class="video-info">
          <h4>${video.title}</h4>
          <div class="video-meta">
            <span>${video.views || 0} views</span>
            <span>${video.category || 'General'}</span>
          </div>
        </div>
      </div>
    `).join('');

    // Update favorite buttons state
    updateFavoriteButtons();
  }

  // Toggle favorite
  window.toggleFavorite = function(videoId) {
    const video = allVideos.find(v => v.id === videoId);
    if (!video) return;

    const favoritesRef = database.ref(`favorites/${currentUser}/${videoId}`);
    
    favoritesRef.once('value', (snapshot) => {
      if (snapshot.exists()) {
        // Remove from favorites
        favoritesRef.remove();
        showNotification('Removed from favorites', 'info');
      } else {
        // Add to favorites
        favoritesRef.set({
          id: videoId,
          title: video.title,
          thumbnail: video.thumbnail,
          addedAt: Date.now()
        });
        showNotification('Added to favorites!', 'success');
      }
      updateFavoriteButtons();
      loadFavorites();
    });
  };

  // Update favorite buttons state
  function updateFavoriteButtons() {
    const favoritesRef = database.ref(`favorites/${currentUser}`);
    favoritesRef.once('value', (snapshot) => {
      const favorites = snapshot.val() || {};
      document.querySelectorAll('.favorite-btn').forEach(btn => {
        const videoId = btn.dataset.id;
        if (favorites[videoId]) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    });
  }

  // Load favorites
  function loadFavorites() {
    const favoritesRef = database.ref(`favorites/${currentUser}`);
    favoritesRef.on('value', (snapshot) => {
      const favorites = snapshot.val();
      if (favorites) {
        const favoritesArray = Object.keys(favorites).map(key => favorites[key]);
        renderFavorites(favoritesArray);
      } else {
        favoritesList.innerHTML = '<div class="empty-favorites">No favorites yet</div>';
      }
    });
  }

  // Render favorites
  function renderFavorites(favorites) {
    if (favorites.length === 0) {
      favoritesList.innerHTML = '<div class="empty-favorites">No favorites yet</div>';
      return;
    }

    favoritesList.innerHTML = favorites.map(fav => `
      <div class="favorite-item" onclick="playVideo('${fav.id}')">
        <img src="${fav.thumbnail || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=100'}" alt="${fav.title}">
        <div class="favorite-item-info">
          <h5>${fav.title}</h5>
          <p>Added ${new Date(fav.addedAt).toLocaleDateString()}</p>
        </div>
        <button class="remove-favorite" onclick="event.stopPropagation(); toggleFavorite('${fav.id}')">×</button>
      </div>
    `).join('');
  }

  // Play video
  window.playVideo = function(videoId) {
    const video = allVideos.find(v => v.id === videoId);
    if (video) {
      // Increment views in database
      database.ref(`videos/${videoId}/views`).transaction((views) => (views || 0) + 1);
      
      // Open video player modal (simplified for demo)
      alert(`Now playing: ${video.title}\nVideo URL: ${video.videoUrl || 'Sample video content'}`);
    }
  };

  // Real-time search
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    
    if (!query) {
      searchResults.classList.remove("show");
      return;
    }

    // Search in Firebase
    const videosRef = database.ref('videos');
    videosRef.orderByChild('title').startAt(query).endAt(query + '\uf8ff').once('value', (snapshot) => {
      const videos = snapshot.val();
      let results = [];
      
      if (videos) {
        results = Object.keys(videos).map(key => ({
          id: key,
          ...videos[key]
        }));
      }

      searchResults.innerHTML = "";
      
      if (results.length > 0) {
        results.slice(0, 5).forEach(video => {
          const li = document.createElement("li");
          li.innerHTML = `
            <strong>${highlightText(video.title, query)}</strong>
            <br>
            <small>${highlightText(video.category || '', query)}</small>
          `;
          li.onclick = () => playVideo(video.id);
          searchResults.appendChild(li);
        });
        searchResults.classList.add("show");
      } else {
        searchResults.innerHTML = '<li style="color: #a0a0ff;">No results found</li>';
        searchResults.classList.add("show");
      }
    });
  });

  // Helper: Highlight matching text
  function highlightText(text, query) {
    if (!text) return '';
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }

  // Notification system
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 25px;
      background: ${type === 'success' ? '#00ff88' : '#00aaff'};
      color: #0a0a1a;
      border-radius: 10px;
      font-weight: 600;
      z-index: 2000;
      animation: slideIn 0.3s ease;
      box-shadow: 0 5px 20px rgba(0, 255, 136, 0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Add CSS animations for notifications
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // Submit form
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      // Search in database
      const videosRef = database.ref('videos');
      videosRef.orderByChild('title').startAt(query).endAt(query + '\uf8ff').once('value', (snapshot) => {
        const videos = snapshot.val();
        if (videos) {
          const results = Object.keys(videos).map(key => videos[key]);
          renderVideos(results);
          searchResults.classList.remove("show");
        }
      });
    }
  });

  // Initialize
  function initializeSampleData() {
    // Check if videos exist
    database.ref('videos').once('value', (snapshot) => {
      if (!snapshot.exists()) {
        // Add sample videos
        const sampleVideos = [
          {
            title: "Introduction to Quantum Computing",
            category: "Physics",
            thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
            duration: "15:30",
            views: 1234,
            videoUrl: "#"
          },
          {
            title: "Advanced JavaScript Patterns",
            category: "Programming",
            thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400",
            duration: "22:15",
            views: 2345,
            videoUrl: "#"
          },
          {
            title: "Machine Learning Fundamentals",
            category: "AI",
            thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400",
            duration: "18:45",
            views: 3456,
            videoUrl: "#"
          },
          {
            title: "Neural Networks Explained",
            category: "AI",
            thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400",
            duration: "25:20",
            views: 4567,
            videoUrl: "#"
          }
        ];

        sampleVideos.forEach(video => {
          database.ref('videos').push(video);
        });
      }
    });
  }

  // Start everything
  initializeSampleData();
  loadVideos();
  loadFavorites();
});