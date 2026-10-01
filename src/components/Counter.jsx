import { useState } from "react";
import { Button } from "./ui/button";

export const Counter = ({ count, setCount }) => {
  const [isUser, setIsUser] = useState(true);

  function handleIncrease() {
    setCount(count + 1);
  }

  function handleDecrease() {
    setCount((prev) => prev - 1);
  }

  function reset() {
    setCount(0);
  }
  return (
    <span className="border rounded flex flex-col mt-10">
      <p>You clicked {count} times!</p>
      <div className="flex gap-4">
        <Button
          className={"size-6 flex items-center justify-center"}
          onClick={handleDecrease}
        >
          -
        </Button>
        <Button
          className="bg-destructive text-primary-foreground"
          onClick={reset}
        >
          reset
        </Button>
        <Button
          className={"size-6 flex items-center justify-center"}
          onClick={handleIncrease}
        >
          +
        </Button>
      </div>

      {/* <button onClick={() => setIsUser(!isUser)}>Toggle user</button>
      {isUser ? (
        <div>Hello, you are online</div>
      ) : (
        <div>Hello, you are offline</div>
      )} */}
    </span>
  );
};
