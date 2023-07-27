import { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/Auth";
import { db } from "./config/firebase";
import { getDocs, collection } from "firebase/firestore";

interface Movie {
  id: string;
  title: string;
  releaseDate: number;
  receivedAnOscar: boolean;
}

function App() {
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const moviesCollectionRef = collection(db, "movies");

  useEffect(() => {
    const getMovieList = async () => {
      try {
        const data = await getDocs(moviesCollectionRef);
        const filteredData: Movie[] = data.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          releaseDate: doc.data().releaseDate,
          receivedAnOscar: doc.data().receivedAnOscar,
        }));
        setMovieList(filteredData);
        console.log(filteredData);
      } catch (err) {
        console.error(err);
      }
    };

    getMovieList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>Firebase Course</h1>
      <Auth />
      <div>
        {movieList.map((movie) => (
          <div key={movie.id}>
            <h1 style={{ color: movie.receivedAnOscar ? "green" : "red" }}>
              {movie.title}
            </h1>
            <p>Date: {movie.releaseDate}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
