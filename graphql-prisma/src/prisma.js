import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466'
}) 

// prisma.mutation.createPost({
//     data: {
//         title: 'My new post 2000',
//         body: 'You can find the course here', 
//         published: true, 
//         author: {
//             connect: {
//                 id: 'ckdls6bj4000u0875wuatgllg'
//             }
//         }
//     }
// }, `{
//     id title body published
// }`)
//     .then((data) => {
//         console.log(JSON.stringify(data, null, 2))
//         return prisma.query.users(null, '{ id name posts { id title } }')
//     })
//     .then((data) => console.log(JSON.stringify(data, null, 2)))
//     .catch((error) => console.log(error))

// prisma.mutation.updatePost({
//     data: {
//         published: false, 
//         title: 'My new posts 2001'
//     },
//     where: {
//         id: 'ckdsffsie00110875ojmmh207'
//     }
// }, `{
//     id title body published
// }`)
//     .then((data) => prisma.query.users(null, '{ id name posts { id title } }'))
//     .then((data) => console.log(JSON.stringify(data, null, 2)))
    // .catch((error) => console.log(error))

const createPostForUser = async (authorId, data) => {
    const post = await prisma.mutation.createPost({
        data: { 
            ...data,
            author: { 
                connect: { 
                    id: authorId
                }
            }
        }
    }, `{ id }`)

    const user = await prisma.query.user({
        where: { id: authorId }
    }, '{ id name email posts { id title published } }')

    return user
}

const updatePostForUser = async ( postId, data) => {
    const post = await prisma.mutation.updatePost({
        data,
        where: {
            id: postId
        }
    }, '{ author { id } }')

    const user = await prisma.query.user({
        where: { id: post.author.id }
    }, '{ id name email posts { id title published } }')

    return user
}

updatePostForUser('ckdsg3x9v005w0875n4o29dps', {
    title: 'WoW wow 3000!'
}).then(data => console.log(JSON.stringify(data, null, 2)))
.catch(error => console.log(error))

// createPostForUser('ckdlss4my00af0875x2qvxnh7', {
//     title: "Wow, it worked", 
//     body: "Its art", 
//     published: true
// }).then ( user => console.log(JSON.stringify(user, null, 2)))