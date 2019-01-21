function createdBy(parent, args, context) {
  return context.prisma.project({ id: parent.id }).createdBy()
}

module.exports = {
  createdBy,
}