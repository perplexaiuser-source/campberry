// Sunnyday V2 - Main Application
console.log('Sunnyday V2 loaded');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded');
  renderCategories();
  renderPrograms();
  renderFavorites();
  renderLists();
  setupSearch();
  setupModal();
  setupFavoritesNav();
  setupListCreation();
  setupAuth();
  updateAuthUI();
  
  // Global click handler for all cards
  document.addEventListener('click', (e) => {
    console.log('Clicked:', e.target);
    
    // Program card
    const card = e.target.closest('.program-card');
    if (card) {
      console.log('Program card clicked:', card.dataset.id);
      const id = parseInt(card.dataset.id);
      openModal(id);
      return;
    }
    
    // Category card (Browse by Interest)
    const catCard = e.target.closest('.category-card');
    if (catCard) {
      console.log('Category card clicked:', catCard.dataset.category);
      const category = catCard.dataset.category;
      filterByCategory(category);
      // Scroll to programs
      document.getElementById('programGrid').scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    // Hero tag (interest tag under search)
    const heroTag = e.target.closest('.hero-tags .tag');
    if (heroTag) {
      let tagName = heroTag.textContent.toLowerCase().trim();
      
      // Remove emoji prefix (e.g., "🍓 Summer" -> "summer")
      tagName = tagName.replace(/^[^\w\s]+/, '').trim();
      
      console.log('Hero tag clicked:', tagName);
      
      // First check if it's a category
      const categoryMap = {
        'summer': 'summer',
        'stem': 'stem',
        'business': 'business',
        'coding': 'coding',
        'writing': 'writing',
        'arts': 'arts',
        'free': 'free',
        'research': 'research',
        'sports': 'sports',
        'music': 'music'
      };
      
      const category = categoryMap[tagName];
      if (category) {
        filterByCategory(category);
        // Scroll to programs section
        document.getElementById('programGrid').scrollIntoView({ behavior: 'smooth' });
      } else {
        // Search by tag (e.g., "AI", "Robotics", "Machine Learning")
        searchByTag(tagName);
      }
      return;
    }
  });
});

// Search by tag
function searchByTag(tag) {
  const tagMap = {
    'ai': 'AI',
    'robotics': 'Robotics',
    'machine learning': 'Machine Learning',
    'computer science': 'CS',
    'coding': 'Coding',
    'programming': 'Coding',
    'software': 'Software',
    'engineering': 'Engineering',
    'math': 'Math',
    'science': 'Science',
    'business': 'Business',
    'writing': 'Writing',
    'music': 'Music',
    'art': 'Art',
    'sports': 'Sports',
    'research': 'Research',
    'free': 'Free',
    'summer': 'Summer',
    'stem': 'STEM',
    'tech': 'Tech',
    'design': 'Design'
  };
  
  const searchTag = tagMap[tag] || (tag.charAt(0).toUpperCase() + tag.slice(1));
  
  const filtered = programs.filter(p => 
    (p.tags && p.tags.some(t => t && t.toLowerCase().includes(tag))) ||
    (p.category && p.category === searchTag.toLowerCase()) ||
    (p.title && p.title.toLowerCase().includes(tag)) ||
    (p.description && p.description.toLowerCase().includes(tag))
  );
  
  renderPrograms(filtered);
  
  if (filtered.length === 0) {
    showNoResultsMessage();
  } else {
    scrollToPrograms();
  }
}

// Auth Setup
function setupAuth() {
  const authBtn = document.getElementById('authBtn');
  const authModal = document.getElementById('authModal');
  const authModalClose = document.getElementById('authModalClose');
  const showSignup = document.getElementById('showSignup');
  const showLogin = document.getElementById('showLogin');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const userDashboard = document.getElementById('userDashboard');
  const loginFormElement = document.getElementById('loginFormElement');
  const signupFormElement = document.getElementById('signupFormElement');
  const logoutBtn = document.getElementById('logoutBtn');
  
  // Open auth modal
  if (authBtn) {
    authBtn.addEventListener('click', () => {
      if (Auth.isLoggedIn()) {
        showUserDashboard();
      } else {
        showLoginForm();
      }
      authModal.classList.add('active');
    });
  }
  
  // Close auth modal
  if (authModalClose) {
    authModalClose.addEventListener('click', () => {
      authModal.classList.remove('active');
    });
  }
  
  // Close on overlay click
  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) {
        authModal.classList.remove('active');
      }
    });
  }
  
  // Switch to signup
  if (showSignup) {
    showSignup.addEventListener('click', (e) => {
      e.preventDefault();
      showSignupForm();
    });
  }
  
  // Switch to login
  if (showLogin) {
    showLogin.addEventListener('click', (e) => {
      e.preventDefault();
      showLoginForm();
    });
  }
  
  // Login form submit
  if (loginFormElement) {
    loginFormElement.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      
      const result = Auth.login(email, password);
      if (result.success) {
        authModal.classList.remove('active');
        updateAuthUI();
        renderFavorites();
        renderLists();
      } else {
        alert(result.message);
      }
    });
  }
  
  // Signup form submit
  if (signupFormElement) {
    signupFormElement.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('signupUsername').value;
      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;
      
      const result = Auth.register(username, email, password);
      if (result.success) {
        // Auto login after signup
        Auth.login(email, password);
        authModal.classList.remove('active');
        updateAuthUI();
        renderFavorites();
        renderLists();
      } else {
        alert(result.message);
      }
    });
  }
  
  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      Auth.logout();
      authModal.classList.remove('active');
      updateAuthUI();
      renderFavorites();
      renderLists();
    });
  }
}

