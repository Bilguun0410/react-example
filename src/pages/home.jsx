import { useState } from "react";
import { Counter } from "../components/Counter";

export default function HomePage() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <Counter count={count} setCount={setCount} />
    </div>
  );
}
