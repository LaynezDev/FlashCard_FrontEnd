export const compareStrings = (original, input) => {
    const s1 = original.toLowerCase().trim();
    const s2 = input.toLowerCase().trim();
    
    // Si son idénticos
    if (s1 === s2) return { score: 100, parts: [{ text: input, correct: true }] };

    const words1 = s1.split(' ');
    const words2 = s2.split(' ');
    
    let correctCount = 0;
    const parts = words2.map((word, i) => {
        const isCorrect = words1[i] === word;
        if (isCorrect) correctCount++;
        return { text: word, correct: isCorrect };
    });

    const score = Math.round((correctCount / words1.length) * 100);
    return { score, parts };
};