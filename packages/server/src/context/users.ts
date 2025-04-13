import * as bcrypt from 'bcrypt';

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  isSuperuser: boolean;
}

class UserStore {
  private users: User[] = [];
  private idCounter = 1;

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async create(username: string, email: string, password: string, isSuperuser: boolean = false): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user: User = { id: this.idCounter++, username, email, password: hashedPassword, isSuperuser };
    this.users.push(user);
    // Temporary: Make specific user superuser
    if (email === 'furkanesen35@gmail.com') {
      user.isSuperuser = true;
    }
    return user;
  }
}

export const userStore = new UserStore();