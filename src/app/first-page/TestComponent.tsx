import { useEffect, useState } from "react";

export interface TestComponentParamsType {
  counter: number;
  pruductPart: string;
  quantityTest?: number;
}

export const TestComponent = ({
  counter,
  pruductPart,
  quantityTest,
}: TestComponentParamsType) => {
  const [count, setCount] = useState<number>(5);
  const [product, setProduct] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    setCount(counter);
    setProduct(pruductPart + "p");
    if (quantityTest) setQuantity(quantityTest);
  }, []);

  return (
    <div>
      TestComponent {count} - {product} - {quantity}
    </div>
  );
};
