// Photos.jsx
import { useEffect, useState } from "react";

function Photos({ album, onBack }) {
  const [photos, setPhotos] = useState([]);
  const [visiblePhotos, setVisiblePhotos] = useState(6);
  const [newPhoto, setNewPhoto] = useState({ title: "", url: "" });

  useEffect(() => {
    if (album?.id) {
      fetchPhotos(album.id);
    }
  }, [album]);

  const fetchPhotos = async (albumId) => {
    const res = await fetch(`http://localhost:3000/photos?albumId=${albumId}`);
    const data = await res.json();
    setPhotos(data);
    setVisiblePhotos(6);
  };

  const handleAddPhoto = async () => {
    if (!newPhoto.title || !newPhoto.url) return;
    await fetch(`http://localhost:3000/photos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newPhoto, albumId: album.id }),
    });
    setNewPhoto({ title: "", url: "" });
    fetchPhotos(album.id);
  };

  const handleDeletePhoto = async (photoId) => {
    await fetch(`http://localhost:3000/photos/${photoId}`, {
      method: "DELETE",
    });
    fetchPhotos(album.id);
  };

  return (
    <div>
      <h3>{album.title} - Photos</h3>

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
        <button onClick={onBack} style={{ marginLeft: '10px' }}>Back to Albums</button>
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
  );
}

export default Photos;
