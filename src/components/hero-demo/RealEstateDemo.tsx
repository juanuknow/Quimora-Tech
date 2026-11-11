import { HERO_DEMOS } from "../../lib/hero-demo-data";

export function RealEstateDemo() {
  const data = HERO_DEMOS.inmobiliarias;
  return (
    <div className={"body"}>
      <div className={"filters"}>
        <span>
          <small>{data.copy[0]}</small>
          {data.copy[1]}
        </span>
        <span>
          <small>{data.copy[2]}</small>
          {data.copy[3]}
        </span>
        <span>
          <small>{data.copy[4]}</small>
          {data.copy[5]}
        </span>
      </div>
      <span className={"h"}>{data.copy[6]}</span>
      <div className={"grid2"}>
        <div className={"card"}>
          <svg viewBox={"0 0 80 50"} aria-hidden={"true"}>
            <rect width={"80"} height={"50"} fill={"#bae6fd"}></rect>
            <rect y={"38"} width={"80"} height={"12"} fill={"#86efac"}></rect>
            <rect x={"22"} y={"10"} width={"36"} height={"34"} fill={"#f5f5f4"}></rect>
            <g fill={"#38bdf8"}>
              <rect x={"27"} y={"15"} width={"7"} height={"6"}></rect>
              <rect x={"37"} y={"15"} width={"7"} height={"6"}></rect>
              <rect x={"47"} y={"15"} width={"7"} height={"6"}></rect>
              <rect x={"27"} y={"25"} width={"7"} height={"6"}></rect>
              <rect x={"37"} y={"25"} width={"7"} height={"6"}></rect>
              <rect x={"47"} y={"25"} width={"7"} height={"6"}></rect>
            </g>
            <rect x={"36"} y={"35"} width={"8"} height={"9"} fill={"#78716c"}></rect>
            <circle cx={"12"} cy={"36"} r={"6"} fill={"#16a34a"}></circle>
          </svg>
          <p>
            {data.copy[7]}
            <span>{data.copy[8]}</span>
            <span style={{ color: "var(--brand)" }}>{data.copy[9]}</span>
          </p>
        </div>
        <div className={"card"}>
          <svg viewBox={"0 0 80 50"} aria-hidden={"true"}>
            <rect width={"80"} height={"50"} fill={"#fde68a"}></rect>
            <rect y={"38"} width={"80"} height={"12"} fill={"#a3e635"}></rect>
            <path d={"M18 26l22-16 22 16z"} fill={"#b91c1c"}></path>
            <rect x={"22"} y={"26"} width={"36"} height={"18"} fill={"#fff7ed"}></rect>
            <rect x={"27"} y={"30"} width={"8"} height={"7"} fill={"#7dd3fc"}></rect>
            <rect x={"45"} y={"30"} width={"8"} height={"7"} fill={"#7dd3fc"}></rect>
            <rect x={"36"} y={"33"} width={"8"} height={"11"} fill={"#92400e"}></rect>
            <circle cx={"68"} cy={"34"} r={"7"} fill={"#15803d"}></circle>
          </svg>
          <p>
            {data.copy[10]}
            <span>{data.copy[11]}</span>
            <span style={{ color: "var(--brand)" }}>{data.copy[12]}</span>
          </p>
        </div>
      </div>
      <div className={"act"}>{data.copy[13]}</div>
    </div>
  );
}
