export interface ScriptConfig {
  id: string
  enabled: boolean
  async?: boolean
  defer?: boolean
  attributes?: Record<string, string>
  src: string
}

export const analyticsScripts: ScriptConfig[] = [
  {
    id: 'goatcounter',
    enabled: true,
    async: true,
    attributes: {
      'data-goatcounter': 'https://spriggan.goatcounter.com/count',
    },
    src: '//gc.zgo.at/count.js',
  },
]

