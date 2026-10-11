export const createUserValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage: "Username must be atleast min of 5 char and max 32 char",
    },
    notEmpty: {
      errorMessage: "Username cannot be empty",
    },
    isString: {
      errorMessage: "Username must be a string!",
    },
  },
  displayName: {
    notEmpty: {
      errorMessage: "displayName cannot be empty",
    },
  },
};
