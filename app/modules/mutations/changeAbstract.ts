import { NotFoundError, resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async ({ suffix, description }) => {
  const module = await db.module.update({
    where: { suffix },
    data: { description },
  })

  // Force all authors to reapprove for publishing
  await db.authorship.updateMany({
    where: {
      moduleId: module.id,
    },
    data: {
      readyToPublish: false,
    },
  })

  const updatedModule = await db.module.findFirst({
    where: { suffix },
    include: {
      authors: {
        include: {
          workspace: true,
        },
      },
      license: true,
    },
  })

  return updatedModule
})
