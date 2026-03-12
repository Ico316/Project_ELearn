// Theme Management
(function() {
  const themeToggle = document.getElementById('themeToggle');
  const themeText = document.getElementById('themeText');
  
  // Check for saved theme
  const savedTheme = localStorage.getItem('nordic-theme');
  
  // Set initial theme
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    if (themeText) themeText.textContent = 'Dark';
  } else {
    document.body.classList.remove('dark-theme');
    if (themeText) themeText.textContent = 'Light';
    localStorage.setItem('nordic-theme', 'light');
  }

  // Theme toggle function
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      if (document.body.classList.contains('dark-theme')) {
        document.body.classList.remove('dark-theme');
        if (themeText) themeText.textContent = 'Light';
        localStorage.setItem('nordic-theme', 'light');
        showNotification('Switched to Light mode');
      } else {
        document.body.classList.add('dark-theme');
        if (themeText) themeText.textContent = 'Dark';
        localStorage.setItem('nordic-theme', 'dark');
        showNotification('Switched to Dark mode');
      }
    });
  }

  // Notification function (if not already defined)
  window.showNotification = function(message) {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = message;
    document.body.appendChild(notif);
    
    setTimeout(() => {
      notif.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notif.remove(), 300);
    }, 2500);
  };
})();