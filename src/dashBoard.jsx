import React, { useMemo, useState, useEffect } from "react";
import { FixedSizeList as List } from "react-window";

export default function DashboardUI() {
  const products = useMemo(
    () =>
      Array.from({ length: 25000 }).map((_, i) => ({
        id: i + 1,
        name: `Product ${i + 1}`,
        subtitle: `Product ${i + 1}`,
        ok: (i + 1) % 2 === 0,
      })),
    []
  );

  const [count, setCount] = useState(0);
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(products);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!search.trim()) {
        setFiltered(products);
      } else {
        setFiltered(
          products.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
          )
        );
      }
    }, 1000);

    return () => clearTimeout(handler);
  }, [search, products]);

  const Row = ({ index, style }) => {
    const p = filtered[index];
    return (
      <div
        className="list-row"
        style={{
          ...style,
          top: style.top + 10,
          height: style.height - 10,
          paddingBottom: "10px",
        }}
        key={p.id}
      >
        <div className="list-txt">
          <div className="title">{p.name}</div>
          <div className="sub">{p.subtitle}</div>
        </div>
        <div className={`status ${p.ok ? "ok" : "bad"}`}>
          {p.ok ? <CheckIcon /> : <CloseIcon />}
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">Logo</div>
        <nav className="menu">
          <button className="menu-item active">Dashboard</button>
          <button className="menu-item">Status</button>
          <button className="menu-item">Reports</button>
          <button className="menu-item">Notification</button>
        </nav>
        <div className="logout">
          <button className="logout-btn">Logout ↪</button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <h1>Dashboard</h1>
          <div className="avatar">R</div>
        </header>

        <div className="grid">
          <section className="card list-card">
            <div className="card-head">
              <h2>List of Products</h2>
              <div className="search">
                <input
                  placeholder="Search Product…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button aria-label="search" className="icon-btn">
                  <SearchIcon />
                </button>
              </div>
            </div>
            {filtered.length > 0 ? (
              <List
                height={500}
                itemCount={filtered.length}
                itemSize={67}
                width="100%"
              >
                {Row}
              </List>
            ) : (
              <div
                style={{ padding: "20px", textAlign: "center", color: "#888" }}
              >
                No Products Found
              </div>
            )}
          </section>
          <div className="right-col">
            <section className="card counter-card">
              <h2>Counter with products</h2>
              <div className="counter">
                <button
                  className="square"
                  onClick={() => setCount((c) => Math.max(0, c - 1))}
                >
                  –
                </button>
                <div className="display">{count}</div>
                <button
                  className="square"
                  onClick={() => setCount((c) => c + 1)}
                >
                  +
                </button>
              </div>
              <div className="counter-grid">
                {[1, 2, 3].map((n) => (
                  <div className="counter-item" key={n}>
                    {n}
                  </div>
                ))}
              </div>
            </section>

            <section className="card details-card">
              <div className="card-head">
                <h2>Product Details</h2>
                <VirtualizedSelect
                  options={products.map((p) => p.name)}
                  value={selected}
                  onChange={(val) => setSelected(val)}
                />
              </div>
              <div className="details-blank">
                {selected ? `Details of ${selected}` : "Product Detail Card"}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function VirtualizedSelect({
  options,
  value,
  onChange,
  placeholder = "Select Product",
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setOpen(false);
  };

  const Row = ({ index, style }) => {
    const option = options[index];
    return (
      <div
        style={{
          ...style,
          padding: "8px 12px",
          background: option === value ? "#eef2ff" : "white",
          cursor: "pointer",
          borderBottom: "1px solid #eee",
        }}
        onClick={() => handleSelect(option)}
      >
        {option}
      </div>
    );
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div
        className="dropdown-trigger"
        style={{
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "white",
        }}
        onClick={() => setOpen((o) => !o)}
      >
        {value || placeholder}
        <ChevronIcon />
      </div>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            maxHeight: "300px",
            border: "1px solid #ccc",
            background: "white",
            zIndex: 1000,
          }}
        >
          <List
            height={300}
            itemCount={options.length}
            itemSize={40}
            width="100%"
          >
            {Row}
          </List>
        </div>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="M20 20L16.65 16.65"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 9l6 6 6-6"
        stroke="#9AA3B2"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
