import React from "react";
import { HtmlTags } from "./HtmlTags";
import download from "../public/images/download.webp";
import star from "../public/images/star.webp";
import Image from "next/image";
import Github from "../public/images/github.webp";
import Link from "../public/images/link.webp";
import ElasticText from "./ElasticText";
import { ProjectCardProps } from "../models/DataTypes";

import android from "../public/images/android.webp";

const Card = (props: ProjectCardProps) => {
  if (
    props.name == undefined ||
    (props.name == "TypeError" && props.download_count == undefined)
  ) {
    return (
      <div className="project-card empty-project-card d-flex flex-column justify-content-center">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  }

  let countShow = (props.download_count != undefined?'flex':'none');

  return (
    <div className="project-card d-flex flex-column justify-content-between">
      {HtmlTags("<project>", "d-block")}
      <div
        style={{ padding: `0rem 1.75rem` }}
        className="d-flex flex-column align-items-start primary-font-color"
      >
        <div className="w-100p d-flex flex-row justify-content-between">
          <div style={{ gap: "10px" }} className="d-flex align-items-center">
            <div className="d-flex gap-2px align-items-center" style={{display: countShow}}>
              <Image src={download} alt="fork" className="fork-image d-block" />
              <p className="star-count">{props.download_count}</p>
            </div>
            <div className="d-flex gap-2px align-items-center" style={{display: countShow}}>
              <Image src={star} alt="" className="star-image d-block" />
              <p className="star-count">{props.rating}</p>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <a
              className="button-effect"
              href={`${props.link_url}`}
              target="_blank"
              rel="noreferrer"
            >
              <Image src={Link} alt={"Homepage"} />
            </a>
          </div>
        </div>
        {ElasticText(`${props.name}`, "text")}
        <p className="project-description">{props.description}</p>
        <div className="project-footer">
          <ul className="project-tech-topics d-flex primary-font-color-darker">
            {props.topics?.map((item, index) => {
              return (
                <li style={{ fontSize: "12px" }} key={index}>
                  {item}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {HtmlTags("</project>", "d-block")}
    </div>
  );
};

export default Card;
