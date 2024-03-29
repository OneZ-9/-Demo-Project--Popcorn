import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMoviesFetch } from "./useMoviesFetch";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

/*
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

*/

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "5f14cc88";
const apiUrl = `http://www.omdbapi.com/?apikey=${KEY}`;
//  const queryParam1 = "";
// const queryParam2 = `2014`;

export default function App() {
  const [query, setQuery] = useState("");
  const [selectetMovieId, setSelectedMovieId] = useState(null);
  // const [watched, setWatched] = useState([]);
  const [watched, setWatched] = useLocalStorageState([], "watchedMovies");

  const { movies, isLoading, error } = useMoviesFetch(
    apiUrl,
    query,
    handleCloseMovie
  );

  function handleSelectMovie(id) {
    // id === selectetMovieId ? setSelectedMovieId(null) : setSelectedMovieId(id);
    setSelectedMovieId((selectedId) => (selectedId === id ? null : id));
  }

  function handleCloseMovie() {
    setSelectedMovieId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watchedMovies) => [...watchedMovies, movie]);

    // Store data as string key value pair in local browser storage.
    // use spread watched array to avoid stale state.Keep updated with existing watched movies list
    // localStorage.setItem("watchedMovies", JSON.stringify([...watched, movie]));
  }

  function handleDeleteWatched(id) {
    setWatched((watchedMovies) =>
      watchedMovies.filter((movie) => movie.imdbID !== id)
    );
  }

  // we use the useEffect hook to register an effect, which code that contains side effects (code which has connection with external from the component will lead infinite renders)
  // Side effects should not be in render logic, only inside eventHandles or in useEffects
  // Events triggered by events and useEffects triggered by rendering
  // This code execute when after this component mount (depends on dependancy array)
  // The exact moment at whitch the effect is executed actually depends on its Dependency array

  /* 
  useEffect(function () {
    console.log("After initial render");
  }, []);

  useEffect(function () {
    console.log("After every render");
  });

  useEffect(
    function () {
      console.log("After query state changed");
    },
    [query]
  );

  console.log("During render");
*/

  // Handled by Promise
  // useEffect(function () {
  //   fetch(`${apiUrl}${queryParam1}&${queryParam2}`)
  //     .then((res) => res.json())
  //     .then((data) => setMovies(data.Search));
  // }, []);

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}

          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
        </Box>

        <Box>
          {selectetMovieId ? (
            <SelectedMovieDetails
              selectetMovieId={selectetMovieId}
              onCloseMovie={handleCloseMovie}
              onAddWatchedMovie={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span> {message}
    </p>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;

    inputEl.current.focus();
    // console.log(inputEl.current);
    setQuery("");
  });

  // useEffect(
  //   function () {
  //     function callback(e) {
  //       if (e.code === "Enter") {
  //         if (document.activeElement === inputEl.current) return;

  //         inputEl.current.focus();
  //         // console.log(inputEl.current);
  //         setQuery("");
  //       }
  //     }
  //     document.addEventListener("keydown", callback);

  //     return () => {
  //       document.removeEventListener("keydown", callback);
  //     };
  //   },
  //   [setQuery]
  // );

  // How we do not select DOM elements in React
  // useEffect(function () {
  //   const el = document.querySelector(".search");

  //   el.focus();
  // }, []);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && children}
    </div>
  );
}

// function WachedBox() {
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && <></>}
//     </div>
//   );
// }

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function SelectedMovieDetails({
  selectetMovieId,
  onCloseMovie,
  onAddWatchedMovie,
  watched,
}) {
  const [detailedMovie, setDetailedMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const countRef = useRef(0);

  // We use useEffect due to we are not allowed to mutate ref in render logic
  // ref is like a box can hold any value
  useEffect(
    function () {
      if (userRating) countRef.current += 1;
    },
    [userRating]
  );

  const isAlreadyWatched = watched.find(
    (movie) => movie.imdbID === selectetMovieId
  );

  // const isAlreadyWatched = watched
  //   .map((movie) => movie.imdbID)
  //   .includes(selectetMovieId);

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectetMovieId
  )?.userRating;

  // destructuring the detailedMovie object which we set
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = detailedMovie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectetMovieId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    };

    onAddWatchedMovie(newWatchedMovie);
    onCloseMovie();
  }

  // We have to avoid conditional hooks and early returns can affect to the order of linked list of hooks
  // if (imdbRating > 8) [isTop, setIsTop] = useState(true);

  // if (imdbRating > 8) return <p>Greatest ever!</p>

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(`${apiUrl}&i=${selectetMovieId}`);

        const data = await res.json();
        setDetailedMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectetMovieId]
  );

  useKey("Escape", onCloseMovie);

  // Handle global keypress
  // useEffect(
  //   function () {
  //     // eventListner callback function
  //     function callback(e) {
  //       if (e.code === "Escape") {
  //         onCloseMovie();
  //         // console.log("Escape");
  //       }
  //     }

  //     document.addEventListener("keydown", callback);

  //     return function () {
  //       document.removeEventListener("keydown", callback);
  //     };
  //   },
  //   [onCloseMovie]
  // );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "Popcorn";
        console.log(`Clean up movie ${title}`);
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${detailedMovie}`} />

            <div className="details-overveiw">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isAlreadyWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />

                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to watched
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You already rated this movie! {watchedUserRating}
                  <span>⭐</span>
                </p>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>{" "}
        </>
      )}
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>

        <button
          className="btn-delete"
          onClick={() => onDeleteWatched(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}
