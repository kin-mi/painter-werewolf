export const ThemeMap = {
  色: [
    {
      theme: '赤いもの',
      answer: [
        'トマト',
        'ポスト',
        '血',
        'りんご',
        'とうがらし',
        'いちご',
        'りんご',
        'さくらんぼ',
        'ワイン',
        'てんとう虫',
        '消防車',
        '鳥居',
        '東京タワー',
        'レッドカード',
      ],
    },
    {
      theme: '黒いもの',
      answer: [
        '黒ごま',
        'アリ',
        'カラス',
        'タイヤ',
        'ひじき',
        'ゴキブリ',
        'コーラ',
        'イカスミ',
        'コーヒー',
        'カブトムシ',
      ],
    },
    {
      theme: '黄色いもの',
      answer: [
        'バナナ',
        'レモン',
        'からし',
        'ピカチュウ',
        'プーさん',
        'シンプソンズ',
        'ひまわり',
        'イチョウ',
        'たんぽぽ',
        'パイナップル',
        'とうもろこし',
        'イエローカード',
      ],
    },
  ],
  地名: [
    {
      theme: '国',
      answer: [
        'イタリア',
        'ブラジル',
        '日本',
        'アメリカ',
        'ロシア',
        '韓国',
        '中国',
        'フランス',
      ],
    },
    {
      theme: '都道府県',
      answer: ['東京', '大阪', '京都', '北海道', '沖縄', '福岡'],
    },
  ],
  スポーツ: [
    {
      theme: 'スポーツ',
      answer: [
        '相撲',
        'サッカー',
        'テニス',
        '野球',
        'ラグビー',
        'ボクシング',
        'バレーボール',
        'バスケ',
        '卓球',
        'ゴルフ',
        'マラソン',
        '水泳',
        'フェンシング',
      ],
    },
  ],
  飲食: [
    {
      theme: '料理',
      answer: [
        'ラーメン',
        '焼き肉',
        '餃子',
        'ハンバーガー',
        'カレー',
        'ピザ',
        '寿司',
        '北京ダック',
        '唐揚げ',
      ],
    },
    {
      theme: '飲食店',
      answer: [
        'ガスト',
        'スター・バックス',
        'マクドナルド',
        '吉野家',
        'ミスド',
        'ココイチ',
        '餃子の王将',
        '長崎ちゃんぽん',
      ],
    },
  ],
  '童話・アニメ・ゲーム': [
    {
      theme: 'アニメ',
      answer: [
        'ポケモン',
        'ドラえもん',
        'アンパンマン',
        'サザエさん',
        'コナン',
        'ドラゴンボール',
        'アラジン',
        'トイストーリー',
        'となりのトトロ',
        '魔女の宅急便',
        'もののけ姫',
        '千と千尋の神隠し',
        'モンスターズ・インク',
      ],
    },
    {
      theme: '童話',
      answer: [
        '白雪姫',
        '桃太郎',
        '浦島太郎',
        'シンデレラ',
        'ピノキオ',
        '３びきのこぶた',
        '鶴の恩返し',
        'かぐや姫',
        '赤ずきん',
      ],
    },
    {
      theme: 'アプリ・ゲーム',
      answer: [
        'マリオ',
        'テトリス',
        'ぷよぷよ',
        'カービィ',
        'ポケモン',
        'ボンバーマン',
        'ツムツム',
        'パズドラ',
        'モンスト',
      ],
    },
  ],
  生き物: [
    {
      theme: '昆虫',
      answer: [
        'バッタ',
        'カブトムシ',
        'クワガタ',
        'アリ',
        'カマキリ',
        'セミ',
        'ムカデ',
        'トンボ',
        'てんとう虫',
        'ホタル',
      ],
    },
    {
      theme: '動物',
      answer: [
        '牛',
        '馬',
        'キリン',
        'クジラ',
        '犬',
        '猫',
        'ねずみ',
        'ラクダ',
        'ワニ',
        'ライオン',
        'ペンギン',
        'ゾウ',
        'パンダ',
      ],
    },
  ],
  食材: [
    {
      theme: 'フルーツ',
      answer: [
        'いちご',
        'みかん',
        'りんご',
        'ぶどう',
        'キウイ',
        'バナナ',
        'パイナップル',
        '桃',
        'メロン',
        '柿',
      ],
    },
    {
      theme: '野菜',
      answer: [
        'キャベツ',
        'もやし',
        'トマト',
        'ナス',
        'きゅうり',
        'とうもろこし',
        '白菜',
        'ネギ',
        'じゃがいも',
        '大根',
        'ブロッコリー',
      ],
    },
  ],
  乗り物: [
    {
      theme: '乗り物',
      answer: [
        '飛行機',
        '電車',
        '車',
        '自転車',
        '一輪車',
        'バス',
        '三輪車',
        '船',
        'カヌー',
      ],
    },
  ],
  職業: [
    {
      theme: '職業',
      answer: [
        '医師',
        'プログラマー',
        '教師',
        '弁護士',
        '歌手',
        '画家',
        '警察官',
        '消防士',
        '美容師',
        'YouTuber',
      ],
    },
  ],
} as const
export type Categories = keyof typeof ThemeMap
export type Themes<T extends Categories> = typeof ThemeMap[T][number]['theme']
export type ThemeMap = Readonly<{
  [key: string]: readonly { theme: string; answer: readonly string[] }[]
}>
