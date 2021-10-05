type MessageType = 'error' | 'warning' | 'success' | 'notification'

declare interface Message {
  type: MessageType
  message: string
}