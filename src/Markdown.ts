export function isInLink(text: string, offset: number): boolean {
  const end = text.length;

  // Look for the ](
  for (let i = offset; i <= end; i++) {
    if (text[i] === "]") {
      if (text[i + 1] === "(") {
        return true;
      }

      return false;
    }
  }

  return false;
}
