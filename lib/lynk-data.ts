import { type Db, ObjectId } from "mongodb"
import { z } from "zod"

export const lynkBlockSchema = z.object({
  id: z.number(),
  title: z.string().trim().min(1).max(150),
  type: z.string().trim().min(1).max(50),
  active: z.boolean(),
  price: z.string().nullable().optional(),
  currency: z.string().trim().max(10).nullable().optional(),
  image: z.string().nullable().optional(),
})

type UserWithLynkFields = {
  _id: ObjectId
  username?: unknown
  paymentLinkEnabled?: unknown
  appearance?: unknown
  myLynkBlocks?: unknown
}

type LynkPageDoc = {
  _id?: ObjectId
  userId: ObjectId
  username: string
  paymentLinkEnabled?: boolean
  appearance?: unknown
}

type LynkBlockDoc = {
  _id?: ObjectId
  userId: ObjectId
  blockId: number
  title: string
  type: string
  active: boolean
  price?: string | null
  currency?: string | null
  image?: string | null
  sortOrder: number
}

export async function findUserByPublicUsername(
  db: Db,
  username: string,
  options: { projection: Record<string, unknown> },
) {
  const normalized = username.trim().toLowerCase()
  if (!normalized) return null

  const normalizedProjection = options.projection
  const lynkPages = db.collection<LynkPageDoc>("lynk_pages")
  const users = db.collection("users")

  const page = await lynkPages.findOne({ username: normalized }, { projection: { userId: 1 } })
  if (page?.userId) {
    const userFromPage = await users.findOne({ _id: page.userId }, { projection: normalizedProjection })
    if (userFromPage) {
      return userFromPage
    }
  }

  return users.findOne({ username: normalized }, { projection: normalizedProjection })
}

export async function ensureLynkIndexes(db: Db) {
  const lynkPages = db.collection<LynkPageDoc>("lynk_pages")
  const lynkBlocks = db.collection<LynkBlockDoc>("lynk_blocks")

  try {
    await lynkPages.createIndexes([
      { key: { userId: 1 }, unique: true, name: "unique_lynk_page_user" },
      { key: { username: 1 }, unique: true, name: "unique_lynk_page_username" },
    ])
  } catch {
    // Do not block API flows on index bootstrap conflicts in existing datasets.
  }
  try {
    await lynkBlocks.createIndexes([
      { key: { userId: 1, sortOrder: 1 }, name: "idx_lynk_blocks_user_sort" },
      { key: { userId: 1, blockId: 1 }, unique: true, name: "unique_lynk_block_per_user" },
    ])
  } catch {
    // Do not block API flows on index bootstrap conflicts in existing datasets.
  }
}

export function parseLegacyBlocks(input: unknown) {
  if (!Array.isArray(input)) return []
  return input
    .map((raw) => lynkBlockSchema.safeParse(raw))
    .filter((parsed): parsed is { success: true; data: z.infer<typeof lynkBlockSchema> } => parsed.success)
    .map((parsed) => parsed.data)
}

export async function getUserLynkData(db: Db, user: UserWithLynkFields) {
  const lynkPages = db.collection<LynkPageDoc>("lynk_pages")
  const lynkBlocks = db.collection<LynkBlockDoc>("lynk_blocks")

  const [page, blockDocs] = await Promise.all([
    lynkPages.findOne(
      { userId: user._id },
      { projection: { _id: 0, paymentLinkEnabled: 1, appearance: 1 } },
    ),
    lynkBlocks.find({ userId: user._id }).sort({ sortOrder: 1 }).toArray(),
  ])

  const blocksFromCollection = blockDocs
    .map((doc) =>
      lynkBlockSchema.safeParse({
        id: doc.blockId,
        title: doc.title,
        type: doc.type,
        active: doc.active,
        price: doc.price ?? null,
        currency: doc.currency ?? null,
        image: doc.image ?? null,
      }),
    )
    .filter((parsed): parsed is { success: true; data: z.infer<typeof lynkBlockSchema> } => parsed.success)
    .map((parsed) => parsed.data)

  const usesLegacyBlocks = blocksFromCollection.length === 0
  const blocks = blocksFromCollection.length > 0 ? blocksFromCollection : parseLegacyBlocks(user.myLynkBlocks)
  const usesLegacyPayment = typeof page?.paymentLinkEnabled !== "boolean"
  const paymentLinkEnabled = usesLegacyPayment ? Boolean(user.paymentLinkEnabled) : page.paymentLinkEnabled
  const appearance = page?.appearance !== undefined ? page.appearance : user.appearance

  return { blocks, paymentLinkEnabled, appearance, usesLegacyBlocks, usesLegacyPayment }
}

