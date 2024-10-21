
import React, { useState } from 'react';
import EpisodeList from './components/EpisodeList';
import CharacterGrid from './components/CharacterGrid';
import { getCharacters } from './services/api';

const App: React.FC = () => {
  const [characters, setCharacters] = useState<string[]>([]);

  const handleEpisodeSelect = async (episodeId: number) => {
    const characterUrls = await getCharacters(episodeId);
    setCharacters(characterUrls);
  };

  return (
    <div className="container-fluid">
      <div className="row p-3">
        <EpisodeList onSelect={handleEpisodeSelect} />
        <CharacterGrid characterUrls={characters} />
      </div>
    </div>
  );
};

export default App;
