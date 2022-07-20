// source
// https://www.caktusgroup.com/blog/2020/07/01/usekeypress-hook-react/

import { useState, useEffect } from "react";

function useKeypress(key, action) {
  useEffect(() => {
    function onKeyup(e) {
      if (e.key === key) action();
    }
    window.addEventListener("keyup", onKeyup);
    return () => window.removeEventListener("keyup", onKeyup);
  }, []);
}

export default useKeypress;
