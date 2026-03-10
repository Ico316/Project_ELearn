document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  // Sample data to search (could be fetched from a backend or API)
  const searchData = [
    { title: "Advanced JavaScript Concepts", description: "Learn closures, prototypes, and async patterns." },
    { title: "Responsive Web Design", description: "Build layouts that work on all devices." },
    { title: "CSS Grid & Flexbox", description: "Master modern layout techniques." },
    { title: "React Hooks Guide", description: "Use useState, useEffect, and custom hooks effectively." },
    { title: "Node.js Backend Development", description: "Build scalable server-side applications." },
    { title: "TypeScript for Beginners", description: "Add type safety to your JavaScript projects." },
    { title: "Accessibility in Web Design", description: "Ensure your site is usable by everyone." },
    { title: "SEO Best Practices", description: "Improve your site's visibility in search engines." }
  ];

  // Real-time search function
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      searchResults.classList.remove("show");
      return;
    }

    searchResults.innerHTML = "";
    let found = false;

    searchData.forEach(item => {
      const titleMatch = item.title.toLowerCase().includes(query);
      const descMatch = item.description.toLowerCase().includes(query);

      if (titleMatch || descMatch) {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${highlightText(item.title, query)}</strong>
          <br>
          ${highlightText(item.description, query)}
        `;
        searchResults.appendChild(li);
        found = true;
      }
    });

    searchResults.classList.toggle("show", found);
  });

  // Submit form (optional: redirect or filter)
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      alert(`Searching for: "${query}"`);
      // You could redirect to a results page or fetch via API
    }
  });

  // Helper: Highlight matching text
  function highlightText(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }
});   