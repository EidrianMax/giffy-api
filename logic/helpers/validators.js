const USERNAME_MIN_LENGTH = 4
const USERNAME_MAX_LENGTH = 50
const PASSWORD_MIN_LENGTH = 6
const PASSWORD_MAX_LENGTH = 15

const validateString = (string, stringName) => {
  if (typeof string !== 'string') throw new TypeError(`${stringName} is not a string`)
  if (!string.trim().length) throw new Error(`${stringName} is empty`)
  if (/ /g.test(string)) throw new Error(`${stringName} mustn't have white spaces`)
}

export const validateUsername = (username) => {
  validateString(username, 'username')
  if (!(username.length >= USERNAME_MIN_LENGTH && username.length <= USERNAME_MAX_LENGTH)) throw new Error(`username must be atleast ${USERNAME_MIN_LENGTH} chars and under ${USERNAME_MAX_LENGTH} chars`)
}

export const validatePassword = (password) => {
  validateString(password, 'password')
  if (!(password.length >= PASSWORD_MIN_LENGTH && password.length <= PASSWORD_MAX_LENGTH)) throw new Error(`password must be atleast ${PASSWORD_MIN_LENGTH} chars and under ${PASSWORD_MAX_LENGTH} chars`)
}
