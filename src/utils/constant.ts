/**
 * Firestore Collection name
 */
const CollectionName = ['rooms', 'messages', 'playground', 'lines'] as const
export type CollectionName = typeof CollectionName[number]

/**
 * 部屋のステータス
 */
const RoomStatus = ['wait', 'play', 'close'] as const
export type RoomStatus = typeof RoomStatus[number]

/**
 * ユーザーステータス
 */
const userStatus = ['online', 'offline', 'exit'] as const
export type UserStatus = typeof userStatus[number]

/**
 * ユーザーに設定する色
 */
export const UserColors = {
  black: '#221714',
  red: '#B91722',
  bule: '#09537C',
  green: '#677F58',
  orange: '#E39827',
  pink: '#D38B93',
  yellow: '#E1B453',
  skybule: '#5C899D',
  gray: '#B1B0B7',
  brown: '#674129',
} as const
export type UserColors = typeof UserColors[keyof typeof UserColors]

/**
 * キャンバス描画ステータス
 */
export const drawStatus = ['stop', 'start', 'finish'] as const
export type DrawStatus = typeof drawStatus[number]
