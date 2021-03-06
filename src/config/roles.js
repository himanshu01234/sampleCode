const roles = ['user', 'admin'];

const roleRights = new Map();
roleRights.set(roles[0], ['service', 'serviceTypes', 'rating', 'getUsers', 'userSupport']);
roleRights.set(roles[1], [
  'getUsers',
  'manageUsers',
  'getServices',
  'service',
  'serviceType',
  'serviceTypes',
  'dashboard',
  'support',
  'skill',
  'supportType',
  'preferredLocation',
  'static',
  'superAdmin',
]);

module.exports = {
  roles,
  roleRights,
};
