

export const getEpisodes = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/episode`);
  const data = await response.json();
  return data.results;
};
  
  export const getCharacters = async (episodeId: number) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/episode/${episodeId}`);
    const data = await response.json();
    return data.characters;
  };