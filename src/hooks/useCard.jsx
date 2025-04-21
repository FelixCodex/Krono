import { useContext } from "react";
import { CardContext } from "../context/card.jsx";

export const useCard = () => {
  const context = useContext(CardContext);
  if (context == undefined) {
    throw new Error("useCart must be used within a CardProvider");
  }
  return context;
};
