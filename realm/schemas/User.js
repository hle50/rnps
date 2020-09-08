class User {
  get fullName() {
    return this.firstName + ' ' + this.lastName;
  }
}

User.schema = {
  name: 'User',
  primaryKey: 'id',
  properties: {
    id: 'string',
    birthday: 'date',
    firstName: 'string',
    lastName: 'string',
    gender: 'string',
    avatar: {type: 'data', optional: true}, // optional property
  }
};

export default User;