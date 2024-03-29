import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    // console.log(storedValue);
    return storedValue ? JSON.parse(storedValue) : initialState;

    // This function cannot recieve any arguments should be a pure function
    // When the initial render, React will set the state with return value of this function
    // This function only executed once on initial render and will ingored in subsequent re-renders
    // We shouldnt call a function in useState and then it will call in every render, instead we should pass a function that React can call later
    // We have to use JSON.parse since data stored as strings
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));

      // We dont need to create new array as in eventHandler function because useEffect will execute once the watched state updated
      // Using useEffect also synchronized with watch state and it will automatically update stored values when watched state updates.
    },
    [value, key]
  );
  return [value, setValue];
}
