'use strict';

class UserRepository {
  save(user) {
    // TODO
    throw new Error('Not implemented');
  }

  findByEmail(email) {
    // TODO
    throw new Error('Not implemented');
  }
}

class RegisterUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  execute(input) {
    // TODO: validate + dedupe + persist.
    throw new Error('Not implemented');
  }
}

module.exports = {
  UserRepository,
  RegisterUserUseCase
};

if (require.main === module) {
  console.log('Module 09 starter loaded. Complete TODOs in this file.');
}
