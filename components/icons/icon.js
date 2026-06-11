import Image from "next/image";

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
    <Image
      src="/favicon.svg"
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
