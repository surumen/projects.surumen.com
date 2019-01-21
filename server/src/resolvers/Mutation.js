const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')



async function signup(parent, args, context, info) {
  // In the signup mutation, the first thing to do is
  // encrypting the User’s password using the bcryptjs library 
  const password = await bcrypt.hash(args.password, 10)


  // use the prisma client instance to store the new User in the database
  const user = await context.prisma.createUser({ ...args, password })

  // generate a JWT which is signed with an APP_SECRET
  // You still need to create this APP_SECRET and also install 
  // the jwt library that’s used here
  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  // return the token and the user in an object that adheres to the 
  // shape of an AuthPayload object from your GraphQL schema
  return {
    token,
    user,
  }
}

async function login(parent, args, context, info) {

  // Instead of creating a new User object, you’re now using the prisma 
  // client instance to retrieve the existing User record by the email 
  // address that was sent along as an argument in the login mutation. 
  // If no User with that email address was found, you return a corresponding error
  const user = await context.prisma.user({ email: args.email })
  if (!user) {
    throw new Error('No such user found')
  }

  // compare the provided password with the one that is stored in the database
  // If the two don’t match, you’re returning an error as well
  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  // return token and user again
  return {
    token,
    user,
  }
}

function post(parent, args, context, info) {
  const userId = getUserId(context)
  return context.prisma.createProject({
    name: args.name,
    url: args.url,
    description: args.description,
    tools: args.tools,
    repo: args.repo,
    buttonBg: args.buttonBg,
    color: args.color,
    category: args.category,
    createdBy: { connect: { id: userId } },
  })
}

module.exports = {
  signup,
  login,
  post,
}