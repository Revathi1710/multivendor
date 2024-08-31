import React from "react";
import { Card } from "react-bootstrap";

const ProductCard = (props) => {

  const handleView = () => {
    window.location.href = `/ServiceView/${props._id}`;
  };

  return (
    <Card style={{ width: "100%" }}>
      <Card.Img variant="top" src={props.imgSrc} />
      <Card.Body>
        <Card.Title className="ellipsis2" onClick={handleView}>
          {props.name || "Card Title"}
        </Card.Title>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
