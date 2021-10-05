type CampaignType = 'Facebook' | 'ВКонтакте'

declare interface Campaign {
  type: CampaignType,
  uid: string,
  cabinet?: string
}