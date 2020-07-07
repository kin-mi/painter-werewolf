export namespace SystemMessage {
  export const INFO_FOR_A_GAME_START = 'ゲームを開始します。'
  export const INFO_FOR_P_YOUR_PAINTER = 'あなたは画家です。'
  /**
   * お題は ${answer} です。
   * @param {string} answer
   */
  export const INFO_FOR_P_ANSWER = (answer: string): string => {
    return `お題は ${answer} です。`
  }
  export const INFO_FOR_W_YOUR_WEREWOLF = 'あなたは人狼です。'
  export const INFO_FOR_A_YOUR_TURN = 'あなたの番です。'
  export const INFO_FOR_A_PAINT_END = '全員描き終わりました。'
  export const INFO_FOR_P_VOTE_START = '人狼と思う人に投票してください。'
  export const INFO_FOR_W_ANSWER_THEME_START = 'お題を回答してください。'
  export const INFO_FOR_A_ALL_VOTED = '投票が全て終了しました。'
  export const INFO_FOR_A_WIN_PAINTER = '画家陣営の勝ちです。'
  export const INFO_FOR_A_WIN_WEREWOLF = '人狼の勝ちです。'
}
