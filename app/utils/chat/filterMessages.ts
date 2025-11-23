import { ChatMessage } from '@/app/api/types/chat/chat';

/**
 * 중복 메시지를 필터링합니다.
 * - 같은 ID를 가진 메시지는 하나만 표시
 * - 같은 senderId와 같은 내용의 연속된 메시지는 5초 이내면 제외
 */
export function filterDuplicateMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages.filter((message, index, array) => {
    // 같은 ID를 가진 메시지는 하나만 표시 (음수 ID는 임시 메시지이므로 제외)
    if (message.id > 0) {
      const firstIndex = array.findIndex((msg) => msg.id === message.id && msg.id > 0);
      if (firstIndex !== index) {
        return false;
      }
    }
    
    // 같은 senderId와 같은 내용의 연속된 메시지 필터링
    if (index === 0) return true;
    const prevMessage = array[index - 1];
    
    if (
      prevMessage.senderId === message.senderId &&
      prevMessage.content === message.content
    ) {
      const prevTime = new Date(prevMessage.sentAt).getTime();
      const currentTime = new Date(message.sentAt).getTime();
      const timeDiff = Math.abs(currentTime - prevTime);
      
      // 5초 이내의 중복 메시지는 제외
      return timeDiff >= 5000;
    }
    
    return true;
  });
}

