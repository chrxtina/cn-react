import React from "react";
import { Image } from "semantic-ui-react";
import { Dot } from "pure-react-carousel";

const Thumbnails = ({images}) => (
    <div className="thumbnail-group">
      {images.map((image, i) => (
        <Dot
            className="thumbnail"
            slide={i}
            key={`dot-${i}`}
        >
            <Image src={image.url}/>
        </Dot>
      ))}
    </div>
);

export default Thumbnails;
