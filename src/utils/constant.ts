/**
 * Firestore Collection name
 */
const collectionName = ['rooms', 'messages', 'playground', 'lines'] as const
export type CollectionName = typeof collectionName[number]

/**
 * 部屋のステータス
 */
const roomStatus = ['wait', 'play', 'close'] as const
export type RoomStatus = typeof roomStatus[number]

/**
 * ユーザーステータス
 */
const userStatus = ['online', 'offline', 'exit'] as const
export type UserStatus = typeof userStatus[number]

/**
 * ユーザーに設定する色
 */
export const userColors = {
  black: '#1A202C',
  red: '#E53E3E',
  yellow: '#D69E2E',
  green: '#38A169',
  blue: '#3182CE',
  orange: '#DD6B20',
  purple: '#805AD5',
  pink: '#D53F8C',
  teal: '#319795',
  indigo: '#5A67D8',
} as const
export type UserColors = typeof userColors[keyof typeof userColors]

/**
 * キャンバス描画ステータス
 */
export const drawStatus = ['stop', 'start', 'finish'] as const
export type DrawStatus = typeof drawStatus[number]
