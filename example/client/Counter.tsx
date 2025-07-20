import * as _Preact from "preact"; // Required in all .tsx files.
import { useSignal } from "@preact/signals";

export function Counter() {
  const count = useSignal(0);

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
