// Albums.jsx
import { useEffect, useState } from "react";
import Photos from "./Photos";
import classes from './Albums.module.css';
import { useParams, useNavigate } from "react-router-dom";


function Albums() {
  const [albums, setAlbums] = useState([]);
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("title");
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const { userId, albumId } = useParams();
  const activeUserId = parseInt(userId);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    const res = await fetch(`http://localhost:3000/albums`);
    const data = await res.json();
    setAlbums(data.filter(album => album.userId === activeUserId));
  };

  const handleSearch = () => {
    fetch(`http://localhost:3000/albums`)
      .then(res => res.json())
      .then(data => {
        const userAlbums = data.filter(album => album.userId === activeUserId);
        const filtered = userAlbums.filter(album => {
          const value = search.toLowerCase();
          if (searchField === "title") return album.title.toLowerCase().includes(value);
          if (searchField === "id") return album.id.toString() === value;
          return true;
        });
        setAlbums(filtered);
      });
  };

  const handleAddAlbum = async () => {
    if (!newAlbumTitle.trim()) return;

    const response = await fetch(`http://localhost:3000/albums`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        userId: activeUserId,
        title: newAlbumTitle        
      }),
    });

    if (!response.ok) {
      console.error("Failed to add album");
      return;
    }

    setNewAlbumTitle("");
    fetchAlbums(); // Reloads with new, clean album data
  };

  const handleDeleteAlbum = async (albumId) => {
    await fetch(`http://localhost:3000/albums/${albumId}`, {
      method: "DELETE",
    });
    setSelectedAlbum(null);
    fetchAlbums();
  };

  return (
    <div className={classes.container}>
      <h2>Albums</h2>
        <>
          <div className={classes.albumControls}>
            <input
              placeholder="New album title"
              value={newAlbumTitle}
              onChange={(e) => setNewAlbumTitle(e.target.value)}
            />
            <button onClick={handleAddAlbum}>Add Album</button>
          </div>

          <div>
            <select onChange={(e) => setSearchField(e.target.value)}>
              <option value="title">Title</option>
              <option value="id">ID</option>
            </select>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search albums..."
            />
            <button onClick={handleSearch}>Search</button>
          </div>

          <ul className={classes.albumList}>
            {albums.map((album) => (
              <li className={classes.albumItem} key={album.id}>
                <strong>{album.id}:</strong> {album.title}
                <button onClick={() => navigate(`/users/${userId}/albums/${album.id}/photos`)}>View Photos</button>
                <button onClick={() => handleDeleteAlbum(album.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
    </div>
  );
}

export default Albums;
