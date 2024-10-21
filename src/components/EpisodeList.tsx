
import React, { useEffect, useState } from 'react';
import { getEpisodes } from '../services/api';

interface Episode {
  id: number;
  name: string;
  episode: string;
}

interface Props {
  onSelect: (episodeId: number) => void;
}

const EpisodeList: React.FC<Props> = ({ onSelect }) => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<number | null>(null);

  const loadEpisodes = (url: string | null, pageNumber?: number) => {
    getEpisodes(url || undefined).then((data) => {
      setEpisodes(data.results);
      setNextPage(data.info.next);
      setPrevPage(data.info.prev);
      setTotalPages(data.info.pages);
      if (!selectedEpisodeId && data.results.length > 0) {
        const firstEpisodeId = data.results[0].id;
        setSelectedEpisodeId(firstEpisodeId);
        onSelect(firstEpisodeId);
      }
      if (pageNumber) setCurrentPage(pageNumber);
    });
  };

  useEffect(() => {
    loadEpisodes(null);
  }, []);

  const handleEpisodeClick = (episodeId: number) => {
    setSelectedEpisodeId(episodeId);
    onSelect(episodeId);
  };

  const handlePageClick = (pageNumber: number) => {
    const pageUrl = `https://rickandmortyapi.com/api/episode?page=${pageNumber}`;
    loadEpisodes(pageUrl, pageNumber);
  };

  return (
    <div className="col-md-3 col-sm-12 bg-light p-3" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <h1 className="text-center">Episodes</h1>
      <ul className="list-group flex-grow-1 overflow-auto">
        {episodes.map((episode) => (
          <li
            key={episode.id}
            className={`list-group-item list-group-item-action ${
              selectedEpisodeId === episode.id ? 'bg-primary text-white' : ''
            }`}
            onClick={() => handleEpisodeClick(episode.id)}
          >
            {episode.name} ({episode.episode})
          </li>
        ))}
      </ul>

      <div className="mt-3">
        <nav aria-label="Page navigation" className="w-100">
          <ul className="pagination justify-content-center flex-wrap">
            <li className={`page-item ${!prevPage ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => prevPage && loadEpisodes(prevPage, currentPage - 1)}
              >
                Previous
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageClick(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${!nextPage ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => nextPage && loadEpisodes(nextPage, currentPage + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default EpisodeList;
