interface AddJosa {
  (word: string, josa?: "을/를" | "이/가" | "은/는" | "으로/로"): string;
}

export const addJosa: AddJosa = (word: string, josa: string = "을/를"): string => {
  const lastChar = word[word.length - 1];
  // 받침이 있는지 확인
  const isVowel = (lastChar.charCodeAt(0) - 44032) % 28 === 0;

  if (josa === "을/를") {
    return isVowel ? `${word}을` : `${word}를`;
  }

  if (josa === "이/가") {
    return isVowel ? `${word}이` : `${word}가`;
  }

  if (josa === "은/는") {
    return isVowel ? `${word}은` : `${word}는`;
  }

  if (josa === "으로/로") {
    return isVowel ? `${word}으로` : `${word}로`;
  }

  return isVowel ? `${word}을` : `${word}를`;
};
