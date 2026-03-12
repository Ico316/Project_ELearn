// Course Page Functionality
(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('id');
  const courseHeader = document.getElementById('courseHeader');
  const mainVideo = document.getElementById('mainVideo');
  const currentVideoTitle = document.getElementById('currentVideoTitle');
  const currentVideoDescription = document.getElementById('currentVideoDescription');
  const playlistVideos = document.getElementById('playlistVideos');
  const courseInfo = document.getElementById('courseInfo');

  let currentVideo = null;
  let courseData = null;

  // Load course data
  if (courseId) {
    loadCourseData(courseId);
  }

  function loadCourseData(id) {
    database.ref(`videos/${id}`).once('value', (snapshot) => {
      const video = snapshot.val();
      if (video) {
        courseData = { id, ...video };
        renderCourseHeader(courseData);
        renderPlaylist(courseData);
        renderCourseInfo(courseData);
        
        // Load first video in playlist
        if (courseData.playlist && courseData.playlist.length > 0) {
          loadVideo(courseData.playlist[0]);
        }
      }
    });
  }

  function renderCourseHeader(video) {
    if (!courseHeader) return;

    courseHeader.innerHTML = `
      <div class="course-header-image">
        <img src="${video.thumbnail || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400'}" alt="${video.title}">
      </div>
      <div class="course-header-info">
        <h1>${video.title}</h1>
        <p>${video.description || 'A comprehensive course designed for parents'}</p>
        <div class="course-stats">
          <span>📚 ${video.playlist?.length || '12'} lessons</span>
          <span>⏱️ ${video.totalHours || '4.5'} hours</span>
          <span>👥 ${video.views || 0} enrolled</span>
        </div>
      </div>
    `;
  }

  function renderPlaylist(video) {
    if (!playlistVideos) return;

    const playlist = video.playlist || generateSamplePlaylist(video);
    
    playlistVideos.innerHTML = playlist.map((item, index) => `
      <div class="playlist-item ${index === 0 ? 'active' : ''}" onclick="loadVideo(${JSON.stringify(item).replace(/"/g, '&quot;')})" data-id="${item.id || index}">
        <div class="playlist-thumbnail">
          <img src="${item.thumbnail || video.thumbnail}" alt="${item.title}">
          <span class="playlist-duration">${item.duration || '10:30'}</span>
        </div>
        <div class="playlist-info">
          <h4>${index + 1}. ${item.title}</h4>
          <p>${item.description || 'Lesson preview'}</p>
        </div>
      </div>
    `).join('');
  }

  function renderCourseInfo(video) {
    if (!courseInfo) return;

    courseInfo.innerHTML = `
      <h2>About This Course</h2>
      <div class="course-description">
        <p>${video.description || 'This course is designed to help parents navigate the beautiful journey of raising children while maintaining their own well-being and personal growth.'}</p>
        <p>Through a combination of expert insights, practical exercises, and community support, you'll develop the skills and confidence to thrive in your parenting journey.</p>
      </div>
      <div class="course-details">
        <div class="detail-item">
          <span class="detail-icon">📚</span>
          <div class="detail-text">
            <h4>Lessons</h4>
            <p>${video.playlist?.length || '12'} videos</p>
          </div>
        </div>
        <div class="detail-item">
          <span class="detail-icon">⏱️</span>
          <div class="detail-text">
            <h4>Total Duration</h4>
            <p>${video.totalHours || '4.5'} hours</p>
          </div>
        </div>
        <div class="detail-item">
          <span class="detail-icon">🎯</span>
          <div class="detail-text">
            <h4>Level</h4>
            <p>${video.level || 'All Levels'}</p>
          </div>
        </div>
        <div class="detail-item">
          <span class="detail-icon">👥</span>
          <div class="detail-text">
            <h4>Students</h4>
            <p>${video.views || 1234}</p>
          </div>
        </div>
      </div>
    `;
  }

  // Load video into player
  window.loadVideo = function(video) {
    if (!mainVideo || !currentVideoTitle || !currentVideoDescription) return;

    // Update active state in playlist
    document.querySelectorAll('.playlist-item').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.id === video.id) {
        item.classList.add('active');
      }
    });

    // Update video player
    mainVideo.innerHTML = `
      <div class="video-placeholder">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="38" stroke="currentColor" stroke-width="2" fill="none"/>
          <polygon points="30,20 60,40 30,60" fill="currentColor"/>
        </svg>
        <p style="margin-left: 20px;">${video.title} - Preview</p>
      </div>
    `;

    currentVideoTitle.textContent = video.title;
    currentVideoDescription.textContent = video.description || 'This video covers essential concepts and practical techniques.';
  };

  // Generate sample playlist for demo
  function generateSamplePlaylist(video) {
    return [
      {
        id: '1',
        title: 'Introduction to ' + video.title,
        duration: '5:30',
        thumbnail: video.thumbnail
      },
      {
        id: '2',
        title: 'Key Principles and Concepts',
        duration: '12:15',
        thumbnail: video.thumbnail
      },
      {
        id: '3',
        title: 'Practical Applications',
        duration: '18:20',
        thumbnail: video.thumbnail
      },
      {
        id: '4',
        title: 'Real-Life Examples',
        duration: '15:45',
        thumbnail: video.thumbnail
      },
      {
        id: '5',
        title: 'Q&A Session',
        duration: '22:10',
        thumbnail: video.thumbnail
      }
    ];
  }
})();