// The brand mark: a dark moon disc, a thin orange crescent rim (the
// lit/dark terminator on the homepage's 3D moon, flattened), and a bold
// "Z" centered on it. #0d1f2d is deliberately not the page's own dark-mode
// background (#1a1a1e) -- they're close enough to read as "the same family"
// but distinct enough that the disc doesn't vanish into a dark navbar.
const MoonZMark = ({ size = 30, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    role="img"
    aria-label="Ozzo"
    {...props}
  >
    <circle cx="50" cy="50" r="42" fill="#0d1f2d" />
    <circle
      cx="50"
      cy="50"
      r="42"
      fill="none"
      stroke="#c05621"
      strokeWidth="6"
      strokeDasharray="66 198"
      transform="rotate(-50 50 50)"
    />
    <path
      data-brand-glyph="z"
      d="M32 31H68V38L43 62H68V70H31V63L56 39H32Z"
      fill="#f7f5f2"
    />
  </svg>
);

export default MoonZMark;
