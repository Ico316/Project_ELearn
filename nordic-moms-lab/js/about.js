// About Page Functionality
(function() {
  const teamGrid = document.getElementById('teamGrid');
  const galleryGrid = document.getElementById('galleryGrid');

  // Team data
  const teamMembers = [
    {
      name: "Anna Svensson",
      role: "Co-Founder & Child Psychologist",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
      bio: "Mother of two, passionate about mindful parenting"
    },
    {
      name: "Maria Larsen",
      role: "Co-Founder & Parenting Coach",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      bio: "Mother of three, specializing in work-life balance"
    },
    {
      name: "Karin Johansen",
      role: "Community Director",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
      bio: "Mother of one, building our village community"
    },
    {
      name: "Emma Nielsen",
      role: "Content Creator & Educator",
      image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400",
      bio: "Mother of twins, creating engaging learning content"
    }
  ];

  // Gallery images
  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600",
      caption: "Community meetup in Copenhagen"
    },
    {
      url: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600",
      caption: "Playdate at the park"
    },
    {
      url: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=600",
      caption: "Parenting workshop"
    },
    {
      url: "https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=600",
      caption: "Coffee and connect morning"
    },
    {
      url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600",
      caption: "Children's yoga session"
    },
    {
      url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600",
      caption: "Mindfulness for moms"
    }
  ];

  // Render team grid
  if (teamGrid) {
    teamGrid.innerHTML = teamMembers.map(member => `
      <div class="team-member">
        <img src="${member.image}" alt="${member.name}">
        <h3>${member.name}</h3>
        <p>${member.role}</p>
        <p style="margin-top: 10px; font-size: 14px;">${member.bio}</p>
      </div>
    `).join('');
  }

  // Render gallery grid
  if (galleryGrid) {
    galleryGrid.innerHTML = galleryImages.map(image => `
      <div class="gallery-item" onclick="openGalleryImage('${image.url}')">
        <img src="${image.url}" alt="${image.caption}">
        <div class="gallery-overlay">
          <p>${image.caption}</p>
        </div>
      </div>
    `).join('');
  }

  // Open gallery image (could be enhanced with lightbox)
  window.openGalleryImage = function(url) {
    window.open(url, '_blank');
  };
})();