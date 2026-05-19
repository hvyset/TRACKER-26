import { useState, useEffect, useRef } from "react";

const FONT = "'Times New Roman', Times, serif";
const SF = { fontFamily: FONT };

if (typeof document !== "undefined") {
  const s = document.createElement("style");
  s.textContent = `* { font-family: ${FONT} !important; box-sizing: border-box; } input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }`;
  document.head.appendChild(s);
}

const C = {
  bg: "#FFFFFF", ink: "#000000", faint: "#777777",
  yellow: "#F0E040", green: "#2A5C45", red: "#9B2B1A",
};

const MONTHS_S = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTHS_L = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const SLICE_C  = ["#000000","#2A5C45","#8C6A10","#9B2B1A","#5A4A3A","#3A5A6C","#6C3A5A","#4A5A3A"];
const ACC_C    = ["#000000","#2A5C45","#777777","#9B2B1A","#8C6A10","#3A5A6C"];
const BANKS    = ["NAB","UBank","Commonwealth","Westpac","ANZ","Other"];

const DEF_ACCOUNTS = [
  { id: "everyday", name: "Everyday", bank: "NAB",   color: "#000000" },
  { id: "savings",  name: "Savings",  bank: "UBank", color: "#2A5C45" },
  { id: "bills",    name: "Bills",    bank: "NAB",   color: "#777777" },
];
const DEF_INC = [
  { id: "salary", name: "Salary",      budget: 0 },
  { id: "side",   name: "Side Income", budget: 0 },
  { id: "other_i",name: "Other",       budget: 0 },
];
const DEF_EXP = [
  { id: "rent",   name: "Rent",          budget: 1800 },
  { id: "grocer", name: "Groceries",     budget: 300  },
  { id: "trans",  name: "Transport",     budget: 150  },
  { id: "subs",   name: "Subscriptions", budget: 80   },
  { id: "dining", name: "Dining",        budget: 200  },
  { id: "health", name: "Health",        budget: 100  },
  { id: "cloth",  name: "Clothing",      budget: 100  },
  { id: "other_e",name: "Other",         budget: 150  },
];

