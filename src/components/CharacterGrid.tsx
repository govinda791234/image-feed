
import React, { useEffect, useState } from 'react';

interface Character {
  id: number;
  name: string;
  image: string;
}

interface Info {
  next: number | null;  // Change type to number | null
  prev: number | null;  // Change type to number | null
  pages: number;
}

interface Props {
  selectedEpisode: number | null;
}

const CharacterGrid: React.FC<Props> = ({ selectedEpisode }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [info, setInfo] = useState<Info>({ next: null, prev: null, pages: 0 });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCharactersForEpisode = async (episodeId: number, page: number) => {
    try {
      setLoading(true);
      const response = await fetch(`https://rickandmortyapi.com/api/episode/${episodeId}`);
      const episodeData = await response.json();

      const characterData = await Promise.all(
        episodeData.characters.map((url: string) => fetch(url).then((res) => res.json()))
      );

      const charactersPerPage = 20;
      const paginatedCharacters = characterData.slice((page - 1) * charactersPerPage, page * charactersPerPage);
      setCharacters(paginatedCharacters);

      setInfo({
        next: page < Math.ceil(characterData.length / charactersPerPage) ? page + 1 : null,
        prev: page > 1 ? page - 1 : null,
        pages: Math.ceil(characterData.length / charactersPerPage),
      });
    } catch (error) {
      console.error('Error fetching characters:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEpisode) {
      setCurrentPage(1);
      fetchCharactersForEpisode(selectedEpisode, 1);
    }
  }, [selectedEpisode]);

  useEffect(() => {
    if (selectedEpisode) {
      fetchCharactersForEpisode(selectedEpisode, currentPage);
    }
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const renderPagination = () => {
    const pages = [];
    const totalPages = info.pages;

    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(i)}>{i}</button>
          </li>
        );
      }
    } else {
      pages.push(
        <li key={1} className={`page-item ${currentPage === 1 ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(1)}>1</button>
        </li>
      );

      if (currentPage > 2) {
        pages.push(<li key="start-ellipsis" className="page-item disabled"><span className="page-link">...</span></li>);
      }

      if (currentPage > 1 && currentPage < totalPages) {
        pages.push(
          <li key={currentPage} className="page-item active">
            <button className="page-link">{currentPage}</button>
          </li>
        );

        if (currentPage + 1 < totalPages) {
          pages.push(
            <li key={currentPage + 1} className="page-item">
              <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                {currentPage + 1}
              </button>
            </li>
          );
        }
      }

      if (currentPage + 1 < totalPages - 1) {
        pages.push(<li key="end-ellipsis" className="page-item disabled"><span className="page-link">...</span></li>);
      }

      pages.push(
        <li key={totalPages} className={`page-item ${currentPage === totalPages ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
        </li>
      );
    }

    return pages;
  };

  return (
    <div className="col-md-9 col-sm-12 overflow-auto" style={{height:"100vh"}}>
      {loading ? (
        <div>Loading...</div>
      ) : characters.length > 0 ? (
        <div className="row flex-grow-1 overflow-auto">
          {characters.map((character) => (
            <div key={character.id} className="col-md-4 col-sm-6 col-xs-12 mb-4">
              <div className="card">
                <img src={character.image} alt={character.name} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">{character.name}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No characters found</div>
      )}

      <div className="mt-3">
        <nav aria-label="Page navigation" className="w-100">
          <ul className="pagination justify-content-center flex-wrap">
            {/* Previous Button */}
            <li className={`page-item ${!info.prev ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!info.prev}
              >
                Previous
              </button>
            </li>

            {renderPagination()}

            <li className={`page-item ${!info.next ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!info.next}
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

export default CharacterGrid;