function showLoginForm() {
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('signupForm').style.display = 'none';
  document.getElementById('userDashboard').style.display = 'none';
}

function showSignupForm() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('signupForm').style.display = 'block';
  document.getElementById('userDashboard').style.display = 'none';
}

function showUserDashboard() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('signupForm').style.display = 'none';
  document.getElementById('userDashboard').style.display = 'block';
  
  const user = Auth.getCurrentUser();
  document.getElementById('userName').textContent = user.username;
  document.getElementById('userFavCount').textContent = user.favorites ? user.favorites.length : 0;
  document.getElementById('userListCount').textContent = user.lists ? user.lists.length : 0;
}

function updateAuthUI() {
  const authBtn = document.getElementById('authBtn');
  const user = Auth.getCurrentUser();
  
  if (user) {
    authBtn.textContent = user.username;
    authBtn.classList.remove('btn-primary');
    authBtn.classList.add('btn-secondary');
  } else {
    authBtn.textContent = 'Sign In';
    authBtn.classList.add('btn-primary');
    authBtn.classList.remove('btn-secondary');
  }
}

// Favorites navigation
function setupFavoritesNav() {
  const link = document.getElementById('favoritesLink');
  if (link) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      renderFavorites();
      document.getElementById('favorites').scrollIntoView({ behavior: 'smooth' });
    });
  }
  
  const listsLink = document.getElementById('listsLink');
  if (listsLink) {
    listsLink.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('lists').scrollIntoView({ behavior: 'smooth' });
    });
  }
}

// Modal Functions
let currentProgramId = null;

function setupModal() {
  const modal = document.getElementById('programModal');
  const closeBtn = document.getElementById('modalClose');
  const saveBtn = document.getElementById('modalSave');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      if (currentProgramId) {
        const isFav = toggleFavorite(currentProgramId);
        saveBtn.textContent = isFav ? '❤️ Saved!' : '🤍 Save to Favorites';
        saveBtn.style.background = isFav ? '#FFE66D' : '';
      }
    });
  }
  
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
}

// Get location for a program (infer from provider if not set)
function getProgramLocation(program) {
  if (program.location && program.location !== 'undefined') {
    return program.location;
  }
  
  // Try to infer from provider
  const locationMap = {
    'MIT': 'Cambridge, MA',
    'Stanford': 'Stanford, CA',
    'Harvard': 'Cambridge, MA',
    'Yale': 'New Haven, CT',
    'Columbia': 'New York, NY',
    'Princeton': 'Princeton, NJ',
    'Cornell': 'Ithaca, NY',
    'Brown': 'Providence, RI',
    'Duke': 'Durham, NC',
    'UPenn': 'Philadelphia, PA',
    'NYU': 'New York, NY',
    'UCLA': 'Los Angeles, CA',
    'UC Berkeley': 'Berkeley, CA',
    'USC': 'Los Angeles, CA',
    'Georgetown': 'Washington, DC',
    'Northwestern': 'Evanston, IL',
    'Johns Hopkins': 'Baltimore, MD',
    'Carnegie Mellon': 'Pittsburgh, PA',
    'Boston University': 'Boston, MA',
    'Berklee': 'Boston, MA',
    'Parsons': 'New York, NY',
    'RISD': 'Providence, RI',
    'Juilliard': 'New York, NY',
    'Khan Academy': 'Online',
    'Google': 'Online',
    'Coursera': 'Online',
    'edX': 'Online',
    'Khan Academy': 'Online',
    'Girls Who Code': 'Online',
    'Y Combinator': 'Online',
    'General Assembly': 'Online',
    'Apple': 'Cupertino, CA',
    'Microsoft': 'Redmond, WA',
    'Amazon': 'Seattle, WA',
    'Meta': 'Menlo Park, CA',
    'NVIDIA': 'Santa Clara, CA',
    'SpaceX': 'Hawthorne, CA',
    'NASA': 'Washington, DC',
  };
  
  const provider = program.provider;
  if (provider && locationMap[provider]) {
    return locationMap[provider];
  }
  
  // Check tags for online programs
  if (program.tags && program.tags.some(tag => tag.toLowerCase().includes('online'))) {
    return 'Online';
  }
  
  return 'Various Locations';
}

