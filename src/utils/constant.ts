/**
 * Firestore Collection name
 */
const collectionName = ['rooms', 'messages'] as const
export type CollectionName = typeof collectionName[number]

/**
 * 部屋のステータス
 */
const roomStatus = ['wait', 'play', 'close'] as const
export type RoomStatus = typeof roomStatus[number]

/**
 * オンラインステータス
 */
const onlineStatus = ['online', 'offline'] as const
export type OnlineStatus = typeof onlineStatus[number]
