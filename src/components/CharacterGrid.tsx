import React, { useEffect, useState } from 'react';

interface Character {
  id: number;
  name: string;
  image: string;
}

interface Info {
  next: string | null;
  prev: string | null;
  pages: number; // Total pages
}

const CharacterGrid: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [info, setInfo] = useState<Info>({ next: null, prev: null, pages: 0 });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacters = async (url: string) => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch characters');
      }
      const data = await response.json();
      setCharacters(data.results);
      setInfo(data.info);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters(`https://rickandmortyapi.com/api/character?page=${currentPage}`);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= info.pages) {
      setCurrentPage(page);
    }
  };

  // Render pagination
  const renderPagination = () => {
    const pages = info.pages;
    let paginationItems: JSX.Element[] = [];

    // Determine the range of pages to display
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(pages, currentPage + 1);

    if (pages <= 3) {
      // If total pages are 3 or less, display all pages
      for (let i = 1; i <= pages; i++) {
        paginationItems.push(
          <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(i)}>
              {i}
            </button>
          </li>
        );
      }
    } else {
      // Add the first page
      paginationItems.push(
        <li key={1} className={`page-item ${currentPage === 1 ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(1)}>
            1
          </button>
        </li>
      );

      // Show the middle pages
      if (startPage > 2) {
        paginationItems.push(<li key="ellipsis-start" className="page-item disabled"><span className="page-link">...</span></li>);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        if (i > 1 && i < pages) { // Only show middle pages
          paginationItems.push(
            <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(i)}>
                {i}
              </button>
            </li>
          );
        }
      }

      // Add the last page
      if (endPage < pages) {
        paginationItems.push(<li key="ellipsis-end" className="page-item disabled"><span className="page-link">...</span></li>);
        paginationItems.push(
          <li key={pages} className={`page-item ${currentPage === pages ? 'active' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(pages)}>
              {pages}
            </button>
          </li>
        );
      }
    }

    return paginationItems;
  };

  return (
    <div className="col-md-9 col-sm-12 p-3" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Scrollable Character Grid */}
      <div className="row flex-grow-1 overflow-auto">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {characters.map((character) => (
          <div key={character.id} className="col-md-4 col-sm-6 mb-4">
            <div className="card">
              <img src={character.image} alt={character.name} className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">{character.name}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination fixed at the bottom */}
      <div className="mt-3">
        <nav aria-label="Page navigation" className="w-100">
          <ul className="pagination justify-content-center flex-wrap">
            {/* Previous Button */}
            <li className={`page-item ${!info.prev ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!info.prev}
                aria-label="Previous"
              >
                Previous
              </button>
            </li>

            {/* Render Pagination Items */}
            {renderPagination()}

            {/* Next Button */}
            <li className={`page-item ${!info.next ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!info.next}
                aria-label="Next"
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
