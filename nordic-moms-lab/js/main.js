// Main Page Functionality
(function() {
  const videoGrid = document.getElementById('videoGrid');
  const featuredCourse = document.getElementById('featuredCourse');
  window.allVideos = [];

  // Load videos from Firebase
  function loadVideos() {
    database.ref('videos').on('value', (snapshot) => {
      const videos = snapshot.val();
      if (videos) {
        window.allVideos = Object.keys(videos).map(key => ({ id: key, ...videos[key] }));
        renderVideos(window.allVideos);
        renderFeaturedCourse(window.allVideos[0]);
      } else {
        // Seed sample data if no videos exist
        seedSampleData();
      }
    });
  }

  // Render videos grid
  function renderVideos(videos) {
    if (!videoGrid) return;

    videoGrid.innerHTML = videos.map(video => `
      <div class="video-card" onclick="window.location.href='course.html?id=${video.id}'">
        <div class="video-thumbnail">
          <img src="${video.thumbnail || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400'}" alt="${video.title}">
          <div class="video-overlay">
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" stroke="currentColor" stroke-width="2" fill="none"/>
              <polygon points="15,12 30,20 15,28" fill="currentColor"/>
            </svg>
          </div>
          <span class="video-duration">${video.duration || '10:30'}</span>
        </div>
        <button class="favorite-btn" onclick="event.stopPropagation(); window.toggleFavorite('${video.id}')" data-id="${video.id}">
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

    window.updateFavoriteButtons();
  }

  // Render featured course
  function renderFeaturedCourse(video) {
    if (!featuredCourse || !video) return;

    featuredCourse.innerHTML = `
      <div class="course-thumbnail" onclick="window.location.href='course.html?id=${video.id}'">
        <img src="${video.thumbnail || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600'}" alt="${video.title}">
        <div class="play-button">
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="28" stroke="currentColor" stroke-width="2" fill="none"/>
            <polygon points="22,18 44,30 22,42" fill="currentColor"/>
          </svg>
        </div>
      </div>
      <div class="course-info" onclick="window.location.href='course.html?id=${video.id}'">
        <h3>${video.title}</h3>
        <p>${video.description || 'Explore this comprehensive course designed for parents'}</p>
        <div class="course-meta">
          <span>${video.videoCount || '12'} Videos</span>
          <span>${video.totalHours || '4.5'} hours</span>
          <span>${video.level || 'All Levels'}</span>
        </div>
      </div>
    `;
  }

  // Seed sample data
  function seedSampleData() {
    database.ref('videos').once('value', (snap) => {
      if (!snap.exists()) {
        const samples = [
          {
            title: "Mindful Parenting in a Busy World",
            category: "Parenting",
            description: "Practical techniques for staying present and connected with your children",
            thumbnail: "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=400",
            duration: "15:30",
            views: 1234,
            videoCount: "8",
            totalHours: "3.5",
            level: "All Levels"
          },
          {
            title: "Balancing Work and Family Life",
            category: "Work-Life Balance",
            thumbnail: "https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=400",
            duration: "22:15",
            views: 2345
          },
          {
            title: "Understanding Child Development",
            category: "Child Psychology",
            thumbnail: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400",
            duration: "18:45",
            views: 3456
          },
          {
            title: "Self-Care for Parents",
            category: "Wellness",
            thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400",
            duration: "25:20",
            views: 4567
          }
        ];

        samples.forEach(video => {
          database.ref('videos').push(video);
        });
      }
    });
  }

  // Initialize
  if (videoGrid) {
    loadVideos();
  }
})();