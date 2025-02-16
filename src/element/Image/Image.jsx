import React, { useState, useEffect } from "react";

const Image = ({ alt ="", className, defaultImageSrc, height, src, width }) => {
  const [errored, setErrored] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  useEffect(() => {
    setErrored(false);
  }, [imgSrc]);

  const onErrorHandler = () => {
    if (!errored) {
      setErrored(true);
      setImgSrc(defaultImageSrc);
    }
  };

  return (
    <img
      alt={alt}
      className={className}
      onError={onErrorHandler}
      src={imgSrc}
    ></img>
  );
};

export default Image;
