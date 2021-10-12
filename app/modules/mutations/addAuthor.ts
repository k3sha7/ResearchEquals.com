import { NotFoundError, resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async ({ authorId, moduleId }, ctx) => {
  const module = await db.module.update({
    where: {
      id: moduleId,
    },
    data: {
      authors: {
        createMany: {
          data: [{ workspaceId: parseInt(authorId), acceptedInvitation: undefined }],
        },
      },
    },
  })

  return true
})
