const Query = {
    users(parent, args, { db, prisma }, info) {
        const obArgs = {}

        if (args.query) {
            obArgs.where = {
                OR: [{ name_contains: args.query}, {email_contains: args.query}]
            }
        }

        return prisma.query.users(obArgs, info)
    },
    posts(parent, args, { prisma }, info) {
        const obArgs = {}
        
        if (args.query) {
            obArgs.where = {
                OR: [{
                    title_contains: args.query
                },
                {
                    body_contains: args.query 
                }]
            }
        }

        return prisma.query.posts(obArgs, info)
    },
    comments(parent, args, { prisma }, info) {

        return prisma.query.comments(null, info)
    }
   
}

export { Query as default}