import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import classes from "./Photos.module.css";

function Photos() {
  const [photos, setPhotos] = useState([]);
  const [visiblePhotos, setVisiblePhotos] = useState(6);
  const [newPhoto, setNewPhoto] = useState({ title: "", url: "" });
  const [editPhotoId, setEditPhotoId] = useState(null);
  const [editPhotoData, setEditPhotoData] = useState({ title: "", url: "" });

  const { albumId, userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (albumId) fetchPhotos(albumId);
  }, [albumId]);

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
      body: JSON.stringify({ ...newPhoto, albumId: parseInt(albumId) }),
    });
    setNewPhoto({ title: "", url: "" });
    fetchPhotos(albumId);
  };

  const handleDeletePhoto = async (photoId) => {
    await fetch(`http://localhost:3000/photos/${photoId}`, {
      method: "DELETE",
    });
    fetchPhotos(albumId);
  };

  const handleEditPhoto = (photo) => {
    setEditPhotoId(photo.id);
    setEditPhotoData({ title: photo.title, url: photo.url });
  };

  const handleUpdatePhoto = async () => {
    await fetch(`http://localhost:3000/photos/${editPhotoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editPhotoData),
    });
    setEditPhotoId(null);
    fetchPhotos(albumId);
  };

  return (
    <div className={classes.container}>
      <h3>Photos for Album {albumId}</h3>

      <div className={classes.controls}>
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
        <button onClick={() => navigate(`/users/${userId}/albums`)}>Back to Albums</button>
      </div>

      <div className={classes.photoGrid}>
        {photos.slice(0, visiblePhotos).map((photo) => (
          <div key={photo.id} className={classes.photoCard}>
            {editPhotoId === photo.id ? (
              <>
                <input
                  type="text"
                  value={editPhotoData.title}
                  onChange={(e) =>
                    setEditPhotoData({ ...editPhotoData, title: e.target.value })
                  }
                />
                <input
                  type="text"
                  value={editPhotoData.url}
                  onChange={(e) =>
                    setEditPhotoData({ ...editPhotoData, url: e.target.value })
                  }
                />
                <button onClick={handleUpdatePhoto}>Save</button>
                <button onClick={() => setEditPhotoId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <img src={photo.url} alt={photo.title} />
                <p>{photo.title}</p>
                <button onClick={() => handleDeletePhoto(photo.id)}>Delete</button>
                <button onClick={() => handleEditPhoto(photo)}>Edit</button>
              </>
            )}
          </div>
        ))}
      </div>

      {visiblePhotos < photos.length && (
        <button
          onClick={() => setVisiblePhotos(visiblePhotos + 6)}
          className={classes.loadMore}
        >
          Load More
        </button>
      )}
    </div>
  );
}

export default Photos;
