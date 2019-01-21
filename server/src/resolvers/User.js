function projects(parent, args, context) {
  return context.prisma.user({ id: parent.id }).projects()
}

module.exports = {
  projects,
}