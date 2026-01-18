import { compare } from 'bcryptjs'
import { prisma } from './prisma'

export async function verifyCredentials(usernameOrEmail, password) {
  // Try to find user by username or email
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: usernameOrEmail },
        { email: usernameOrEmail },
      ],
    },
  })

  if (!user || !user.is_active) {
    return null
  }

  const isValid = await compare(password, user.password)

  if (!isValid) {
    return null
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    nama: user.nama,
  }
}

