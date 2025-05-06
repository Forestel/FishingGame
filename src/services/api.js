export const authService = {
  login: async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userData = JSON.parse(localStorage.getItem('user'));

        if (userData && userData.email === email && userData.password === password) {
          resolve({ success: true, user: userData });
        } else {
          resolve({ success: false, message: 'Невірний email або пароль' });
        }
      }, 500);
    });
  },

  signup: async (username, email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const existingUser = JSON.parse(localStorage.getItem('user'));

        if (existingUser && existingUser.email === email) {
          resolve({ success: false, message: 'Користувач з таким email вже існує' });
        } else {
          const newUser = { username, email, password };
          localStorage.setItem('user', JSON.stringify(newUser));
          resolve({ success: true, user: newUser });
        }
      }, 500);
    });
  }
};