// ── Quotes ────────────────────────────────────────────────────────────────────
const RAW_QUOTES = [
  // Carl Jung
  { text: "Until you make the unconscious conscious, it will direct your life and you will call it fate.", author: "carl jung", ascii: "    .  *  .\n  *  ( )  *\n   __|_|__\n  /  |||  \\\n /   |||   \\" },
  { text: "The privilege of a lifetime is to become who you truly are.", author: "carl jung", ascii: "  ~~~~~\n ~ *** ~\n~  * *  ~\n ~ *** ~\n  ~~~~~" },
  { text: "A man who has not passed through the inferno of his passions has never overcome them.", author: "carl jung", ascii: "  ^ ^ ^\n / / /\n| | |\n \\ \\ \\\n  v v v" },
  { text: "Knowing your own darkness is the best method for dealing with the darknesses of other people.", author: "carl jung", ascii: "  ( )\n   |\n  dark" },
  { text: "Who looks outside, dreams; who looks inside, awakes.", author: "carl jung", ascii: "  o---o\n  |   |\n  o---o\n  eyes" },
  { text: "Everything that irritates us about others can lead us to an understanding of ourselves.", author: "carl jung", ascii: " mirror\n  [   ]\n  |   |\n  [   ]" },
  { text: "The most terrifying thing is to accept oneself completely.", author: "carl jung", ascii: "   O\n  /|\\\n  / \\\n  you" },
  { text: "Show me a sane man and I will cure him for you.", author: "carl jung", ascii: "  +---+\n  | ? |\n  +---+" },
  { text: "Loneliness does not come from having no people around, but from being unable to communicate the things that seem important to oneself.", author: "carl jung", ascii: "  . . .\n   alone\n  . . ." },
  { text: "We cannot change anything unless we accept it.", author: "carl jung", ascii: "  >---<\n accept\n  >---<" },

  // Michel Foucault
  { text: "Where there is power, there is resistance.", author: "michel foucault", ascii: "  |   |\n--+---+--\n  |   |" },
  { text: "Power is not an institution, not a structure; it is a certain strength we are endowed with.", author: "michel foucault", ascii: "[=========]\n|  power  |\n[=========]" },
  { text: "I don't feel that it is necessary to know exactly what I am. The main interest in life and work is to become someone that you were not in the beginning.", author: "michel foucault", ascii: "  ?-->!\n become" },
  { text: "The soul is the prison of the body.", author: "michel foucault", ascii: "  [===]\n  | o |\n  [===]\n  bars" },
  { text: "People know what they do; frequently they know why they do what they do; but what they don't know is what what they do does.", author: "michel foucault", ascii: "  act\n   |\n  ???" },
  { text: "Madness is the absence of a work.", author: "michel foucault", ascii: "  ___\n |   |\n |___|\n empty" },
  { text: "Knowledge is not made for understanding; it is made for cutting.", author: "michel foucault", ascii: "  ---/---\n  blade" },
  { text: "The strategic adversary is fascism... the fascism in us all, in our heads and in our everyday behavior.", author: "michel foucault", ascii: "  ! ! !\n  beware" },

  // Fedor Emelianenko
  { text: "Everyone has a plan until they get punched in the mouth.", author: "fedor emelianenko", ascii: "   O\n  /|\\\n  / \\" },
  { text: "I fight not to win titles or trophies. I fight to defend what is right and just.", author: "fedor emelianenko", ascii: "  [fist]\n   ( )\n  honor" },
  { text: "Fear is just an emotion. You can use it or it can use you.", author: "fedor emelianenko", ascii: "  >---<\n  fear\n  >---<" },
  { text: "Strength is not in the body, it is in the soul.", author: "fedor emelianenko", ascii: "  O\n /|\\\n / \\\n  soul" },
  { text: "Every fight is a new lesson.", author: "fedor emelianenko", ascii: "  +-+\n  |?|\n  +-+\n learn" },

  // Plato
  { text: "The unexamined life is not worth living.", author: "plato", ascii: "   ___\n  /   \\\n | o o |\n  \\ ^ /\n  think" },
  { text: "Only the dead have seen the end of war.", author: "plato", ascii: "  . . . . .\n.           .\n  . . . . ." },
  { text: "Wise men speak because they have something to say; fools because they have to say something.", author: "plato", ascii: "  mouth\n  ----- \n  words" },
  { text: "Be kind, for everyone you meet is fighting a harder battle.", author: "plato", ascii: "  o - o\n  | + |\n  o - o" },
  { text: "At the touch of love everyone becomes a poet.", author: "plato", ascii: "  ~heart~\n   /   \\\n  words" },
  { text: "Courage is knowing what not to fear.", author: "plato", ascii: "  ( ! )\n  brave" },
  { text: "The measure of a man is what he does with power.", author: "plato", ascii: "  [===]\n  power\n  |   |" },
  { text: "Every heart sings a song, incomplete, until another heart whispers back.", author: "plato", ascii: "  ♩ . ♩\n  notes" },

  // St. Charbel
  { text: "He who humbles himself will be exalted.", author: "st. charbel", ascii: "    +\n   /|\\\n  / | \\\n    |\n   / \\" },
  { text: "Silence is the language of God; all else is poor translation.", author: "st. charbel", ascii: "   . . .\n  .     .\n .   +   .\n  .     ." },
  { text: "Prayer is the lifting of the mind and heart to God.", author: "st. charbel", ascii: "    +\n   /\n  ^\n heart" },
  { text: "Do not be afraid of the cross, for the cross carried willingly becomes light.", author: "st. charbel", ascii: "    +\n    |\n  --+--\n    |" },
  { text: "The soul that trusts in God lacks nothing.", author: "st. charbel", ascii: "  ( + )\n  trust" },
  { text: "In silence, God speaks.", author: "st. charbel", ascii: "  . . .\n    +\n  . . ." },

  // Karl Marx
  { text: "The history of all hitherto existing society is the history of class struggles.", author: "karl marx", ascii: "  ______\n /      \\\n| worker |\n \\______/" },
  { text: "From each according to his ability, to each according to his needs.", author: "karl marx", ascii: "  o   o   o\n  |   |   |\n /|\\ /|\\ /|\\" },
  { text: "Workers of the world, unite. You have nothing to lose but your chains.", author: "karl marx", ascii: "  o-o-o-o\n  chains\n  break" },
  { text: "Religion is the opium of the people.", author: "karl marx", ascii: "  ( zzz )\n  opium" },
  { text: "The philosophers have only interpreted the world. The point is to change it.", author: "karl marx", ascii: "  think?\n    |\n   ACT" },
  { text: "Capital is dead labour, which, vampire-like, lives only by sucking living labour.", author: "karl marx", ascii: "  $-$-$\n  drain" },
  { text: "The oppressed are allowed once every few years to decide which particular representatives of the oppressing class shall represent them.", author: "karl marx", ascii: "  [vote]\n   box\n  same" },

  // Audre Lorde
  { text: "It is not our differences that divide us. It is our inability to recognise, accept, and celebrate those differences.", author: "audre lorde", ascii: "   * * *\n  * o o *\n *  |||  *" },
  { text: "Your silence will not protect you.", author: "audre lorde", ascii: "  ~~~~~~\n ~ speak~\n  ~~~~~~\n     |" },
  { text: "I am not free while any woman is unfree, even when her shackles are very different from my own.", author: "audre lorde", ascii: "  o - o\n  |   |\n  o - o" },
  { text: "Caring for myself is not self-indulgence, it is self-preservation, and that is an act of political warfare.", author: "audre lorde", ascii: "  self\n  care\n  [ * ]" },
  { text: "I am deliberate and afraid of nothing.", author: "audre lorde", ascii: "  ---->\n  ahead" },
  { text: "It is better to speak remembering we were never meant to survive.", author: "audre lorde", ascii: "  still\n  here\n  . . ." },
  { text: "When I dare to be powerful, to use my strength in service of my vision, then it becomes less and less important whether I am afraid.", author: "audre lorde", ascii: "  ^^^\n power\n  | |" },
  { text: "The master's tools will never dismantle the master's house.", author: "audre lorde", ascii: "  [===]\n  tools\n  break?" },

  // Clarence
  { text: "Hear me out. What if we just... did nothing about it?", author: "clarence", ascii: "  ( o o )\n   \\___/\n  [_____]" },
  { text: "I just want everyone to have fun and no one to get hurt.", author: "clarence", ascii: "  smile\n  (   )\n  happy" },
  { text: "Dude, being alive is pretty great.", author: "clarence", ascii: "  \\o/\n   |\n  / \\" },

  // Jake the Dog
  { text: "Dude, sucking at something is the first step to being sort of good at something.", author: "jake the dog", ascii: "  /\_/\\\n ( ^ ^ )\n  > * <" },
  { text: "Homies help homies. Always.", author: "jake the dog", ascii: "  o---o\n  help\n  o---o" },
  { text: "If you want to get a girl, you gotta stretch first.", author: "jake the dog", ascii: " stretch\n  ~~~~\n  jake" },
  { text: "Mathematical!", author: "jake the dog", ascii: "  math!\n  !!!" },
  { text: "The real you is the you that you are when no one's watching.", author: "jake the dog", ascii: "  ( ? )\n  real\n   you" },

  // BMO
  { text: "I am a robot. I am not programmed to feel. ...Just kidding, I feel everything.", author: "bmo", ascii: "  +-----+\n  | o  o |\n  |  __  |\n  +-----+" },
  { text: "Who wants to play video games?", author: "bmo", ascii: "  [play]\n  >   <\n  games" },
  { text: "I will be your guardian and protect you from harm.", author: "bmo", ascii: "  [===]\n  guard\n  [===]" },
  { text: "BMO is the master of solo adventure.", author: "bmo", ascii: "  +---+\n  |bmo|\n  +---+\n  solo" },

  // Skips
  { text: "I do not need to be motivated by anything other than the fact that I exist.", author: "skips", ascii: "  O\n /|\\\n / \\" },
  { text: "I've dealt with this before. I know what to do.", author: "skips", ascii: "  been\n  here\n  done" },
  { text: "Just skip it.", author: "skips", ascii: "  -->\n skip" },

  // Muscle Man
  { text: "I'm not lame. You're lame.", author: "muscle man", ascii: "  O\n )||(\n  ||\n BEEFY" },
  { text: "You know who else does that? My mom!", author: "muscle man", ascii: "  MOM\n  ---\n  lol" },
  { text: "Woooooo!", author: "muscle man", ascii: "  \\o/\n wooo" },

  // Finn the Human
  { text: "I'm gonna fight for my friends and for what's right. That's all I know.", author: "finn the human", ascii: "  /\\___/\\\n (  o o  )\n  \_____/" },
  { text: "Don't you always tell me to be myself?", author: "finn the human", ascii: "  be\n  you\n  ---" },
  { text: "Adventure is out there.", author: "finn the human", ascii: "  --->\n  quest\n  !!!!" },
  { text: "I'm Finn the Human and I have no weakness.", author: "finn the human", ascii: "  FINN\n  ----\n  hero" },

  // Nacho Libre
  { text: "I am the gatekeeper of my own destiny and I will have my glory day in the hot sun.", author: "nacho libre", ascii: "  /\\ /\\\n ( mask )\n  \\___/\n  LUCHA" },
  { text: "Beneath this mask there is more than flesh. There is an idea.", author: "nacho libre", ascii: "  [mask]\n   idea\n  ----" },
  { text: "Get that corn out of my face!", author: "nacho libre", ascii: "  corn\n  !!!\n  OUT" },
  { text: "I have had diarrhea since Easters.", author: "nacho libre", ascii: "  ...\n  tmi\n  ..." },
  { text: "I want the glory!", author: "nacho libre", ascii: "  GLORY\n  !!!\n  \\o/" },
];

