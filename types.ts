export interface Selection {
  start: number
  end: number
}

export interface AttachmentData {
  start: number
  end: number
  uri: string
  colorPair: [string, string]
}
