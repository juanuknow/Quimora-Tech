import { HERO_DEMOS } from "../../lib/hero-demo-data";

export function ClinicDemo() {
  const data = HERO_DEMOS.clinicas;
  return (
    <div className={"body"}>
      <div className={"doc"}>
        <svg viewBox={"0 0 46 46"} aria-hidden={"true"}>
          <rect width={"46"} height={"46"} fill={"#cffafe"}></rect>
          <circle cx={"23"} cy={"18"} r={"8"} fill={"#a16207"}></circle>
          <path d={"M15 17a8 8 0 0 1 16 0c0-7-16-7-16 0z"} fill={"#422006"}></path>
          <path d={"M8 46c0-10 7-15 15-15s15 5 15 15z"} fill={"#fff"}></path>
          <path d={"M20 31l3 6 3-6"} fill={"none"} stroke={"#0e7490"} strokeWidth={"2"}></path>
        </svg>
        <div>
          <b>{data.copy[0]}</b>
          <small>{data.copy[1]}</small>
          <br />
          <span className={"stars"}>{data.copy[2]}</span>
          <small>{data.copy[3]}</small>
        </div>
      </div>
      <span className={"h"}>{data.copy[4]}</span>
      <div className={"days"}>
        <span className={"day"}>
          {data.copy[5]}
          <b>{data.copy[6]}</b>
        </span>
        <span className={"day"}>
          {data.copy[7]}
          <b>{data.copy[8]}</b>
        </span>
        <span className={"day sel"}>
          {data.copy[9]}
          <b>{data.copy[10]}</b>
        </span>
        <span className={"day"}>
          {data.copy[11]}
          <b>{data.copy[12]}</b>
        </span>
        <span className={"day"}>
          {data.copy[13]}
          <b>{data.copy[14]}</b>
        </span>
      </div>
      <div className={"slots"}>
        <span className={"slot off"}>{data.copy[15]}</span>
        <span className={"slot sel"}>{data.copy[16]}</span>
        <span className={"slot"}>{data.copy[17]}</span>
        <span className={"slot off"}>{data.copy[18]}</span>
        <span className={"slot"}>{data.copy[19]}</span>
        <span className={"slot"}>{data.copy[20]}</span>
      </div>
      <div className={"item"} style={{ borderStyle: "dashed" }}>
        <svg viewBox={"0 0 34 34"} aria-hidden={"true"}>
          <rect width={"34"} height={"34"} fill={"#ecfeff"}></rect>
          <path
            d={"M17 8a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 4v5l3 2"}
            fill={"none"}
            stroke={"#0e7490"}
            strokeWidth={"2"}
          ></path>
        </svg>
        <div>
          <b>{data.copy[21]}</b>
          <small>{data.copy[22]}</small>
        </div>
      </div>
      <div className={"act"} style={{ background: "#0e7490" }}>
        {data.copy[23]}
      </div>
    </div>
  );
}
