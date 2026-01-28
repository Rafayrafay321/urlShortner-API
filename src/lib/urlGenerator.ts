export const generateUrl = (): string => {
  const characters = 'QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm';
  let shortUrl = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    shortUrl += characters.charAt(randomIndex);
  }
  return shortUrl;
};
