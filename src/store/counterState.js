import { proxy } from "valtio";

export const counterState = proxy({
  count: 0,
  increment() {
    counterState.count += 1;
  },
  decrement() {
    counterState.count -= 1;
  },
  reset() {
    counterState.count = 0;
  },
});
