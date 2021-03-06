/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // eslint-disable-next-line no-param-reassign
      if (key == 'name') {
        let data = nameSearch(object[key]);
        obj = { ...obj, ...data };
      } else if (key == 'email') {
        obj.$or = [
          {
            email: {
              $regex: object[key],
              $options: 'i',
            },
          },
        ];
      } else if (key == 'address') {
        obj.$or = [
          {
            'propertyAddress.city': { $in: object[key] },
          },
        ];
      } else if (key == 'agent') {
        obj.$or = [
          {
            serviceType: {
              $regex: object[key],
              $options: 'i',
            },
          },
        ];
      } else if (key == 'startDate' || key == 'endDate') {
        if (key == 'startDate' && key == 'endDate') {
          obj.$and = [
            {
              createdAt: { $gte: object[key] },
            },
            {
              createdAt: { $lte: object[key] },
            },
          ];
        } else if (key == 'startDate') {
          obj.$or = [
            {
              createdAt: { $gte: object[key] },
            },
          ];
        } else if (key == 'endDate') {
          obj.$or = [
            {
              createdAt: { $gte: object[key] },
            },
          ];
        }
      } else if (key == 'userId') {
        obj.$and = [{ agentsDecline: { $nin: [object[key]] } }];
      } else {
        obj[key] = object[key];
      }
    }
    return obj;
  }, {});
};

module.exports = pick;

function nameSearch(name) {
  const nameArr = name.split(' ');
  let firstName, lastName;
  let obj = {};
  if (nameArr.length == 1) {
    firstName = nameArr[0];
    obj.$or = [
      {
        firstName: { $regex: firstName, $options: 'i' },
      },
      {
        lastName: { $regex: firstName, $options: 'i' },
      },
    ];
  } else if (nameArr.length == 2) {
    firstName = nameArr[0];
    lastName = nameArr[1];

    obj.$or = [
      {
        $and: [
          {
            firstName: { $regex: firstName, $options: 'i' },
          },
          {
            lastName: { $regex: lastName, $options: 'i' },
          },
        ],
      },
      {
        $and: [
          {
            firstName: { $regex: lastName, $options: 'i' },
          },
          {
            lastName: { $regex: firstName, $options: 'i' },
          },
        ],
      },
    ];
  }
  return obj;
}
