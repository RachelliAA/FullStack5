import { useEffect, useState } from "react";

const activeUserId = 1;

function Albums() {
  const [albums, setAlbums] = useState([]);
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("title");
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [visiblePhotos, setVisiblePhotos] = useState(6);
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const [newPhoto, setNewPhoto] = useState({ title: "", url: "" });

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    const res = await fetch(`http://localhost:3000/albums`);
    const data = await res.json();
    setAlbums(data.filter(album => album.userId === activeUserId));
  };

  const fetchPhotos = async (albumId) => {
    const res = await fetch(`http://localhost:3000/photos?albumId=${albumId}`);
    const data = await res.json();
    setPhotos(data);
    setVisiblePhotos(6);
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

  const handleAddPhoto = async () => {
    if (!newPhoto.title || !newPhoto.url) return;
    await fetch(`http://localhost:3000/photos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newPhoto,
        albumId: selectedAlbum.id,
      }),
    });
    setNewPhoto({ title: "", url: "" });
    fetchPhotos(selectedAlbum.id);
  };

  const handleDeletePhoto = async (photoId) => {
    await fetch(`http://localhost:3000/photos/${photoId}`, {
      method: "DELETE",
    });
    fetchPhotos(selectedAlbum.id);
  };

  return (
    <div>
      <h2>Albums</h2>
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
            <button onClick={() => {
              setSelectedAlbum(album);
              fetchPhotos(album.id);
            }}>View Photos</button>
            <button onClick={() => handleDeleteAlbum(album.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {selectedAlbum && (
        <div>
          <h3>{selectedAlbum.title} - Photos</h3>

          <div>
            <input
              placeholder="Photo title"
              value={newPhoto.title}
              onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
            />
            <input
              placeholder="Photo URL"
              value={newPhoto.url}
              onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })}
            />
            <button onClick={handleAddPhoto}>Add Photo</button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
            {photos.slice(0, visiblePhotos).map((photo) => (
              <div key={photo.id}>
                <img src={photo.url} alt={photo.title} width="150" />
                <p>{photo.title}</p>
                <button onClick={() => handleDeletePhoto(photo.id)}>Delete</button>
              </div>
            ))}
          </div>

          {visiblePhotos < photos.length && (
            <button onClick={() => setVisiblePhotos(visiblePhotos + 6)}>Load More</button>
          )}
        </div>
      )}
    </div>
  );
}



export default Albums;