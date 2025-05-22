// Albums.jsx
import { useEffect, useState } from "react";
import Photos from "./Photos";

//const activeUserId = 1;
import { useParams } from 'react-router-dom';



function Albums() {
  const [albums, setAlbums] = useState([]);
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("title");
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const { id } = useParams();
  const activeUserId = parseInt(id);

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
    await fetch(`http://localhost:3000/albums`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newAlbumTitle, userId: activeUserId }),
    });
    setNewAlbumTitle("");
    fetchAlbums();
  };

  const handleDeleteAlbum = async (albumId) => {
    await fetch(`http://localhost:3000/albums/${albumId}`, {
      method: "DELETE",
    });
    setSelectedAlbum(null);
    fetchAlbums();
  };

  return (
    <div>
      <h2>Albums</h2>

      {selectedAlbum ? (
        <Photos
          album={selectedAlbum}
          onBack={() => setSelectedAlbum(null)}
        />
      ) : (
        <>
          <div>
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

          <ul>
            {albums.map((album) => (
              <li key={album.id}>
                <strong>{album.id}:</strong> {album.title}
                <button onClick={() => setSelectedAlbum(album)}>View Photos</button>
                <button onClick={() => handleDeleteAlbum(album.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Albums;