function openModal(programId) {
  const program = programs.find(p => p.id === programId);
  if (!program) return;
  
  currentProgramId = programId;
  const modal = document.getElementById('programModal');
  const cat = categories.find(c => c.id === program.category);
  
  document.getElementById('modalIcon').innerHTML = getProgramLogo(program);
  document.getElementById('modalTitle').textContent = program.title;
  document.getElementById('modalProvider').textContent = program.provider;
  document.getElementById('modalDescription').textContent = program.description;
  document.getElementById('modalCost').textContent = program.cost;
  document.getElementById('modalLocation').textContent = getProgramLocation(program);
  document.getElementById('modalDeadline').textContent = program.deadline;
  // Website button - search Google if no website
  const websiteBtn = document.getElementById('modalWebsite');
  if (program.website) {
    websiteBtn.href = program.website;
  } else {
    websiteBtn.href = `https://www.google.com/search?q=${encodeURIComponent(program.title + ' ' + program.provider + ' summer program')}`;
  }
  
  // Update save button state
  const saveBtn = document.getElementById('modalSave');
  const isFav = isFavorite(programId);
  saveBtn.textContent = isFav ? '❤️ Saved!' : '🤍 Save to Favorites';
  saveBtn.style.background = isFav ? '#FFE66D' : '';
  
  // Tags
  const tagsContainer = document.getElementById('modalTags');
  tagsContainer.innerHTML = program.tags.map(tag => `<span class="program-tag">${tag}</span>`).join('');
  
  // Video - disabled for now
  // const videoContainer = document.getElementById('modalVideo');
  // const videoIframe = document.getElementById('videoIframe');
  // if (program.video) {
  //   videoContainer.style.display = 'block';
  //   videoIframe.src = program.video;
  // } else {
  //   videoContainer.style.display = 'none';
  //   videoIframe.src = '';
  // }
  
  // Ratings
  renderRatingStars(programId);
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('programModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
  
  // Stop video
  const videoIframe = document.getElementById('videoIframe');
  videoIframe.src = '';
}

// Render Categories
function renderCategories() {
  const grid = document.getElementById('categoryGrid');
  if (!grid) return;
  
  grid.innerHTML = categories.map(cat => `
    <div class="category-card" data-category="${cat.id}" style="--cat-color: ${cat.color}">
      <span class="category-icon">${cat.icon}</span>
      <span class="category-name">${cat.name}</span>
    </div>
  `).join('');
  
  // Add click handlers
  grid.onclick = function(e) {
    const card = e.target.closest('.category-card');
    if (card) {
      const category = card.dataset.category;
      filterByCategory(category);
    }
  };
}

// Render Programs
function renderPrograms(programList = programs) {
  const grid = document.getElementById('programGrid');
  if (!grid) return;
  
  if (programList.length === 0) {
    grid.innerHTML = '<p style="text-align:center;color:#888;grid-column:1/-1;">No programs found</p>';
    return;
  }
  
  grid.innerHTML = programList.map(program => `
    <div class="program-card" data-id="${program.id}">
      <div class="program-placeholder">
        ${getProgramLogo(program)}
      </div>
      <div class="program-content">
        <h3 class="program-title">${program.title}</h3>
        <p class="program-provider">${program.provider}</p>
        <p style="font-size:14px;color:#666;margin-bottom:12px;">${program.description}</p>
        <div style="display:flex;gap:8px;margin-bottom:8px;color:#888;font-size:12px;">
          <span>💰 ${program.cost}</span>
          <span>📍 ${getProgramLocation(program)}</span>
        </div>
        <div class="program-tags">
          ${program.tags.map(tag => `<span class="program-tag">${tag}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
  
  // Add click handlers to open modal
  grid.onclick = function(e) {
    const card = e.target.closest('.program-card');
    if (card) {
      const id = parseInt(card.dataset.id);
      openModal(id);
    }
  };
}

// Favorites functions - Uses Auth system
function getFavorites() {
  if (Auth.isLoggedIn()) {
    return Auth.getFavorites();
  }
  // Fallback to localStorage for non-logged in users
  const saved = localStorage.getItem('campberry_favorites');
  return saved ? JSON.parse(saved) : [];
}

function saveFavorites(favs) {
  if (Auth.isLoggedIn()) {
    Auth.saveFavorites(favs);
  } else {
    localStorage.setItem('campberry_favorites', JSON.stringify(favs));
  }
}

function isFavorite(programId) {
  const favs = getFavorites();
  return favs.includes(programId);
}

function toggleFavorite(programId) {
  let favs = getFavorites();
  if (favs.includes(programId)) {
    favs = favs.filter(id => id !== programId);
  } else {
    favs.push(programId);
  }
  saveFavorites(favs);
  return favs.includes(programId);
}

// Lists functions - Uses Auth system
function getLists() {
  if (Auth.isLoggedIn()) {
    return Auth.getLists();
  }
  // Fallback to localStorage for non-logged in users
  const saved = localStorage.getItem('campberry_lists');
  return saved ? JSON.parse(saved) : [];
}

function saveLists(lists) {
  if (Auth.isLoggedIn()) {
    Auth.saveLists(lists);
  } else {
    localStorage.setItem('campberry_lists', JSON.stringify(lists));
  }
}

function createList(name) {
  const lists = getLists();
  const newList = {
    id: Date.now(),
    name: name,
    programs: []
  };
  lists.push(newList);
  saveLists(lists);
  return newList;
}

function deleteList(listId) {
  let lists = getLists();
  lists = lists.filter(l => l.id !== listId);
  saveLists(lists);
}

function addToList(listId, programId) {
  const lists = getLists();
  const list = lists.find(l => l.id === listId);
  if (list && !list.programs.includes(programId)) {
    list.programs.push(programId);
    saveLists(lists);
  }
}

function removeFromList(listId, programId) {
  const lists = getLists();
  const list = lists.find(l => l.id === listId);
  if (list) {
    list.programs = list.programs.filter(id => id !== programId);
    saveLists(lists);
  }
}

function renderFavorites() {
  const favs = getFavorites();
  const favPrograms = programs.filter(p => favs.includes(p.id));
  const grid = document.getElementById('favoritesGrid');
  
  if (!grid) return;
  
  if (favPrograms.length === 0) {
    const user = Auth.getCurrentUser();
    if (user) {
      grid.innerHTML = '<p style="text-align:center;color:#888;grid-column:1/-1;">No favorites yet. Click ❤️ on any program to save it here!</p>';
    } else {
      grid.innerHTML = '<p style="text-align:center;color:#888;grid-column:1/-1;"><a href="#" id="favSignIn">Sign in</a> or click ❤️ on any program to save it here!</p>';
      // Add sign in handler
      setTimeout(() => {
        const signInLink = document.getElementById('favSignIn');
        if (signInLink) {
          signInLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('authBtn').click();
          });
        }
      }, 100);
    }
    return;
  }
  
  grid.innerHTML = favPrograms.map(program => `
    <div class="program-card" data-id="${program.id}">
      <div class="program-placeholder">
        ${getProgramLogo(program)}
      </div>
      <div class="program-content">
        <h3 class="program-title">${program.title}</h3>
        <p class="program-provider">${program.provider}</p>
        <p style="font-size:14px;color:#666;margin-bottom:12px;">${program.description}</p>
        <div style="display:flex;gap:8px;margin-bottom:8px;color:#888;font-size:12px;">
          <span>💰 ${program.cost}</span>
          <span>📍 ${getProgramLocation(program)}</span>
        </div>
        <div class="program-tags">
          ${program.tags.map(tag => `<span class="program-tag">${tag}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
  
  // Add click handlers
  grid.onclick = function(e) {
    const card = e.target.closest('.program-card');
    if (card) {
      const id = parseInt(card.dataset.id);
      openModal(id);
    }
  };
}

function getCategoryIcon(categoryId) {
  const cat = categories.find(c => c.id === categoryId);
  return cat ? cat.icon : '📦';
}

// Get program logo (college logo or category icon)
function getProgramLogo(program) {
  // Try to get provider logo first
  const logo = getProviderLogo(program.provider);
  if (logo) {
    return `<img src="${logo}" alt="${program.provider}" class="program-logo" onerror="this.style.display='none';this.parentElement.innerHTML='${getCategoryIcon(program.category)}';">`;
  }
  // Fallback to category icon
  return getCategoryIcon(program.category);
}

// Filter by category
function filterByCategory(category) {
  const filtered = programs.filter(p => p.category === category);
  renderPrograms(filtered);
}

// Setup search
function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  
  if (searchBtn) {
    searchBtn.addEventListener('click', performSearch);
  }
  
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performSearch();
    });
  }
}

