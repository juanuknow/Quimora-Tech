import { useId } from "react";
import { HERO_DEMOS } from "../../lib/hero-demo-data";

export function RestaurantDemo() {
  const data = HERO_DEMOS.restaurantes;
  const gradientId = useId();
  return (
    <div className={"body"}>
      <div className="heroimg restaurant-hero">
        <svg viewBox={"0 0 400 100"} preserveAspectRatio={"xMidYMid slice"} aria-hidden={"true"}>
          <defs>
            <linearGradient id={gradientId} x1={"0"} x2={"1"}>
              <stop offset={"0"} stopColor={"#7c2d12"}></stop>
              <stop offset={"1"} stopColor={"#c2410c"}></stop>
            </linearGradient>
          </defs>
          <rect width={"400"} height={"100"} fill={`url(#${gradientId})`}></rect>
          <ellipse cx={"300"} cy={"62"} rx={"70"} ry={"30"} fill={"#fff7ed"}></ellipse>
          <ellipse cx={"300"} cy={"58"} rx={"54"} ry={"20"} fill={"#fed7aa"}></ellipse>
          <circle cx={"282"} cy={"55"} r={"10"} fill={"#b45309"}></circle>
          <circle cx={"306"} cy={"52"} r={"9"} fill={"#65a30d"}></circle>
          <circle cx={"322"} cy={"60"} r={"8"} fill={"#facc15"}></circle>
          <circle cx={"294"} cy={"64"} r={"7"} fill={"#dc2626"}></circle>
          <rect width={"400"} height={"100"} fill={`url(#${gradientId})`} opacity={".3"}></rect>
        </svg>
        <div className={"cap"}>
          <b>{data.copy[0]}</b>
          <span>{data.copy[1]}</span>
        </div>
      </div>
      <span className={"h"}>{data.copy[2]}</span>
      <div className={"list"}>
        <div className={"item"}>
          <svg viewBox={"0 0 34 34"} aria-hidden={"true"}>
            <rect width={"34"} height={"34"} fill={"#fff7ed"}></rect>
            <circle cx={"17"} cy={"18"} r={"11"} fill={"#fff"} stroke={"#fed7aa"}></circle>
            <circle cx={"13"} cy={"16"} r={"4"} fill={"#b45309"}></circle>
            <circle cx={"20"} cy={"15"} r={"3"} fill={"#facc15"}></circle>
            <circle cx={"19"} cy={"21"} r={"3.5"} fill={"#65a30d"}></circle>
          </svg>
          <div>
            <b>{data.copy[3]}</b>
            <small>{data.copy[4]}</small>
          </div>
          <em>{data.copy[5]}</em>
        </div>
        <div className={"item"}>
          <svg viewBox={"0 0 34 34"} aria-hidden={"true"}>
            <rect width={"34"} height={"34"} fill={"#fefce8"}></rect>
            <path
              d={"M6 15h22l-2 9a5 5 0 0 1-5 4h-8a5 5 0 0 1-5-4z"}
              fill={"#fff"}
              stroke={"#fde68a"}
            ></path>
            <ellipse cx={"17"} cy={"15"} rx={"11"} ry={"3"} fill={"#fde047"}></ellipse>
            <circle cx={"13"} cy={"15"} r={"1.6"} fill={"#a16207"}></circle>
            <circle cx={"20"} cy={"14.5"} r={"1.4"} fill={"#16a34a"}></circle>
          </svg>
          <div>
            <b>{data.copy[6]}</b>
            <small>{data.copy[7]}</small>
          </div>
          <em>{data.copy[8]}</em>
        </div>
        <div className={"item"}>
          <svg viewBox={"0 0 34 34"} aria-hidden={"true"}>
            <rect width={"34"} height={"34"} fill={"#f0fdf4"}></rect>
            <path d={"M11 8h12l-2 20h-8z"} fill={"#fff"} stroke={"#bbf7d0"}></path>
            <path d={"M12 13h10l-1.4 14h-7.2z"} fill={"#dcfce7"}></path>
            <circle cx={"21"} cy={"9"} r={"3.5"} fill={"#84cc16"}></circle>
          </svg>
          <div>
            <b>{data.copy[9]}</b>
            <small>{data.copy[10]}</small>
          </div>
          <em>{data.copy[11]}</em>
        </div>
      </div>
      <div className={"act wa"}>{data.copy[12]}</div>
    </div>
  );
}