// Shuffle on load so quotes appear in random order
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const QUOTES = shuffleArray(RAW_QUOTES);

function uid() { return Math.random().toString(36).slice(2, 9); }

function useLS(key, init) {
  const [v, setV] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; }
    catch { return init; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, setV];
}

function aud(n) {
  if (n == null || isNaN(n)) return "—";
  const s = Math.abs(n).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (n < 0 ? "−" : "") + "$" + s;
}

// ── Pie ───────────────────────────────────────────────────────────────────────
function Pie({ slices, size = 140 }) {
  const total = slices.reduce((a, s) => a + s.value, 0);
  if (!total) return (
    <div style={{ width: size, height: size, borderRadius: "50%", border: "1px solid #000", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontSize: 9, color: C.faint }}>no data</span>
    </div>
  );
  let cum = 0;
  const cx = size / 2, cy = size / 2, r = size / 2 - 2;
  return (
    <svg width={size} height={size} style={{ display: "block", margin: "0 auto" }}>
      {slices.map(sl => {
        const s = (cum / total) * Math.PI * 2 - Math.PI / 2;
        cum += sl.value;
        const e = (cum / total) * Math.PI * 2 - Math.PI / 2;
        const lg = e - s > Math.PI ? 1 : 0;
        return <path key={sl.id} d={`M${cx},${cy} L${cx+r*Math.cos(s)},${cy+r*Math.sin(s)} A${r},${r} 0 ${lg},1 ${cx+r*Math.cos(e)},${cy+r*Math.sin(e)} Z`} fill={sl.color} stroke="#FFFFFF" strokeWidth="1.5" />;
      })}
      <circle cx={cx} cy={cy} r={r * 0.4} fill="#FFFFFF" />
    </svg>
  );
}

