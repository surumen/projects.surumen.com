async function feed(parent, args, context, info) {
  const where = args.filter ? {
    OR: [
      { tools_contains: args.filter },
      { category_contains: args.filter },
      { description_contains: args.filter },
      { name_contains: args.filter },
    ],
  } : {}

  const projects = await context.prisma.projects({
    where,
    skip: args.skip,
    first: args.first,
    orderBy: args.orderBy
  })

  const count = await context.prisma
    .projectsConnection({
      where,
    })
    .aggregate()
    .count()
  return {
  	projects,
  	count
  }
  
}

module.exports = {
  feed,
}