import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export const HeroSlider = () => {
  return (
    <div id="heroSlider" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">

        <div className="carousel-item active">
          <img
            src="/images/taco1.png"
            className="d-block w-100"
            alt="Birria 1"
            style={{ height: "420px", objectFit: "cover" }}
          />
        </div>

        <div className="carousel-item">
          <img
            src="/images/taco2.png"
            className="d-block w-100"
            alt="Birria 2"
            style={{ height: "420px", objectFit: "cover" }}
          />
        </div>

        <div className="carousel-item">
          <img
            src="/images/taco3.png"
            className="d-block w-100"
            alt="Birria 3"
            style={{ height: "420px", objectFit: "cover" }}
          />
        </div>

      </div>

      {/* Controles */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#heroSlider"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon"></span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#heroSlider"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon"></span>
      </button>
    </div>
  );
};