// Perform search
function performSearch() {
  const searchInput = document.getElementById('searchInput');
  const query = searchInput.value.toLowerCase().trim();
  
  if (!query) {
    renderPrograms(programs);
    scrollToPrograms();
    return;
  }
  
  const filtered = programs.filter(p => 
    (p.title && p.title.toLowerCase().includes(query)) ||
    (p.provider && p.provider.toLowerCase().includes(query)) ||
    (p.tags && p.tags.some(tag => tag && tag.toLowerCase().includes(query))) ||
    (p.description && p.description.toLowerCase().includes(query)) ||
    (p.category && p.category.toLowerCase().includes(query))
  );
  
  renderPrograms(filtered);
  
  if (filtered.length === 0) {
    showNoResultsMessage();
  } else {
    scrollToPrograms();
  }
}

function scrollToPrograms() {
  const programSection = document.getElementById('programGrid');
  if (programSection) {
    programSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function showNoResultsMessage() {
  const grid = document.getElementById('programGrid');
  if (grid) {
    grid.innerHTML = '<p style="text-align:center;color:#888;grid-column:1/-1;padding:40px;">No programs found for your search. Try different keywords like "robotics", "AI", "coding", "music", or browse by category below!</p>';
  }
}

// Filter by category
function filterByCategory(category) {
  const filtered = programs.filter(p => p.category === category);
  renderPrograms(filtered);
  scrollToPrograms();
}

function renderLists() {
  const lists = getLists();
  const grid = document.getElementById('listsGrid');
  
  if (!grid) return;
  
  if (lists.length === 0) {
    const user = Auth.getCurrentUser();
    if (user) {
      grid.innerHTML = '<p style="text-align:center;color:#888;grid-column:1/-1;">No lists yet. Create one above!</p>';
    } else {
      grid.innerHTML = '<p style="text-align:center;color:#888;grid-column:1/-1;"><a href="#" id="listSignIn">Sign in</a> to create and save lists!</p>';
      // Add sign in handler
      setTimeout(() => {
        const signInLink = document.getElementById('listSignIn');
        if (signInLink) {
          signInLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('authBtn').click();
          });
        }
      }, 100);
    }
    return;
  }
  
  grid.innerHTML = lists.map(list => `
    <div class="list-card" data-id="${list.id}">
      <div class="list-card-header">
        <span class="list-name">${list.name}</span>
        <span class="list-count">${list.programs.length} programs</span>
        <button class="list-delete" data-delete="${list.id}">🗑️</button>
      </div>
      <p class="list-programs">${list.programs.length > 0 ? list.programs.length + ' saved programs' : 'No programs yet'}</p>
    </div>
  `).join('');
}

