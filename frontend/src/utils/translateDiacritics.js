export const translateDiacritics = (text) => {
  const diacriticsMap = {
    ă: "a",
    â: "a",
    î: "i",
    ș: "s",
    ț: "t",
    Ă: "A",
    Â: "A",
    Î: "I",
    Ș: "S",
    Ț: "T",
    ţ: "t",
    ş: "s",
    Ţ: "T",
    Ş: "S",
  };

  return text.replace(
    /[ăâîșțĂÂÎȘȚţşŢŞ]/g,
    (match) => diacriticsMap[match] || match
  );
};
