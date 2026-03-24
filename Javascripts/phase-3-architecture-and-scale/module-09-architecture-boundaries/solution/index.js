'use strict';

class InMemoryUserRepository {
  constructor() {
    this.byEmail = new Map();
  }

  save(user) {
    this.byEmail.set(user.email, user);
    return user;
  }

  findByEmail(email) {
    return this.byEmail.get(email) ?? null;
  }
}

class RegisterUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  execute(input) {
    const email = String(input?.email ?? '').trim().toLowerCase();
    const name = String(input?.name ?? '').trim();

    if (!email || !name) {
      return { ok: false, error: 'name and email are required' };
    }

    const existing = this.userRepository.findByEmail(email);
    if (existing) {
      return { ok: false, error: 'email already registered' };
    }

    const user = {
      id: Math.random().toString(36).slice(2, 10),
      name,
      email,
      createdAt: new Date().toISOString()
    };

    this.userRepository.save(user);
    return { ok: true, value: user };
  }
}

module.exports = {
  InMemoryUserRepository,
  RegisterUserUseCase
};

if (require.main === module) {
  const repo = new InMemoryUserRepository();
  const useCase = new RegisterUserUseCase(repo);
  console.log(useCase.execute({ name: 'Ken', email: 'ken@example.com' }));
}
