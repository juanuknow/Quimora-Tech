import { HERO_DEMOS } from "../../lib/hero-demo-data";

export function StoreDemo() {
  const data = HERO_DEMOS.tiendas;
  return (
    <div className={"body"}>
      <div className={"heroimg"}>
        <svg viewBox={"0 0 400 100"} preserveAspectRatio={"xMidYMid slice"} aria-hidden={"true"}>
          <rect width={"400"} height={"100"} fill={"#fef3c7"}></rect>
          <circle cx={"330"} cy={"50"} r={"60"} fill={"#fde68a"}></circle>
          <path d={"M270 30h40l8 12-10 6v42h-36V48l-10-6z"} fill={"#b45309"}></path>
          <path
            d={"M340 40h34l4 50h-42z"}
            fill={"#fff"}
            stroke={"#d97706"}
            strokeWidth={"2"}
          ></path>
          <path
            d={"M348 40c0-12 18-12 18 0"}
            fill={"none"}
            stroke={"#d97706"}
            strokeWidth={"2"}
          ></path>
        </svg>
        <div className={"cap"} style={{ color: "#78350f" }}>
          <b>{data.copy[0]}</b>
          <span>{data.copy[1]}</span>
        </div>
      </div>
      <span className={"h"}>{data.copy[2]}</span>
      <div className={"grid3"}>
        <div className={"card"}>
          <svg viewBox={"0 0 60 51"} aria-hidden={"true"}>
            <rect width={"60"} height={"51"} fill={"#fef3c7"}></rect>
            <path d={"M20 12h20l5 7-6 3v20H21V22l-6-3z"} fill={"#b45309"}></path>
          </svg>
          <p>
            {data.copy[3]}
            <span>{data.copy[4]}</span>
          </p>
        </div>
        <div className={"card"}>
          <svg viewBox={"0 0 60 51"} aria-hidden={"true"}>
            <rect width={"60"} height={"51"} fill={"#ecfccb"}></rect>
            <path d={"M18 20h24l3 22H15z"} fill={"#4d7c0f"}></path>
            <path
              d={"M24 20c0-9 12-9 12 0"}
              fill={"none"}
              stroke={"#365314"}
              strokeWidth={"2.5"}
            ></path>
          </svg>
          <p>
            {data.copy[5]}
            <span>{data.copy[6]}</span>
          </p>
        </div>
        <div className={"card"}>
          <svg viewBox={"0 0 60 51"} aria-hidden={"true"}>
            <rect width={"60"} height={"51"} fill={"#ffe4e6"}></rect>
            <path
              d={"M20 16h18v20a6 6 0 0 1-6 6h-6a6 6 0 0 1-6-6z"}
              fill={"#fff"}
              stroke={"#be123c"}
              strokeWidth={"2"}
            ></path>
            <path
              d={"M38 21h4a5 5 0 0 1 0 10h-4"}
              fill={"none"}
              stroke={"#be123c"}
              strokeWidth={"2"}
            ></path>
          </svg>
          <p>
            {data.copy[7]}
            <span>
              {data.copy[8]}
              <span className={"badge"}>{data.copy[9]}</span>
            </span>
          </p>
        </div>
      </div>
      <div className={"act wa"}>{data.copy[10]}</div>
    </div>
  );
}
