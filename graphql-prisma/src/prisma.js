import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466'
}) 


// prisma.query.comments(null, '{ id text author { id name } }')
//     .then((data) => console.log(JSON.stringify(data, null, 2)))
//     .catch((error) => console.log(error))

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

prisma.mutation.updatePost({
    data: {
        published: false, 
        title: 'My new posts 2001'
    },
    where: {
        id: 'ckdsffsie00110875ojmmh207'
    }
}, `{
    id title body published
}`)
    .then((data) => prisma.query.users(null, '{ id name posts { id title } }'))
    .then((data) => console.log(JSON.stringify(data, null, 2)))
    .catch((error) => console.log(error))