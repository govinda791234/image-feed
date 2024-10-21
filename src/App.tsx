import React, { useState } from 'react';
import EpisodeList from './components/EpisodeList';
import CharacterGrid from './components/CharacterGrid';

const App: React.FC = () => {
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const handleEpisodeSelect = (episodeId: number) => {
    setSelectedEpisode(episodeId);
  };

  return (
    <div className="container-fluid">
      <div className="row  p-4">
        <EpisodeList onSelect={handleEpisodeSelect} />
        <CharacterGrid selectedEpisode={selectedEpisode} />
      </div>
    </div>
  );
};

export default App;
