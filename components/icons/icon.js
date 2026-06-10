const ZIcon = (props) => (
  <span
    style={{
      display: "inline-block",
      width: 30,
      height: 30,
      borderRadius: "50%",
      overflow: "hidden",
      flexShrink: 0,
    }}
  >
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/images/zicon.png"
      alt=""
      width={30}
      height={30}
      aria-hidden="true"
      style={{ display: "block" }}
      {...props}
    />
  </span>
);

export default ZIcon;
