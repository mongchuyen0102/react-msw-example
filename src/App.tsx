import './App.css';

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface Post {
  id: string;
  title: string;
  content: string;
  language: string;
  type: string;
  currencies: string[];
}

export const App = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = +(searchParams.get('page') || 1);
  const limit = +(searchParams.get('limit') || 10);
  const search = searchParams.get('s') || '';
  const type = searchParams.get('t') || '';

  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchQuery, setSearchQuery] = useState(search);
  const [typeQuery, setTypeQuery] = useState(type);
  const [currentPage, setCurrentPage] = useState(page);
  const [perPage, setPerPage] = useState(limit);

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, perPage, searchQuery, typeQuery]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('page', currentPage.toString());
    newSearchParams.set('limit', perPage.toString());
    newSearchParams.set('search', searchQuery);
    newSearchParams.set('type', typeQuery);

    navigate(`?${newSearchParams.toString()}`);
  }, [currentPage, perPage, searchQuery, typeQuery, navigate]);

  const fetchPosts = async () => {
    const response = await fetch(
      `/api/posts?page=${currentPage}&limit=${perPage}&s=${searchQuery}&t=${typeQuery}`
    );
    const data = await response.json();
    setPosts(data.posts);
    setTotalPosts(data.total);
  };

  const handleSearch = (event: any) => {
    setSearchQuery(event.target.value);
  };

  const handleType = (event: any) => {
    setTypeQuery(event.target.value);
  };

  const handlePagination = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search users"
        value={searchQuery}
        onChange={handleSearch}
        style={{ marginBottom: '1rem' }}
      />

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts.map((post: Post) => (
          <li key={post.id} style={{ marginBottom: '0.5rem' }}>
            {post.title}
          </li>
        ))}
      </ul>

      <div>
        {Array.from({ length: Math.ceil(totalPosts / perPage) }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePagination(index + 1)}
            disabled={currentPage === index + 1}
            style={{
              margin: '0.2rem',
              padding: '0.5rem 1rem',
              backgroundColor:
                currentPage === index + 1 ? 'lightblue' : 'white',
              borderRadius: '4px',
              border: '1px solid gray',
              cursor: 'pointer',
            }}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
