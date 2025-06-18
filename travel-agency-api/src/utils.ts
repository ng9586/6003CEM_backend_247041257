const bannedWords = ['fuck', 'shit']; // 可擴充

export function containsBadWords(text: string): boolean {
  const lowerText = text.toLowerCase();
  return bannedWords.some(word => lowerText.includes(word));
}
