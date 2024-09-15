export interface Selection {
  start: number
  end: number
}

export type AttachmentType = 'image' | 'video' | 'audio'
export interface AttachmentData {
  start: number
  end: number
  type: AttachmentType
  uri: string
  height?: number
  width?: number
  colorPair: [string, string]
}
