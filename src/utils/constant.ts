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
  blue: '#09537C',
  green: '#677F58',
  orange: '#E39827',
  pink: '#D38B93',
  yellow: '#E1B453',
  skyblue: '#5C899D',
  gray: '#B1B0B7',
  brown: '#674129',
} as const
export type UserColors = typeof UserColors[keyof typeof UserColors]

/**
 * キャンバス描画ステータス
 */
export const drawStatus = ['stop', 'start', 'finish'] as const
export type DrawStatus = typeof drawStatus[number]

/**
 * アイコンファイル名
 */
export const IconFileName = [
  'icon_1.svg',
  'icon_2.svg',
  'icon_3.svg',
  'icon_4.svg',
  'icon_5.svg',
  'icon_6.svg',
  'icon_7.svg',
  'icon_8.svg',
  'icon_9.png',
] as const
