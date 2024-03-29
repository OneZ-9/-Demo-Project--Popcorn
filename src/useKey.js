import { useEffect } from "react";

export function useKey(key, action) {
  useEffect(
    function () {
      // eventListner callback function
      function callback(e) {
        if (e.code.toLowerCase() === key.toLowerCase()) {
          action();
          // console.log("Escape");
        }
      }

      document.addEventListener("keydown", callback);

      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [action, key]
  );
}
