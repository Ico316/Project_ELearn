// Search Functionality
(function() {
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const searchForm = document.getElementById('searchForm');

  if (!searchInput || !searchResults || !searchForm) return;

  // Search input handler
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    
    if (!query) {
      searchResults.classList.remove('show');
      return;
    }

    // Search in Firebase
    database.ref('videos').orderByChild('title').startAt(query).endAt(query + '\uf8ff').once('value', (snapshot) => {
      const videos = snapshot.val();
      let results = [];
      
      if (videos) {
        results = Object.keys(videos).map(key => ({
          id: key,
          ...videos[key]
        }));
      }

      displaySearchResults(results, query);
    });
  });

  // Display search results
  function displaySearchResults(results, query) {
    searchResults.innerHTML = '';
    
    if (results.length > 0) {
      results.slice(0, 5).forEach(video => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${highlightText(video.title, query)}</strong>
          <br>
          <small>${highlightText(video.category || '', query)}</small>
        `;
        li.onclick = () => {
          window.location.href = `course.html?id=${video.id}`;
        };
        searchResults.appendChild(li);
      });
      searchResults.classList.add('show');
    } else {
      searchResults.innerHTML = '<li style="color: var(--text-secondary);">No results found</li>';
      searchResults.classList.add('show');
    }
  }

  // Highlight matching text
  function highlightText(text, query) {
    if (!text) return '';
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }

  // Search form submit
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;
    
    database.ref('videos').orderByChild('title').startAt(query).endAt(query + '\uf8ff').once('value', (snapshot) => {
      const videos = snapshot.val();
      if (videos) {
        const results = Object.keys(videos).map(key => ({
          id: key,
          ...videos[key]
        }));
        
        // Redirect to course page or display results
        if (results.length > 0) {
          window.location.href = `course.html?id=${results[0].id}`;
        }
      }
      searchResults.classList.remove('show');
    });
  });

  // Close search results when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchResults.contains(e.target) && e.target !== searchInput) {
      searchResults.classList.remove('show');
    }
  });
})();