// ── Atoms ─────────────────────────────────────────────────────────────────────
// Frame: single border, label floats inside at top, no dividing line
function Frame({ label, sublabel, children, mb = 40 }) {
  return (
    <div style={{ border: "1px solid #000000", marginBottom: mb, padding: "28px 26px" }}>
      {label && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <span style={{ fontSize: 9, color: C.faint, letterSpacing: "0.1em" }}>{label}</span>
          {sublabel && <span style={{ fontSize: 9, color: C.faint }}>{sublabel}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

function Rule({ my = 28 }) {
  return <div style={{ borderTop: "1px solid #000000", margin: `${my}px 0` }} />;
}

function Label({ children, mb = 12 }) {
  return <div style={{ fontSize: 9, letterSpacing: "0.1em", color: C.faint, marginBottom: mb }}>{children}</div>;
}

function Pill({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{ background: C.yellow, border: "1px solid #000000", padding: "11px 26px", fontSize: 11, letterSpacing: "0.06em", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, color: C.ink, ...style }}>
      {children} <span style={{ fontSize: 13 }}>→</span>
    </button>
  );
}

function Ghost({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{ background: "transparent", border: "1px solid #000000", padding: "10px 22px", fontSize: 11, letterSpacing: "0.06em", cursor: "pointer", color: C.faint, ...style }}>
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <Label mb={12}>{label}</Label>
      {children}
    </div>
  );
}

const lineIn = {
  width: "100%", border: "none", borderBottom: "1px solid #000000",
  background: "transparent", padding: "12px 0", fontSize: 14,
  color: C.ink, outline: "none", appearance: "none",
};

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 200 }}>
      <div style={{ background: "#FFFFFF", border: "1px solid #000000", borderBottom: "none", width: "100%", maxWidth: 480, padding: "36px 28px 56px", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <span style={{ fontSize: 10, color: C.faint, letterSpacing: "0.12em" }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, color: C.faint, cursor: "pointer", lineHeight: 1, padding: 0 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function BBar({ spent, budget }) {
  if (!budget) return null;
  const pct = Math.min((spent / budget) * 100, 100);
  const over = spent > budget;
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ height: 1, background: "#000000" }}>
        <div style={{ height: 1, width: `${pct}%`, background: over ? C.red : C.ink, transition: "width .4s" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
        <span style={{ fontSize: 9, color: over ? C.red : C.faint }}>{over ? "over budget" : `${Math.round(pct)}%`}</span>
        <span style={{ fontSize: 9, color: C.faint }}>{aud(budget)}</span>
      </div>
    </div>
  );
}

// ── Quotes slideshow ──────────────────────────────────────────────────────────
function RecapPage({ txns, expCats, incCats, vy }) {
  const [idx, setIdx]           = useState(0);
  const [visible, setVisible]   = useState(true);
  const [asciiPos, setAsciiPos] = useState({ top: "55%", left: "8%" });

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % QUOTES.length);
        setAsciiPos({
          top:  `${18 + Math.random() * 52}%`,
          left: `${Math.random() > 0.5 ? 4 + Math.random() * 18 : 54 + Math.random() * 28}%`,
        });
        setVisible(true);
      }, 800);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const q = QUOTES[idx];

  const monthData = Array.from({ length: 12 }, (_, i) => {
    const mT = txns.filter(t => new Date(t.date).getFullYear() === vy && new Date(t.date).getMonth() === i && t.type !== "transfer");
    return {
      inc: mT.filter(t => t.type === "income").reduce((a, t) => a + t.amount, 0),
      exp: mT.filter(t => t.type === "expense").reduce((a, t) => a + t.amount, 0),
    };
  });
  const hasData = monthData.some(m => m.inc > 0 || m.exp > 0);
  const totInc  = monthData.reduce((a, m) => a + m.inc, 0);
  const totExp  = monthData.reduce((a, m) => a + m.exp, 0);

  return (
    <>
      {/* ── Quotes slideshow — top ── */}
      <div style={{ position: "relative", minHeight: 340 }}>
        <div style={{
          position: "absolute", top: asciiPos.top, left: asciiPos.left,
          opacity: visible ? 0.13 : 0, transition: "opacity 0.8s ease",
          pointerEvents: "none", whiteSpace: "pre", fontSize: 10,
          lineHeight: 1.4, color: C.ink, fontFamily: "'Courier New', monospace",
        }}>
          {q.ascii}
        </div>

        <div style={{ opacity: visible ? 1 : 0, transition: "opacity 0.8s ease" }}>
          <div style={{ fontSize: 9, color: C.faint, letterSpacing: "0.14em", marginBottom: 24 }}>
            {q.author.toLowerCase()}
          </div>
          <div style={{ fontSize: 19, lineHeight: 1.75, fontStyle: "italic", color: C.ink, maxWidth: "92%", marginBottom: 44 }}>
            "{q.text}"
          </div>
        </div>


      </div>

      {/* ── Big gap ── */}
      <div style={{ height: 100 }} />

      {/* ── Yearly spreadsheet ── */}
      <div style={{ fontSize: 9, color: C.faint, letterSpacing: "0.1em", marginBottom: 20 }}>{vy}</div>
      <div style={{ border: "1px solid #000" }}>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "1px solid #000" }}>
          <div style={{ padding: "8px 10px", borderRight: "1px solid #000", fontSize: 8, color: C.faint, letterSpacing: "0.1em" }}>month</div>
          <div style={{ padding: "8px 10px", borderRight: "1px solid #000", fontSize: 8, color: C.green, letterSpacing: "0.1em", textAlign: "right" }}>income</div>
          <div style={{ padding: "8px 10px", fontSize: 8, color: C.red, letterSpacing: "0.1em", textAlign: "right" }}>expenses</div>
        </div>

        {!hasData ? (
          <div style={{ padding: "20px 10px", fontSize: 10, color: C.faint, fontStyle: "italic", textAlign: "center" }}>no data for {vy} yet</div>
        ) : (
          <>
            {monthData.map((m, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "1px solid #000", opacity: (m.inc > 0 || m.exp > 0) ? 1 : 0.3 }}>
                <div style={{ padding: "9px 10px", borderRight: "1px solid #000", fontSize: 9, color: C.faint }}>{MONTHS_S[i].toLowerCase()}</div>
                <div style={{ padding: "9px 10px", borderRight: "1px solid #000", fontSize: 9, color: C.green, textAlign: "right" }}>{m.inc > 0 ? aud(m.inc) : "—"}</div>
                <div style={{ padding: "9px 10px", fontSize: 9, color: C.red, textAlign: "right" }}>{m.exp > 0 ? aud(m.exp) : "—"}</div>
              </div>
            ))}
            {/* Totals row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
              <div style={{ padding: "10px 10px", borderRight: "1px solid #000", fontSize: 8, color: C.faint, letterSpacing: "0.08em" }}>total</div>
              <div style={{ padding: "10px 10px", borderRight: "1px solid #000", fontSize: 9, color: C.green, textAlign: "right", fontStyle: "italic" }}>{aud(totInc)}</div>
              <div style={{ padding: "10px 10px", fontSize: 9, color: C.red, textAlign: "right", fontStyle: "italic" }}>{aud(totExp)}</div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [tab, setTab]           = useState("home");
  const [txns, setTxns]         = useLS("t26_txns",    []);
  const [accounts, setAccounts] = useLS("t26_accs",    DEF_ACCOUNTS);
  const [incCats, setIncCats]   = useLS("t26_inc",     DEF_INC);
  const [expCats, setExpCats]   = useLS("t26_exp",     DEF_EXP);
  const [appTitle, setAppTitle] = useLS("t26_title",   "tracker 26");

  const now = new Date();
  const [vm, setVm]         = useState(now.getMonth());
  const [vy, setVy]         = useState(now.getFullYear());
  const [modal, setModal]   = useState(null);
  const [selTxn, setSelTxn] = useState(null);

  const mTxns = txns.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === vm && d.getFullYear() === vy && t.type !== "transfer";
  });
  const wStart = new Date(now);
  wStart.setDate(now.getDate() - now.getDay()); wStart.setHours(0,0,0,0);
  const wTxns = txns.filter(t => new Date(t.date) >= wStart && t.type !== "transfer");

  const mInc = mTxns.filter(t => t.type === "income").reduce((a, t) => a + t.amount, 0);
  const mExp = mTxns.filter(t => t.type === "expense").reduce((a, t) => a + t.amount, 0);
  const wExp = wTxns.filter(t => t.type === "expense").reduce((a, t) => a + t.amount, 0);
  const net  = mInc - mExp;

  const expMap = {}, incMap = {};
  expCats.forEach(c => { expMap[c.id] = 0; });
  incCats.forEach(c => { incMap[c.id] = 0; });
  mTxns.filter(t => t.type === "expense").forEach(t => { expMap[t.category] = (expMap[t.category] || 0) + t.amount; });
  mTxns.filter(t => t.type === "income").forEach(t  => { incMap[t.category] = (incMap[t.category]  || 0) + t.amount; });

  const pieSlices = expCats.map((c, i) => ({ id: c.id, value: expMap[c.id] || 0, color: SLICE_C[i % SLICE_C.length] })).filter(s => s.value > 0);

  const accBal = {};
  accounts.forEach(a => { accBal[a.id] = 0; });
  txns.forEach(t => {
    if (t.type === "income")   accBal[t.account] = (accBal[t.account] || 0) + t.amount;
    if (t.type === "expense")  accBal[t.account] = (accBal[t.account] || 0) - t.amount;
    if (t.type === "transfer") {
      accBal[t.from] = (accBal[t.from] || 0) - t.amount;
      accBal[t.to]   = (accBal[t.to]   || 0) + t.amount;
    }
  });
  const totalBal = Object.values(accBal).reduce((a, b) => a + b, 0);

  async function exportPDF() {
    if (!window.jsPDF) {
      await new Promise((res, rej) => {
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        s.onload = res; s.onerror = rej; document.head.appendChild(s);
      });
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const W = 210, M = 22; let y = M;
    const hr = () => { doc.setDrawColor(0); doc.setLineWidth(0.3); doc.line(M, y, W-M, y); y += 5; };
    doc.setDrawColor(0); doc.setLineWidth(0.3); doc.rect(M-4, M-6, W-M*2+8, 285);
    doc.setFontSize(20); doc.setTextColor(0); doc.text(appTitle.toUpperCase(), M, y); y += 7;
    doc.setFontSize(10); doc.setTextColor(120); doc.text(`annual report — ${vy}`, M, y); y += 12; hr();
    const yT = txns.filter(t => new Date(t.date).getFullYear() === vy && t.type !== "transfer");
    const yI = yT.filter(t => t.type === "income").reduce((a, t) => a + t.amount, 0);
    const yE = yT.filter(t => t.type === "expense").reduce((a, t) => a + t.amount, 0);
    doc.setFontSize(8); doc.setTextColor(120); doc.text("total income", M, y); doc.text("total expenses", W/2-10, y); doc.text("net", W-M, y, {align:"right"}); y += 5;
    doc.setFontSize(14); doc.setTextColor(42,92,69); doc.text(aud(yI), M, y);
    doc.setTextColor(155,43,26); doc.text(aud(yE), W/2-10, y);
    doc.setTextColor(0); doc.text(aud(yI-yE), W-M, y, {align:"right"}); y += 12; hr();
    doc.setFontSize(8); doc.setTextColor(120); doc.text("monthly breakdown", M, y); y += 8;
    MONTHS_L.forEach((mn, mi) => {
      const mT = txns.filter(t => { const d = new Date(t.date); return d.getMonth()===mi && d.getFullYear()===vy && t.type!=="transfer"; });
      const mI = mT.filter(t => t.type==="income").reduce((a,t) => a+t.amount, 0);
      const mE = mT.filter(t => t.type==="expense").reduce((a,t) => a+t.amount, 0);
      if (y > 268) { doc.addPage(); y = M; }
      doc.setFontSize(10); doc.setTextColor(0); doc.text(mn, M, y);
      doc.setTextColor(42,92,69); doc.text(aud(mI), W/2-20, y, {align:"right"});
      doc.setTextColor(155,43,26); doc.text(aud(mE), W/2+10, y, {align:"right"});
      const n = mI-mE; doc.setTextColor(...(n>=0?[42,92,69]:[155,43,26])); doc.text(aud(n), W-M, y, {align:"right"}); y += 6.5;
    });
    y += 4; hr();
    doc.setFontSize(8); doc.setTextColor(120); doc.text("expenses by category", M, y); y += 8;
    expCats.forEach(c => {
      const tot = txns.filter(t => new Date(t.date).getFullYear()===vy && t.type==="expense" && t.category===c.id).reduce((a,t)=>a+t.amount,0);
      if (!tot) return; if (y>272) { doc.addPage(); y=M; }
      doc.setFontSize(10); doc.setTextColor(0); doc.text(c.name, M, y); doc.text(aud(tot), W-M, y, {align:"right"}); y += 6.5;
    });

    // Quotes page
    doc.addPage(); y = M;
    doc.setFontSize(9); doc.setTextColor(120); doc.text("words", M, y); y += 14;
    QUOTES.forEach(q => {
      if (y > 255) { doc.addPage(); y = M; }
      doc.setFontSize(11); doc.setTextColor(0);
      const lines = doc.splitTextToSize(`"${q.text}"`, W - M*2);
      lines.forEach(l => { doc.text(l, M, y); y += 5.5; });
      doc.setFontSize(8); doc.setTextColor(120); doc.text(`— ${q.author}`, M, y); y += 12;
    });

    doc.setFontSize(8); doc.setTextColor(120); doc.text(`${appTitle} · ${new Date().toLocaleDateString("en-AU")}`, W/2, 288, {align:"center"});
    doc.save(`tracker26-${vy}.pdf`);
  }

  const tabLabel = { home: MONTHS_L[vm].toLowerCase(), add: "record", budgets: "budgets", settings: "settings", recap: "recap" };
  const navItems = [["home","home"],["add","record"],["budgets","budgets"],["recap","recap"],["settings","settings"]];

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh", color: C.ink, maxWidth: 480, margin: "0 auto", position: "relative" }}>

      {/* Header */}
      <div style={{ padding: "56px 28px 0", marginBottom: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: "0.18em", color: C.faint, marginBottom: 6 }}>{tabLabel[tab]}</div>
            <div style={{ fontSize: 23, fontWeight: 400, letterSpacing: "0.04em", fontStyle: "italic" }}>{appTitle}</div>
          </div>
          {tab === "home" && <Ghost onClick={() => setModal("transfer")} style={{ fontSize: 10 }}>transfer</Ghost>}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "0 28px 120px" }}>
        {tab === "home"     && <HomeTab vm={vm} vy={vy} setVm={setVm} setVy={setVy} mInc={mInc} mExp={mExp} wExp={wExp} net={net} pieSlices={pieSlices} expCats={expCats} expMap={expMap} incCats={incCats} incMap={incMap} accounts={accounts} accBal={accBal} totalBal={totalBal} txns={txns} setSelTxn={setSelTxn} setModal={setModal} exportPDF={exportPDF} />}
        {tab === "add"      && <AddTab accounts={accounts} incCats={incCats} expCats={expCats} setTxns={setTxns} setTab={setTab} />}
        {tab === "budgets"  && <BudgetsTab incCats={incCats} setIncCats={setIncCats} expCats={expCats} setExpCats={setExpCats} />}
        {tab === "recap"    && <RecapPage txns={txns} expCats={expCats} incCats={incCats} vy={vy} />}
        {tab === "settings" && <SettingsTab accounts={accounts} setAccounts={setAccounts} incCats={incCats} setIncCats={setIncCats} expCats={expCats} setExpCats={setExpCats} txns={txns} setTxns={setTxns} appTitle={appTitle} setAppTitle={setAppTitle} />}
      </div>

      {/* Nav */}
      <nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#FFFFFF", borderTop: "1px solid #000000", display: "flex", justifyContent: "space-around", padding: "18px 0 34px", zIndex: 100 }}>
        {navItems.map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ width: 3, height: 3, borderRadius: "50%", background: tab === k ? C.ink : "transparent" }} />
            <span style={{ fontSize: 9, letterSpacing: "0.12em", color: tab === k ? C.ink : C.faint }}>{l}</span>
          </button>
        ))}
      </nav>

      {modal === "transfer"   && <TransferModal accounts={accounts} setTxns={setTxns} onClose={() => setModal(null)} />}
      {modal === "txn-detail" && selTxn && <TxnDetailModal txn={selTxn} accounts={accounts} incCats={incCats} expCats={expCats} setTxns={setTxns} onClose={() => { setModal(null); setSelTxn(null); }} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOME
// ═══════════════════════════════════════════════════════════════════════════════
function HomeTab({ vm, vy, setVm, setVy, mInc, mExp, wExp, net, pieSlices, expCats, expMap, incCats, incMap, accounts, accBal, totalBal, txns, setSelTxn, setModal, exportPDF }) {
  function prev() { if (vm === 0) { setVm(11); setVy(y => y-1); } else setVm(m => m-1); }
  function next() { if (vm === 11) { setVm(0); setVy(y => y+1); } else setVm(m => m+1); }
  const recent   = [...txns].filter(t => t.type !== "transfer").sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);
  const allCats  = [...expCats, ...incCats];

  return (
    <>
      {/* Month nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36 }}>
        <button onClick={prev} style={{ background: "none", border: "none", cursor: "pointer", color: C.faint, fontSize: 16, padding: 0 }}>←</button>
        <span style={{ fontSize: 9, letterSpacing: "0.18em", color: C.faint }}>{MONTHS_L[vm].toLowerCase()} {vy}</span>
        <button onClick={next} style={{ background: "none", border: "none", cursor: "pointer", color: C.faint, fontSize: 16, padding: 0 }}>→</button>
      </div>

      {/* Income / Expenses — one box, two rows */}
      <Frame mb={40}>
        {[
          { l: "income",   v: aud(mInc), c: C.green },
          { l: "expenses", v: aud(mExp), c: C.red   },
        ].map((s, i) => (
          <div key={s.l} style={{ paddingTop: i === 0 ? 0 : 28, paddingBottom: i === 0 ? 28 : 0, borderBottom: i === 0 ? "1px solid #000000" : "none" }}>
            <div style={{ fontSize: 9, color: C.faint, marginBottom: 12, letterSpacing: "0.08em" }}>{s.l}</div>
            <div style={{ fontSize: 26, color: s.c }}>{s.v}</div>
          </div>
        ))}
      </Frame>

      {/* Accounts */}
      <Frame label="accounts" mb={40}>
        {accounts.map((a, i) => (
          <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: i < accounts.length-1 ? 22 : 0, marginBottom: i < accounts.length-1 ? 22 : 0, borderBottom: i < accounts.length-1 ? "1px solid #000000" : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.color, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13 }}>{a.name}</div>
                <div style={{ fontSize: 9, color: C.faint, marginTop: 2 }}>{a.bank}</div>
              </div>
            </div>
            <span style={{ fontSize: 14, color: (accBal[a.id]||0) >= 0 ? C.ink : C.red }}>{aud(accBal[a.id]||0)}</span>
          </div>
        ))}
        <Rule my={22} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 9, color: C.faint }}>total</span>
          <span style={{ fontSize: 15, color: totalBal >= 0 ? C.ink : C.red }}>{aud(totalBal)}</span>
        </div>
      </Frame>

      {/* Spending breakdown */}
      <Frame label="spending breakdown" mb={40}>
        <Pie slices={pieSlices} size={140} />
        <div style={{ marginTop: 28 }}>
          {expCats.filter(c => (expMap[c.id]||0) > 0 || c.budget > 0).map((c, i) => (
            <div key={c.id} style={{ marginBottom: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: SLICE_C[i % SLICE_C.length] }} />
                  <span style={{ fontSize: 13 }}>{c.name}</span>
                </div>
                <span style={{ fontSize: 13, color: (expMap[c.id]||0) > c.budget && c.budget ? C.red : C.ink }}>{aud(expMap[c.id]||0)}</span>
              </div>
              <BBar spent={expMap[c.id]||0} budget={c.budget} />
            </div>
          ))}
        </div>
      </Frame>

      {/* Income sources */}
      <Frame label="income sources" mb={40}>
        {incCats.map(c => (
          <div key={c.id} style={{ display: "flex", justifyContent: "space-between", padding: "18px 0", borderBottom: "1px solid #000000" }}>
            <span style={{ fontSize: 13 }}>{c.name}</span>
            <span style={{ fontSize: 13, color: (incMap[c.id]||0) > 0 ? C.green : C.faint }}>{aud(incMap[c.id]||0)}</span>
          </div>
        ))}
      </Frame>

      {/* Recent */}
      <Frame label="recent" mb={40}>
        {recent.length === 0 ? (
          <div style={{ textAlign: "center", color: C.faint, fontSize: 12, padding: "20px 0", fontStyle: "italic" }}>no transactions yet</div>
        ) : recent.map(t => {
          const cat = allCats.find(c => c.id === t.category);
          return (
            <div key={t.id} onClick={() => { setSelTxn(t); setModal("txn-detail"); }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", borderBottom: "1px solid #000000", cursor: "pointer" }}>
              <div>
                <div style={{ fontSize: 13 }}>{t.note || cat?.name || t.category}</div>
                <div style={{ fontSize: 9, color: C.faint, marginTop: 3 }}>{cat?.name} · {new Date(t.date).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}</div>
              </div>
              <span style={{ fontSize: 13, color: t.type === "income" ? C.green : C.red }}>{t.type === "income" ? "+" : "−"}{aud(t.amount)}</span>
            </div>
          );
        })}
      </Frame>

      <div style={{ textAlign: "center", paddingTop: 16 }}>
        <Pill onClick={exportPDF}> export {vy} annual pdf</Pill>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADD
// ═══════════════════════════════════════════════════════════════════════════════
function AddTab({ accounts, incCats, expCats, setTxns, setTab }) {
  const [type, setType] = useState("expense");
  const [amt,  setAmt]  = useState("");
  const [cat,  setCat]  = useState(expCats[0]?.id || "");
  const [acc,  setAcc]  = useState(accounts[0]?.id || "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [err,  setErr]  = useState("");
  const cats = type === "income" ? incCats : expCats;
  useEffect(() => { setCat(cats[0]?.id || ""); }, [type]);

  function save() {
    const a = parseFloat(amt);
    if (!a || a <= 0) { setErr("enter a valid amount."); return; }
    setTxns(p => [...p, { id: uid(), type, amount: a, category: cat, account: acc, date, note, createdAt: Date.now() }]);
    setAmt(""); setNote(""); setErr(""); setTab("home");
  }

  return (
    <>
      <div style={{ display: "flex", gap: 14, marginBottom: 40 }}>
        {[
          { key: "expense", bg: type==="expense" ? "#C8473A" : "#F5E8E6", color: type==="expense" ? "#FFFFFF" : "#9B2B1A", border: "1px solid #9B2B1A" },
          { key: "income",  bg: type==="income"  ? "#2A5C45" : "#E4EFE9", color: type==="income"  ? "#FFFFFF" : "#2A5C45", border: "1px solid #2A5C45" },
        ].map(({ key, bg, color, border }) => (
          <button key={key} onClick={() => setType(key)} style={{
            flex: 1, background: bg, color, border,
            padding: "18px 0", fontSize: 11, letterSpacing: "0.08em",
            cursor: "pointer", transition: "all .2s", display: "flex",
            alignItems: "center", justifyContent: "center", gap: 10,
          }}>
            {key} <span style={{ fontSize: 14 }}>→</span>
          </button>
        ))}
      </div>

      <Frame label="amount" mb={40}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4, padding: "20px 0" }}>
          <span style={{ fontSize: 22, color: C.faint }}>$</span>
          <input type="number" inputMode="decimal" placeholder="0.00" value={amt} onChange={e => setAmt(e.target.value)} style={{ fontSize: 42, border: "none", background: "transparent", color: C.ink, width: 200, textAlign: "center", outline: "none", appearance: "none" }} />
        </div>
      </Frame>

      <Field label="category"><select value={cat} onChange={e => setCat(e.target.value)} style={{ ...lineIn }}>{cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
      <Field label="account"><select value={acc} onChange={e => setAcc(e.target.value)} style={{ ...lineIn }}>{accounts.map(a => <option key={a.id} value={a.id}>{a.name} — {a.bank}</option>)}</select></Field>
      <Field label="date"><input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ ...lineIn }} /></Field>
      <Field label="note"><input type="text" placeholder="optional note…" value={note} onChange={e => setNote(e.target.value)} style={{ ...lineIn }} /></Field>

      {err && <div style={{ color: C.red, fontSize: 11, marginBottom: 20, fontStyle: "italic" }}>{err}</div>}
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 16 }}>
        <Pill onClick={save}>save {type === "income" ? "income" : "expense"}</Pill>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSFER
