// source
// https://www.caktusgroup.com/blog/2020/07/01/usekeypress-hook-react/

import { useState, useEffect } from "react";

function useKeypress(key, action) {
  useEffect(() => {
    // Ensure key is an array
    const keys = Array.isArray(key) ? key : [key];

    function onKeyup(e) {
      // Check if e.key is included in the keys array
      if (keys.includes(e.key)) action();
    }

    window.addEventListener("keyup", onKeyup);
    return () => window.removeEventListener("keyup", onKeyup);
  }, [key, action]);
}

export default useKeypress;
