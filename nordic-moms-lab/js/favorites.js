// Favorites Management
(function() {
  const currentUser = "user123"; // In production, this would come from auth
  let allVideos = [];

  // Load favorites
  window.loadFavorites = function() {
    const favoritesList = document.getElementById('favoritesList');
    if (!favoritesList) return;

    database.ref(`favorites/${currentUser}`).on('value', (snapshot) => {
      const favorites = snapshot.val();
      if (favorites) {
        const items = Object.keys(favorites).map(key => favorites[key]);
        renderFavorites(items);
      } else {
        favoritesList.innerHTML = '<div class="empty-favorites">No favorites yet</div>';
      }
    });
  };

  // Render favorites
  function renderFavorites(favorites) {
    const favoritesList = document.getElementById('favoritesList');
    if (!favoritesList) return;

    if (!favorites.length) {
      favoritesList.innerHTML = '<div class="empty-favorites">No favorites yet</div>';
      return;
    }

    favoritesList.innerHTML = favorites.map(fav => `
      <div class="favorite-item" onclick="window.location.href='course.html?id=${fav.id}'">
        <img src="${fav.thumbnail || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=100'}" alt="${fav.title}">
        <div class="favorite-item-info">
          <h5>${fav.title}</h5>
          <p>${new Date(fav.addedAt).toLocaleDateString()}</p>
        </div>
        <button class="remove-favorite" onclick="event.stopPropagation(); window.toggleFavorite('${fav.id}')">×</button>
      </div>
    `).join('');
  }

  // Toggle favorite
  window.toggleFavorite = function(videoId) {
    if (!window.allVideos) return;

    const video = window.allVideos.find(v => v.id === videoId);
    if (!video) return;

    const favRef = database.ref(`favorites/${currentUser}/${videoId}`);
    favRef.once('value', (snap) => {
      if (snap.exists()) {
        favRef.remove();
        showNotification('Removed from favorites');
      } else {
        favRef.set({
          id: videoId,
          title: video.title,
          thumbnail: video.thumbnail,
          addedAt: Date.now()
        });
        showNotification('Added to favorites!');
      }
      updateFavoriteButtons();
      loadFavorites();
    });
  };

  // Update favorite buttons
  window.updateFavoriteButtons = function() {
    database.ref(`favorites/${currentUser}`).once('value', (snap) => {
      const favs = snap.val() || {};
      document.querySelectorAll('.favorite-btn').forEach(btn => {
        const vid = btn.dataset.id;
        btn.classList.toggle('active', !!favs[vid]);
      });
    });
  };

  // Initialize favorites
  if (document.getElementById('favoritesList')) {
    loadFavorites();
  }
})();