// ═══════════════════════════════════════════════════════════════════════════════
function TransferModal({ accounts, setTxns, onClose }) {
  const [from, setFrom] = useState(accounts[0]?.id || "");
  const [to,   setTo]   = useState(accounts[1]?.id || "");
  const [amt,  setAmt]  = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [note, setNote] = useState("");
  const [err,  setErr]  = useState("");

  function save() {
    const a = parseFloat(amt);
    if (!a || a <= 0) { setErr("enter a valid amount."); return; }
    if (from === to) { setErr("select different accounts."); return; }
    setTxns(p => [...p, { id: uid(), type: "transfer", from, to, amount: a, date, note, createdAt: Date.now() }]);
    onClose();
  }
  return (
    <Modal title="account transfer" onClose={onClose}>
      <Field label="amount"><input type="number" inputMode="decimal" placeholder="0.00" value={amt} onChange={e => setAmt(e.target.value)} style={{ ...lineIn, fontSize: 22 }} /></Field>
      <Field label="from"><select value={from} onChange={e => setFrom(e.target.value)} style={{ ...lineIn }}>{accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></Field>
      <Field label="to"><select value={to} onChange={e => setTo(e.target.value)} style={{ ...lineIn }}>{accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></Field>
      <Field label="date"><input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ ...lineIn }} /></Field>
      <Field label="note"><input type="text" placeholder="e.g. monthly savings transfer" value={note} onChange={e => setNote(e.target.value)} style={{ ...lineIn }} /></Field>
      {err && <div style={{ color: C.red, fontSize: 11, marginBottom: 20, fontStyle: "italic" }}>{err}</div>}
      <div style={{ display: "flex", justifyContent: "center" }}><Pill onClick={save}>record transfer</Pill></div>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TXN DETAIL
// ═══════════════════════════════════════════════════════════════════════════════
function TxnDetailModal({ txn, accounts, incCats, expCats, setTxns, onClose }) {
  const cats = txn.type === "income" ? incCats : expCats;
  const cat  = cats.find(c => c.id === txn.category);
  const acc  = accounts.find(a => a.id === txn.account);
  function del() { setTxns(p => p.filter(t => t.id !== txn.id)); onClose(); }
  const rows = [
    ["category", cat?.name || txn.category],
    ["account",  acc?.name || txn.account],
    ["date", new Date(txn.date).toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })],
    txn.note ? ["note", txn.note] : null,
  ].filter(Boolean);
  return (
    <Modal title="transaction" onClose={onClose}>
      <div style={{ textAlign: "center", padding: "28px 0 36px" }}>
        <div style={{ fontSize: 9, letterSpacing: "0.14em", color: C.faint, marginBottom: 10 }}>{txn.type}</div>
        <div style={{ fontSize: 36, color: txn.type === "income" ? C.green : C.red }}>{txn.type === "income" ? "+" : "−"}{aud(txn.amount)}</div>
      </div>
      <Rule my={0} />
      {rows.map(([l, v]) => (
        <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "18px 0", borderBottom: "1px solid #000000" }}>
          <span style={{ fontSize: 9, color: C.faint, letterSpacing: "0.1em" }}>{l}</span>
          <span style={{ fontSize: 13, maxWidth: 240, textAlign: "right" }}>{v}</span>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 36 }}>
        <Ghost onClick={del} style={{ color: C.red, borderColor: C.red, fontSize: 10 }}>delete transaction</Ghost>
      </div>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BUDGETS
// ═══════════════════════════════════════════════════════════════════════════════
function BudgetsTab({ incCats, setIncCats, expCats, setExpCats }) {
  const [editing, setEditing] = useState(null);
  const [val, setVal]         = useState("");
  function start(type, id, cur) { setEditing({ type, id }); setVal(cur ? String(cur) : ""); }
  function save() {
    const a = parseFloat(val) || 0;
    if (editing.type === "expense") setExpCats(p => p.map(c => c.id === editing.id ? { ...c, budget: a } : c));
    else setIncCats(p => p.map(c => c.id === editing.id ? { ...c, budget: a } : c));
    setEditing(null);
  }
  const total = expCats.reduce((a, c) => a + (c.budget || 0), 0);

  function BRow({ c, type }) {
    return (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", borderBottom: "1px solid #000000" }}>
        <span style={{ fontSize: 13 }}>{c.name}</span>
        {editing?.id === c.id && editing.type === type ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input type="number" value={val} onChange={e => setVal(e.target.value)} autoFocus style={{ ...lineIn, width: 80, textAlign: "right", fontSize: 13 }} />
            <button onClick={save} style={{ background: "none", border: "none", cursor: "pointer", color: C.ink, fontSize: 10, letterSpacing: "0.1em" }}>save</button>
          </div>
        ) : (
          <button onClick={() => start(type, c.id, c.budget)} style={{ background: "none", border: "none", cursor: "pointer", color: c.budget ? C.ink : C.faint, fontSize: 13 }}>
            {c.budget ? aud(c.budget) : "set"}
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <Frame label="total monthly budget" mb={40}>
        <div style={{ fontSize: 28, marginBottom: 10 }}>{aud(total)}</div>
        <div style={{ fontSize: 11, color: C.faint, fontStyle: "italic" }}>across all expense categories</div>
      </Frame>
      <Frame label="expense budgets" mb={40}>{expCats.map(c => <BRow key={c.id} c={c} type="expense" />)}</Frame>
      <Frame label="income targets" mb={40}>{incCats.map(c => <BRow key={c.id} c={c} type="income" />)}</Frame>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════
function SettingsTab({ accounts, setAccounts, incCats, setIncCats, expCats, setExpCats, txns, setTxns, appTitle, setAppTitle }) {
  const [sec,      setSec]    = useState(null);
  const [editId,   setEditId] = useState(null);
  const [editName, setEN]     = useState("");
  const [newName,  setNN]     = useState("");
  const [newBank,  setNB]     = useState("NAB");
  const [newColor, setNC]     = useState(ACC_C[0]);
  const [titleEdit, setTitleEdit] = useState(false);
  const [titleVal,  setTitleVal]  = useState(appTitle);

  function reset() { setSec(null); setNN(""); setEditId(null); }
  function BackBtn() {
    return (
      <button onClick={reset} style={{ background: "none", border: "none", cursor: "pointer", color: C.faint, fontSize: 9, letterSpacing: "0.14em", padding: "0 0 32px", display: "block" }}>
        ← back
      </button>
    );
  }

  function renCat(type, id, name) {
    if (type === "expense") setExpCats(p => p.map(c => c.id===id ? {...c,name} : c));
    else setIncCats(p => p.map(c => c.id===id ? {...c,name} : c));
    setEditId(null);
  }
  function addCat(type) {
    if (!newName.trim()) return;
    const nc = { id: uid(), name: newName.trim(), budget: 0 };
    if (type === "expense") setExpCats(p => [...p, nc]); else setIncCats(p => [...p, nc]);
    setNN("");
  }
  function delCat(type, id) {
    if (type === "expense") setExpCats(p => p.filter(c => c.id!==id));
    else setIncCats(p => p.filter(c => c.id!==id));
  }

  if (sec === "title") return (
    <>
      <BackBtn />
      <Frame label="app title" mb={40}>
        <div style={{ fontSize: 9, color: C.faint, marginBottom: 20, fontStyle: "italic" }}>this appears at the top of every page</div>
        <Field label="title">
          <input type="text" value={titleVal} onChange={e => setTitleVal(e.target.value)} style={{ ...lineIn, fontSize: 20, fontStyle: "italic" }} />
        </Field>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 8 }}>
          <Pill onClick={() => { setAppTitle(titleVal.trim() || "tracker 26"); reset(); }}>save title</Pill>
        </div>
      </Frame>
    </>
  );

  if (sec === "accounts") return (
    <>
      <BackBtn />
      <Frame label="accounts" mb={40}>
        {accounts.map(a => (
          <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", borderBottom: "1px solid #000000" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.color }} />
              <div><div style={{ fontSize: 13 }}>{a.name}</div><div style={{ fontSize: 9, color: C.faint }}>{a.bank}</div></div>
            </div>
            {accounts.length > 1 && <button onClick={() => setAccounts(p => p.filter(x => x.id!==a.id))} style={{ background: "none", border: "none", cursor: "pointer", color: C.red, fontSize: 18, padding: 0 }}>×</button>}
          </div>
        ))}
      </Frame>
      {accounts.length < 3 && (
        <Frame label="add account" mb={40}>
          <Field label="name"><input type="text" value={newName} onChange={e => setNN(e.target.value)} placeholder="account name" style={{ ...lineIn }} /></Field>
          <Field label="bank"><select value={newBank} onChange={e => setNB(e.target.value)} style={{ ...lineIn }}>{BANKS.map(b => <option key={b} value={b}>{b}</option>)}</select></Field>
          <Field label="colour">
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", paddingTop: 4 }}>
              {ACC_C.map(p => <div key={p} onClick={() => setNC(p)} style={{ width: 22, height: 22, borderRadius: "50%", background: p, cursor: "pointer", outline: newColor===p?"2px solid #000":"none", outlineOffset: 2 }} />)}
            </div>
          </Field>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Pill onClick={() => { if (!newName.trim()||accounts.length>=3) return; setAccounts(p => [...p,{id:uid(),name:newName.trim(),bank:newBank,color:newColor}]); setNN(""); setNB("NAB"); setNC(ACC_C[0]); }}>add account</Pill>
          </div>
        </Frame>
      )}
    </>
  );

  if (sec === "expense_cats" || sec === "income_cats") {
    const type = sec === "expense_cats" ? "expense" : "income";
    const cats = type === "expense" ? expCats : incCats;
    return (
      <>
        <BackBtn />
        <Frame label={type === "expense" ? "expense categories" : "income categories"} mb={40}>
          {cats.map(c => (
            <div key={c.id} style={{ padding: "20px 0", borderBottom: "1px solid #000000" }}>
              {editId === c.id ? (
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <input value={editName} onChange={e => setEN(e.target.value)} autoFocus style={{ ...lineIn, flex: 1 }} />
                  <button onClick={() => renCat(type, c.id, editName)} style={{ background: "none", border: "none", cursor: "pointer", color: C.ink, fontSize: 10 }}>save</button>
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13 }}>{c.name}</span>
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <button onClick={() => { setEditId(c.id); setEN(c.name); }} style={{ background: "none", border: "none", cursor: "pointer", color: C.faint, fontSize: 10 }}>rename</button>
                    {cats.length > 1 && <button onClick={() => delCat(type, c.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.red, fontSize: 18, padding: 0, lineHeight: 1 }}>×</button>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </Frame>
        <Frame label="add category" mb={40}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}><input type="text" value={newName} onChange={e => setNN(e.target.value)} placeholder="category name" style={{ ...lineIn }} /></div>
            <Pill onClick={() => addCat(type)} style={{ fontSize: 10, padding: "8px 16px" }}>add</Pill>
          </div>
        </Frame>
      </>
    );
  }

  if (sec === "data") {
    function exportBackup() {
      const data = {
        version: 1,
        exportedAt: new Date().toISOString(),
        txns:     JSON.parse(localStorage.getItem("t26_txns")    || "[]"),
        accounts: JSON.parse(localStorage.getItem("t26_accs")    || "[]"),
        incCats:  JSON.parse(localStorage.getItem("t26_inc")     || "[]"),
        expCats:  JSON.parse(localStorage.getItem("t26_exp")     || "[]"),
        appTitle: localStorage.getItem("t26_title") || "tracker 26",
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `tracker26-backup-${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }

    function importBackup(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const data = JSON.parse(ev.target.result);
          if (!data.version) throw new Error("invalid file");
          if (window.confirm("this will replace all your current data. are you sure?")) {
            if (data.txns)     { localStorage.setItem("t26_txns",  JSON.stringify(data.txns));     setTxns(data.txns); }
            if (data.accounts) { localStorage.setItem("t26_accs",  JSON.stringify(data.accounts)); setAccounts(data.accounts); }
            if (data.incCats)  { localStorage.setItem("t26_inc",   JSON.stringify(data.incCats));  setIncCats(data.incCats); }
            if (data.expCats)  { localStorage.setItem("t26_exp",   JSON.stringify(data.expCats));  setExpCats(data.expCats); }
            if (data.appTitle) { localStorage.setItem("t26_title", data.appTitle);                 setAppTitle(data.appTitle); }
            alert("backup restored successfully.");
          }
        } catch { alert("invalid backup file."); }
      };
      reader.readAsText(file);
    }

    return (
      <>
        <BackBtn />
        <Frame label="data" mb={40}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "18px 0", borderBottom: "1px solid #000" }}>
            <span style={{ fontSize: 13, color: C.faint }}>total transactions</span>
            <span style={{ fontSize: 13 }}>{txns.length}</span>
          </div>

          <div style={{ fontSize: 9, color: C.faint, letterSpacing: "0.08em", paddingTop: 28, paddingBottom: 14 }}>backup</div>
          <div style={{ fontSize: 11, color: C.faint, fontStyle: "italic", lineHeight: 1.8, marginBottom: 20 }}>
            export your data as a file. save it to your files app, icloud, or google drive. import it any time to restore.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Pill onClick={exportBackup} style={{ justifyContent: "center" }}>export backup</Pill>
            <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "transparent", border: "1px solid #000", padding: "10px 22px", fontSize: 11, letterSpacing: "0.06em", cursor: "pointer", color: C.faint }}>
              import backup
              <input type="file" accept=".json" onChange={importBackup} style={{ display: "none" }} />
            </label>
          </div>

          <div style={{ borderTop: "1px solid #000", marginTop: 36, paddingTop: 28 }}>
            <div style={{ fontSize: 9, color: C.faint, letterSpacing: "0.08em", marginBottom: 14 }}>danger zone</div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Ghost onClick={() => { if (window.confirm("delete all transactions? this cannot be undone.")) setTxns([]); }} style={{ color: C.red, borderColor: C.red, fontSize: 10 }}>clear all transactions</Ghost>
            </div>
          </div>
        </Frame>
      </>
    );
  }

  const menuItems = [
    ["title",        "app title"],
    ["accounts",     "accounts"],
    ["expense_cats", "expense categories"],
    ["income_cats",  "income categories"],
    ["data",         "data"],
  ];

  return (
    <Frame label="settings" mb={40}>
      {menuItems.map(([k, l]) => (
        <div key={k} onClick={() => setSec(k)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", borderBottom: "1px solid #000000", cursor: "pointer" }}>
          <span style={{ fontSize: 13 }}>{l}</span>
          <span style={{ color: C.faint, fontSize: 14 }}>→</span>
        </div>
      ))}
      <div style={{ paddingTop: 36, textAlign: "center", fontSize: 9, color: C.faint, fontStyle: "italic" }}>tracker 26 · for melbourne</div>
    </Frame>
  );
}
