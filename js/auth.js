// Summer Sprout - User Authentication System
const Auth = {
  USERS_KEY: 'campberry_users',
  CURRENT_USER_KEY: 'campberry_current_user',

  // Get all users
  getUsers() {
    const saved = localStorage.getItem(this.USERS_KEY);
    return saved ? JSON.parse(saved) : {};
  },

  // Save users
  saveUsers(users) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  },

  // Get current user
  getCurrentUser() {
    const saved = localStorage.getItem(this.CURRENT_USER_KEY);
    return saved ? JSON.parse(saved) : null;
  },

  // Set current user
  setCurrentUser(user) {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  },

  // Register new user
  register(username, email, password) {
    const users = this.getUsers();
    
    if (users[email]) {
      return { success: false, message: 'Email already registered' };
    }
    
    users[email] = {
      username,
      email,
      password, // In production, hash this!
      favorites: [],
      lists: [],
      createdAt: new Date().toISOString()
    };
    
    this.saveUsers(users);
    return { success: true, message: 'Account created successfully' };
  },

  // Login
  login(email, password) {
    const users = this.getUsers();
    const user = users[email];
    
    if (!user || user.password !== password) {
      return { success: false, message: 'Invalid email or password' };
    }
    
    this.setCurrentUser(user);
    return { success: true, message: 'Login successful', user };
  },

  // Logout
  logout() {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    return { success: true };
  },

  // Update user data
  updateUser(updates) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return { success: false, message: 'Not logged in' };
    
    const users = this.getUsers();
    const user = users[currentUser.email];
    
    if (!user) return { success: false, message: 'User not found' };
    
    // Merge updates
    Object.assign(user, updates);
    users[currentUser.email] = user;
    this.saveUsers(users);
    this.setCurrentUser(user);
    
    return { success: true };
  },

  // Get user favorites
  getFavorites() {
    const user = this.getCurrentUser();
    return user ? user.favorites || [] : [];
  },

  // Save favorites
  saveFavorites(favorites) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return { success: false, message: 'Not logged in' };
    
    const users = this.getUsers();
    users[currentUser.email].favorites = favorites;
    this.saveUsers(users);
    this.setCurrentUser(users[currentUser.email]);
    
    return { success: true };
  },

  // Get user lists
  getLists() {
    const user = this.getCurrentUser();
    return user ? user.lists || [] : [];
  },

  // Save lists
  saveLists(lists) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return { success: false, message: 'Not logged in' };
    
    const users = this.getUsers();
    users[currentUser.email].lists = lists;
    this.saveUsers(users);
    this.setCurrentUser(users[currentUser.email]);
    
    return { success: true };
  },

  // Check if logged in
  isLoggedIn() {
    return this.getCurrentUser() !== null;
  }
};
