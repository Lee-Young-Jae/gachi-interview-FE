export const addJosa = (word: string) => {
  const lastChar = word[word.length - 1];
  // 받침이 있는지 확인
  const isVowel = (lastChar.charCodeAt(0) - 44032) % 28 === 0;
  return isVowel ? `${word}는` : `${word}은`;
};
