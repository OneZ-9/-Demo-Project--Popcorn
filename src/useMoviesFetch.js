import { useEffect, useState } from "react";

export function useMoviesFetch(apiUrl, query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Handled by Async function
  useEffect(
    function () {
      //   callback?.(); // execute only if exists

      // Browser API
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(`${apiUrl}&s=${query}`, {
            signal: controller.signal,
          });
          if (!res.ok) throw new Error("Something went wrong");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
          setError("");

          // console.log(movies); stale state
          // console.log(data);   invalid search query => Response: "False"
          // setIsLoading(false);
        } catch (err) {
          // console.error(err.message);
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      //   handleCloseMovie(); // To close if any open movie before search
      fetchMovies();

      // will execute for each key stroke, with each rerender, abort the request
      return function () {
        controller.abort();
      };
    },
    [apiUrl, query]
  );
  return { movies, isLoading, error };
}
