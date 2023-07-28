import { useEffect, useState, FC } from "react";
import { Auth } from "./components/Auth";
import { db, auth, storage } from "./config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import "./App.css";

interface Movie {
  title: string;
  releaseDate: number;
  receivedAnOscar: boolean;
  userId: string | null;
  id?: string; // id is optional because it doesn't exist when we create a new movie
}

const App: FC = () => {
  const [movieList, setMovieList] = useState<Movie[]>([]);

  const [newMovieTitle, setNewMovieTitle] = useState<string>("");
  const [newReleaseDate, setNewReleaseDate] = useState<number>(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState<boolean>(false);

  const [updatedTitle, setUpdatedTitle] = useState<string>("");

  const [fileUpload, setFileUpload] = useState<File | null>(null);

  const moviesCollectionRef = collection(db, "movies");

  const getMovieList = async () => {
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData: Movie[] = data.docs.map((doc) => ({
        ...(doc.data() as Movie), // Here you tell TypeScript that doc.data() is of type Movie
        id: doc.id,
      }));
      setMovieList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMovieList();
  }, []);

  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedAnOscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid,
      });
      getMovieList();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMovie = async (id: string) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
    getMovieList();
  };

  const updateMovieTitle = async (id: string) => {
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, { title: updatedTitle });
    getMovieList();
  };

  const uploadFile = async () => {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <Auth />

      <div>
        <input
          placeholder="Movie title..."
          onChange={(e) => setNewMovieTitle(e.target.value)}
        />
        <input
          placeholder="Release Date..."
          type="number"
          onChange={(e) => setNewReleaseDate(Number(e.target.value))}
        />
        <input
          type="checkbox"
          checked={isNewMovieOscar}
          onChange={(e) => setIsNewMovieOscar(e.target.checked)}
        />
        <label> Received an Oscar</label>
        <button onClick={onSubmitMovie}> Submit Movie</button>
      </div>
      <div>
        {movieList.map((movie) => (
          <div key={movie.id}>
            <h1 style={{ color: movie.receivedAnOscar ? "green" : "red" }}>
              {movie.title}
            </h1>
            <p> Date: {movie.releaseDate} </p>

            <button onClick={() => deleteMovie(movie.id || "")}>
              {" "}
              Delete Movie
            </button>

            <input
              placeholder="new title..."
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
            <button onClick={() => updateMovieTitle(movie.id || "")}>
              {" "}
              Update Title
            </button>
          </div>
        ))}
      </div>

      <div>
        <input
          type="file"
          onChange={(e) =>
            setFileUpload(e.target.files ? e.target.files[0] : null)
          }
        />
        <button onClick={uploadFile}> Upload File </button>
      </div>
    </div>
  );
};

export default App;
