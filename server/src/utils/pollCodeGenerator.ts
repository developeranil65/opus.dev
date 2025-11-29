export const generatePollCode = (): string => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
  
    const getRandom = (str: string, length: number): string =>
      Array.from({ length }, () => str.charAt(Math.floor(Math.random() * str.length))).join('');
  
    const code = getRandom(letters, 2) + getRandom(digits, 4);
    return code;
};