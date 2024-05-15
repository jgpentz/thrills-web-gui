import * as React from "react"

interface FrfLogoSmallProps {
    width: number
    height: number
}

const FrfLogoSmall = ({width, height}: FrfLogoSmallProps) => {
    // Calculate padding to ensure content remains fully visible
    const padding = 5; // You can adjust this value as needed

    // Calculate viewBox dimensions with padding
    const viewBox = `-${padding} -${padding} ${550} ${550}`;
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox={viewBox}
            style={{marginLeft: "5px", marginTop: "5px"}}
        >
            <path
            d="M186.878 255.857s-124.249 156.068-3.03 332.34c0 0-93.663-157.417 3.03-332.34z"
            style={{
                fill: "#000",
                fillOpacity: 1,
                stroke: "#000",
                strokeWidth: 1,
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeOpacity: 1,
            }}
            transform="translate(-80.262 -205.531)"
            />
            <path
            d="M222.857 285.22S143.015 408.793 220 559.861c-103.571-149.643 2.857-274.643 2.857-274.643z"
            style={{
                fill: "#000",
                fillOpacity: 1,
                stroke: "#000",
                strokeWidth: 1,
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeOpacity: 1,
            }}
            transform="translate(-80.262 -205.531)"
            />
            <path
            d="M248.498 534.154s-83.843-98.995 1.01-224.254c-58.59 118.693-1.01 224.254-1.01 224.254z"
            style={{
                fill: "#000",
                fillOpacity: 1,
                stroke: "#000",
                strokeWidth: 1,
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeOpacity: 1,
            }}
            transform="translate(-80.262 -205.531)"
            />
            <path
            d="M275.772 515.466s-44.447-81.822-1.01-186.373c-66.67 102.53 1.01 186.373 1.01 186.373z"
            style={{
                fill: "#000",
                fillOpacity: 1,
                stroke: "#000",
                strokeWidth: 1,
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeOpacity: 1,
            }}
            transform="translate(-80.262 -205.531)"
            />
            <path
            d="M300.015 494.758s-33.84-66.165 0-144.957c-53.033 85.358 0 144.957 0 144.957z"
            style={{
                fill: "#000",
                fillOpacity: 1,
                stroke: "#000",
                strokeWidth: 1,
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeOpacity: 1,
            }}
            transform="translate(-80.262 -205.531)"
            />
            <path
            d="M321.719 364.781v115.344s51.033-35.383 97.5-47l77.969-.5c5.769 10.157 18.664 13.802 28.906 8.125 10.308-5.714 14.338-18.38 8.625-28.688-5.714-10.307-18.724-14.026-29.032-8.312-3.413 1.892-6.518 5.096-8.468 8.5l-78-.5c-46.467-11.617-97.5-46.969-97.5-46.969z"
            style={{
                fill: "#000",
                fillOpacity: 1,
                fillRule: "evenodd",
                stroke: "#000",
                strokeWidth: 1,
                strokeLinecap: "butt",
                strokeLinejoin: "miter",
                strokeOpacity: 1,
                markerStart: "none",
            }}
            transform="translate(-80.262 -205.531)"
            />
        </svg>
    )
}
export default FrfLogoSmall
