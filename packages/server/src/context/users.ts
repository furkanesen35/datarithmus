interface User {
    id: number;
    username: string;
    email: string;
    password: string; // Plaintext for now, upgrade to bcrypt later
  }
  
  class UserStore {
    private users: User[] = [];
    private idCounter = 1;
  
    async findByEmail(email: string): Promise<User | undefined> {
      return this.users.find(user => user.email === email);
    }
  
    async create(username: string, email: string, password: string): Promise<User> {
      const user: User = { id: this.idCounter++, username, email, password };
      this.users.push(user);
      return user;
    }
  }
  
  export const userStore = new UserStore();