export async function saveUserLynkBlocks(db: Db, user: UserWithLynkFields, blocks: z.infer<typeof lynkBlockSchema>[]) {
  const lynkPages = db.collection<LynkPageDoc>("lynk_pages")
  const lynkBlocks = db.collection<LynkBlockDoc>("lynk_blocks")
  const now = new Date()
  const username = String(user.username ?? "").trim().toLowerCase()

  await ensureLynkIndexes(db)

  await lynkPages.updateOne(
    { userId: user._id },
    {
      $set: { username, updatedAt: now },
      $setOnInsert: { userId: user._id, username, paymentLinkEnabled: Boolean(user.paymentLinkEnabled), appearance: user.appearance ?? null, schemaVersion: 1, createdAt: now },
    },
    { upsert: true },
  )

  await lynkBlocks.deleteMany({ userId: user._id })
  if (blocks.length === 0) return

  await lynkBlocks.insertMany(
    blocks.map((block, index) => ({
      userId: user._id,
      blockId: block.id,
      title: block.title,
      type: block.type,
      active: block.active,
      price: block.price ?? null,
      currency: block.currency ?? null,
      image: block.image ?? null,
      sortOrder: index,
      schemaVersion: 1,
      createdAt: now,
      updatedAt: now,
    })),
  )
}

export async function setUserPaymentLinkEnabled(db: Db, user: UserWithLynkFields, enabled: boolean) {
  const lynkPages = db.collection<LynkPageDoc>("lynk_pages")
  const now = new Date()
  const username = String(user.username ?? "").trim().toLowerCase()

  await ensureLynkIndexes(db)
  await lynkPages.updateOne(
    { userId: user._id },
    {
      $set: { username, paymentLinkEnabled: enabled, updatedAt: now },
      $setOnInsert: { userId: user._id, username, appearance: user.appearance ?? null, schemaVersion: 1, createdAt: now },
    },
    { upsert: true },
  )
}

export async function setUserLynkAppearance(db: Db, user: UserWithLynkFields, appearance: unknown) {
  const lynkPages = db.collection<LynkPageDoc>("lynk_pages")
  const now = new Date()
  const username = String(user.username ?? "").trim().toLowerCase()

  await ensureLynkIndexes(db)
  await lynkPages.updateOne(
    { userId: user._id },
    {
      $set: { username, appearance, updatedAt: now },
      $setOnInsert: { userId: user._id, username, paymentLinkEnabled: Boolean(user.paymentLinkEnabled), schemaVersion: 1, createdAt: now },
    },
    { upsert: true },
  )
}

export async function upsertLynkPageOnSignup(db: Db, user: { _id: ObjectId; username: string }) {
  const lynkPages = db.collection<LynkPageDoc>("lynk_pages")
  const now = new Date()
  await ensureLynkIndexes(db)
  await lynkPages.updateOne(
    { userId: user._id },
    {
      $set: { username: user.username.trim().toLowerCase(), updatedAt: now },
      $setOnInsert: { userId: user._id, username: user.username.trim().toLowerCase(), paymentLinkEnabled: false, appearance: null, schemaVersion: 1, createdAt: now },
    },
    { upsert: true },
  )
}

export async function syncLynkPageUsername(db: Db, input: {
  userId: ObjectId
  username: string
  paymentLinkEnabled?: boolean
  appearance?: unknown
}) {
  const lynkPages = db.collection<LynkPageDoc>("lynk_pages")
  const now = new Date()
  await ensureLynkIndexes(db)
  await lynkPages.updateOne(
    { userId: input.userId },
    {
      $set: { username: input.username.trim().toLowerCase(), updatedAt: now },
      $setOnInsert: { userId: input.userId, username: input.username.trim().toLowerCase(), paymentLinkEnabled: Boolean(input.paymentLinkEnabled), appearance: input.appearance ?? null, schemaVersion: 1, createdAt: now },
    },
    { upsert: true },
  )
}
