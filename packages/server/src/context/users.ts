import * as bcrypt from 'bcrypt';

interface User {
  id: number;
  username: string;
  email: string;
  password: string; // Now stores hashed password
}

class UserStore {
  private users: User[] = [];
  private idCounter = 1;

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async create(username: string, email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    const user: User = { id: this.idCounter++, username, email, password: hashedPassword };
    this.users.push(user);
    return user;
  }
}

export const userStore = new UserStore();