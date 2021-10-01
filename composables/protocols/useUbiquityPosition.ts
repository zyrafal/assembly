import { computed, Ref, ref, watch } from "@nuxtjs/composition-api";
import { useBalances } from "../useBalances";
import { useBigNumber } from "../useBigNumber";
import { useToken } from "../useToken";
import { useWeb3 } from "@instadapp/vue-web3";
import { AbiItem } from "web3-utils";
import BigNumber from "bignumber.js";
import abis from "~/constant/abis";
import addresses from "~/constant/addresses";
import { useDSA } from "../useDSA";
import useEventBus from "../useEventBus";

export const position = ref<any>({
  twapPrice: "1",
  inventory: { uadBalance: 1 }
});

export function useUbiquityPosition() {
  const { library } = useWeb3();
  const { onEvent } = useEventBus();
  const { activeAccount } = useDSA();
  const { isZero, ensureValue, times, div, max, gt, toBN } = useBigNumber();

  const fetchPosition = async () => {
    if (!library.value) {
      return;
    }

    const resolveABI = abis.resolver.ubiquity;
    const resolveAddr = addresses.mainnet.resolver.ubiquity;
    const ubiquityInstance = new library.value.eth.Contract(
      resolveABI as AbiItem[],
      resolveAddr
    );

    position.value.twapPrice = await ubiquityInstance.methods
      .getTWAPPrice()
      .call();

    if (!activeAccount.value) {
      return;
    }
    position.value.inventory = await ubiquityInstance.methods
      .getUbiquityInventory(activeAccount.value.address)
      .call();
  };

  const twapPrice = computed(() =>
    ensureValue(position.value.twapPrice)
      .dividedBy(1e18)
      .toFixed()
  );
  const inventory = computed(() => position.value.inventory);
  console.log("INVENTORY", inventory);
  watch(
    library,
    async val => {
      if (val) {
        fetchPosition();
      }
    },
    { immediate: true }
  );

  watch(
    activeAccount,
    async val => {
      if (val) {
        fetchPosition();
      }
    },
    { immediate: true }
  );

  onEvent("protocol::ubiquity::refresh", fetchPosition);

  return { twapPrice, inventory };
}
