import { useSignal } from "@preact/signals";

export interface CounterProps {
  startingValue: number;
}

export function Counter(props: CounterProps) {
  console.log(`props = ${JSON.stringify(props)}`);
  console.log(`props.startingValue = ${props.startingValue}`);
  const count = useSignal(props.startingValue);

  return (
    <>
      <div>Counter: {count}</div>
      <div class="flex flex-row gap-1">
        <button
          type="button"
          class="p-2 bg-gray-400"
          onClick={() => count.value++}
        >
          Increment
        </button>
        <button
          type="button"
          class="p-2 bg-gray-400"
          onClick={() => count.value--}
        >
          Decrement
        </button>
      </div>
    </>
  );
}
