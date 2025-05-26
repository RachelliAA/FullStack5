// Albums.jsx
import { useEffect, useState } from "react";
import Photos from "./Photos";
import classes from './Albums.module.css';
import { useParams, useNavigate } from "react-router-dom";


function Albums() {
  // state to hold all albums for the current user
  const [albums, setAlbums] = useState([]);

  // state for search bar input and selected field (title or id)
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("title");

  // input value for creating new album title
  const [newAlbumTitle, setNewAlbumTitle] = useState("");

  // grabbing userId from the URL
  const { userId } = useParams();
  //const activeUserId = parseInt(userId);// makes sure userId is a number
  const activeUserId = userId;
  const navigate = useNavigate();

  // when component mounts, load the albums
  useEffect(() => {
    // Replace Albums in history with Home
    window.history.replaceState(null, "", `/users/${userId}/albums`);
    fetchAlbums();
  }, []);

  // fetch albums from the server and only show ones that match this user
  const fetchAlbums = async () => {
    const res = await fetch(`http://localhost:3000/albums`);
    const data = await res.json();
    setAlbums(data.filter(album => album.userId === activeUserId));
  };

   // search logic, filters by title or id depending on the selected search field
  const handleSearch = () => {
    fetch(`http://localhost:3000/albums`)
      .then(res => res.json())
      .then(data => {
        const userAlbums = data.filter(album => album.userId === activeUserId);
          if (!search.trim()) {
            setAlbums(userAlbums);
            return;
          }
        const filtered = userAlbums.filter(album => {
          const value = search.toLowerCase();
          if (searchField === "title") return album.title.toLowerCase().includes(value);
          if (searchField === "id") return album.id.toString() === value;
          return true;
        });
        setAlbums(filtered);
      });
  };

   // This function fetches all albums and returns the next available numeric ID
  const getNextAlbumId = async () => {
    const res = await fetch(`http://localhost:3000/albums`);
    const data = await res.json();
    const ids = data.map((album) => album.id);
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    return maxId + 1;
  };

  // this function adds a new album to the db
  const handleAddAlbum = async () => {
    if (!newAlbumTitle.trim()) return;// Don't add empty albums

    const newId = await getNextAlbumId();
    if (!newId) return; // fail silently if fetching albums failed

    const response = await fetch(`http://localhost:3000/albums`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        userId: activeUserId,
        id: newId,
        title: newAlbumTitle        
      }),
    });

    if (!response.ok) {
      console.error("Failed to add album");
      return;
    }

    setNewAlbumTitle("");// Clear input after adding
    fetchAlbums();// Refresh the album list
  };

 const handleDeleteAlbum = async (albumId) => {
  try {
    // Step 1: Fetch all photos in this album
    const res = await fetch(`http://localhost:3000/photos?albumId=${albumId}`);
    const photos = await res.json();

    // Step 2: Delete each photo
    await Promise.all(
      photos.map(photo =>
        fetch(`http://localhost:3000/photos/${photo.id}`, {
          method: "DELETE",
        })
      )
    );

    // Step 3: Delete the album
    await fetch(`http://localhost:3000/albums/${albumId}`, {
      method: "DELETE",
    });

    // Step 4: Refresh albums list
    fetchAlbums();
  } catch (err) {
    console.error("Error deleting album and its photos:", err);
  }
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
                <div className={classes.buttonGroup}>
                  <button onClick={() => navigate(`/users/${userId}/albums/${album.id}/photos`)}>View Photos</button>
                  <button onClick={() => handleDeleteAlbum(album.id)}>Delete</button>
                </div>

              </li>
            ))}
          </ul>
        </>
    </div>
  );
}

export default Albums;
