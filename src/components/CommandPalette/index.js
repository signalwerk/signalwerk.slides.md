import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";

const CommandPaletteContext = createContext(null);

let nextCommandId = 0;

function formatKey(k) {
  if (k === "ArrowRight") return "→";
  if (k === "ArrowLeft") return "←";
  if (k === "ArrowUp") return "↑";
  if (k === "ArrowDown") return "↓";
  if (k === "PageDown") return "PgDn";
  if (k === "PageUp") return "PgUp";
  if (k === "Escape") return "Esc";
  if (k === "Enter") return "↵";
  return k.length === 1 ? k.toUpperCase() : k;
}

function formatShortcut(shortcut) {
  if (!shortcut) return null;
  // Object form: { key, ctrl, meta, shift, alt }
  if (typeof shortcut === "object" && !Array.isArray(shortcut)) {
    const parts = [];
    if (shortcut.ctrl) parts.push("Ctrl");
    if (shortcut.meta) parts.push("Meta");
    if (shortcut.shift) parts.push("Shift");
    if (shortcut.alt) parts.push("Alt");
    parts.push(formatKey(shortcut.key));
    return parts.join("+");
  }
  const keys = Array.isArray(shortcut) ? shortcut : [shortcut];
  return keys.map(formatKey).join(" / ");
}

function matchesShortcut(shortcut, e) {
  // Object form: { key, ctrl, meta, shift, alt }
  if (typeof shortcut === "object" && !Array.isArray(shortcut)) {
    return (
      shortcut.key === e.key &&
      !!shortcut.ctrl === e.ctrlKey &&
      !!shortcut.meta === e.metaKey &&
      !!shortcut.shift === e.shiftKey &&
      !!shortcut.alt === e.altKey
    );
  }
  const keys = Array.isArray(shortcut) ? shortcut : [shortcut];
  return keys.includes(e.key);
}

function CommandPaletteUI({ commands, onClose }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);

  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setSelected(0);
  }, [search]);

  function handleKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => (s + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => (s - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selected]) {
        filtered[selected].action();
        onClose();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  }

  return (
    <div className="CommandPalette__overlay" onClick={onClose}>
      <div className="CommandPalette" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          className="CommandPalette__input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a command…"
        />
        <ul className="CommandPalette__list">
          {filtered.map((cmd, i) => (
            <li
              key={cmd.id}
              className={`CommandPalette__item${i === selected ? " CommandPalette__item--selected" : ""}`}
              onMouseEnter={() => setSelected(i)}
              onClick={() => {
                cmd.action();
                onClose();
              }}
            >
              <span className="CommandPalette__label">{cmd.label}</span>
              {cmd.shortcut && (
                <kbd className="CommandPalette__shortcut">
                  {formatShortcut(cmd.shortcut)}
                </kbd>
              )}
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="CommandPalette__empty">No commands found</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export function CommandPaletteProvider({ children }) {
  const [commands, setCommands] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Keep refs so the single keyup listener always sees the latest values
  const commandsRef = useRef(commands);
  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    commandsRef.current = commands;
  }, [commands]);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  const registerCommand = useCallback(({ label, shortcut, action }) => {
    const id = nextCommandId++;
    const command = { id, label, shortcut, action };
    setCommands((prev) => [...prev, command]);
    return () => setCommands((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Expose a global API for vanilla (non-React) components to register commands.
  // Dispatches 'commandPalette:ready' so modules that loaded before React can register.
  useEffect(() => {
    window.commandPalette = { registerCommand };
    window.dispatchEvent(new CustomEvent("commandPalette:ready"));
    return () => {
      window.commandPalette = null;
    };
  }, [registerCommand]);

  // Single central keyboard listener for all shortcuts
  useEffect(() => {
    function onKeyup(e) {
      // Open / close palette with Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        setIsOpen((prev) => !prev);
        return;
      }
      // When palette is open, let the palette UI handle keys
      if (isOpenRef.current) return;
      // Dispatch shortcut to the first matching registered command
      const cmd = commandsRef.current.find((cmd) => {
        if (!cmd.shortcut) return false;
        return matchesShortcut(cmd.shortcut, e);
      });
      if (cmd) cmd.action();
    }
    window.addEventListener("keyup", onKeyup);
    return () => window.removeEventListener("keyup", onKeyup);
  }, []);

  const handleClose = useCallback(() => setIsOpen(false), []);

  return (
    <CommandPaletteContext.Provider value={{ registerCommand }}>
      {children}
      {isOpen && <CommandPaletteUI commands={commands} onClose={handleClose} />}
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPalette() {
  return useContext(CommandPaletteContext);
}