function setupListCreation() {
  const input = document.getElementById('newListName');
  const btn = document.getElementById('createListBtn');
  
  if (btn) {
    btn.addEventListener('click', () => {
      const name = input.value.trim();
      if (name) {
        createList(name);
        input.value = '';
        renderLists();
      }
    });
  }
  
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const name = input.value.trim();
        if (name) {
          createList(name);
          input.value = '';
          renderLists();
        }
      }
    });
  }
}

// Ratings functions
function getRatings() {
  const saved = localStorage.getItem('campberry_ratings');
  return saved ? JSON.parse(saved) : {};
}

function saveRatings(ratings) {
  localStorage.setItem('campberry_ratings', JSON.stringify(ratings));
}

function getRating(programId) {
  const ratings = getRatings();
  return ratings[programId] || 0;
}

function setRating(programId, rating) {
  const ratings = getRatings();
  ratings[programId] = rating;
  saveRatings(ratings);
}

function renderRatingStars(programId) {
  const container = document.getElementById('ratingStars');
  if (!container) return;
  
  const currentRating = getRating(programId);
  container.innerHTML = [1,2,3,4,5].map(i => `
    <span class="star ${i <= currentRating ? 'active' : ''}" data-rating="${i}">⭐</span>
  `).join('');
  
  container.onclick = function(e) {
    if (e.target.classList.contains('star')) {
      const rating = parseInt(e.target.dataset.rating);
      setRating(programId, rating);
      renderRatingStars(programId);
    }
  };
  
  // Mobile menu
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
      });
    });
  }
}
