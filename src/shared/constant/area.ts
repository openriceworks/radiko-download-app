export const AreaDictionaly = {
  JP1: '北海道',
  JP2: '青森',
  JP3: '岩手',
  JP4: '宮城',
  JP5: '秋田',
  JP6: '山形',
  JP7: '福島',
  JP8: '茨城',
  JP9: '栃木',
  JP10: '群馬',
  JP11: '埼玉',
  JP12: '千葉',
  JP13: '東京',
  JP14: '神奈川',
  JP15: '新潟',
  JP16: '富山',
  JP17: '石川',
  JP18: '福井',
  JP19: '山梨',
  JP20: '長野',
  JP21: '岐阜',
  JP22: '静岡',
  JP23: '愛知',
  JP24: '三重',
  JP25: '滋賀',
  JP26: '京都',
  JP27: '大阪',
  JP28: '兵庫',
  JP29: '奈良',
  JP30: '和歌山',
  JP31: '鳥取',
  JP32: '島根',
  JP33: '岡山',
  JP34: '広島',
  JP35: '山口',
  JP36: '徳島',
  JP37: '香川',
  JP38: '愛媛',
  JP39: '高知',
  JP40: '福岡',
  JP41: '佐賀',
  JP42: '長崎',
  JP43: '熊本',
  JP44: '大分',
  JP45: '宮崎',
  JP46: '鹿児島',
  JP47: '沖縄'
} as const
export type AreaDictionaly = keyof typeof AreaDictionaly

export type AreaGroup =
  | '北海道・東北'
  | '関東'
  | '北陸・甲信越'
  | '中部'
  | '近畿'
  | '中国・四国'
  | '九州・沖縄'

export const GroupedAreaDictionary = {
  '北海道・東北': ['JP1', 'JP2', 'JP3', 'JP4', 'JP5', 'JP6', 'JP7'],
  関東: ['JP8', 'JP9', 'JP10', 'JP10', 'JP11', 'JP12', 'JP13', 'JP14'],
  '北陸・甲信越': ['JP15', 'JP19', 'JP20', 'JP17', 'JP16', 'JP18'],
  中部: ['JP23', 'JP21', 'JP22', 'JP24'],
  近畿: ['JP27', 'JP28', 'JP26', 'JP25', 'JP29', 'JP30'],
  '中国・四国': ['JP33', 'JP34', 'JP31', 'JP32', 'JP35', 'JP37', 'JP36', 'JP38', 'JP39'],
  '九州・沖縄': ['JP40', 'JP41', 'JP42', 'JP43', 'JP44', 'JP45', 'JP46', 'JP47']
} satisfies Record<AreaGroup, AreaDictionaly[]>
