import React, { useEffect, useState } from 'react';

interface Episode {
  id: number;
  name: string;
  episode: string;
}

const getEpisodes = async (): Promise<Episode[]> => {
  const response = await fetch('https://rickandmortyapi.com/api/episode');
  const data = await response.json();
  return data.results;
};

interface Props {
  onSelect: (episodeId: number) => void;
}

const EpisodeList: React.FC<Props> = ({ onSelect }) => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<number | null>(null);

  useEffect(() => {
    getEpisodes().then((data) => {
      setEpisodes(data);
      if (data.length > 0 && !selectedEpisodeId) {
        const firstEpisodeId = data[0].id;
        setSelectedEpisodeId(firstEpisodeId);
        onSelect(firstEpisodeId);
      }
    });
  }, []);

  const handleEpisodeClick = (episodeId: number) => {
    setSelectedEpisodeId(episodeId);
    onSelect(episodeId);
  };

  return (
    <div className="col-md-3 bg-light p-3 overflow-auto" style={{height:"100vh"}}>
      <h1 className='text-center'>Episodes</h1>
      <ul className="list-group" style={{height:"100vh"}}>
        {episodes.length > 0 ? (
          episodes.map((episode) => (
            <li
              key={episode.id}
              className={`list-group-item list-group-item-action ${
                selectedEpisodeId === episode.id ? 'bg-primary text-white' : ''
              }`}
              onClick={() => handleEpisodeClick(episode.id)}
            >
              {episode.name} ({episode.episode})
            </li>
          ))
        ) : (
          <li className="list-group-item">No episodes found</li>
        )}
      </ul>
    </div>
  );
};

export default EpisodeList;
