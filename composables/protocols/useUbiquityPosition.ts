import { computed, Ref, ref, watch } from "@nuxtjs/composition-api";
import { useBalances } from "../useBalances";
import { useBigNumber } from "../useBigNumber";
import { useToken } from "../useToken";
import { useWeb3 } from "@instadapp/vue-web3";
import { AbiItem } from "web3-utils";
import BigNumber from "bignumber.js";
BigNumber.config({ POW_PRECISION: 200 });
import abis from "~/constant/abis";
import addresses from "~/constant/addresses";
import { useDSA } from "../useDSA";
import useEventBus from "../useEventBus";

export const trove = ref<any>({
  collateral: "0",
  debt: "0",
  stabilityAmount: "0",
  stabilityEthGain: "0",
  stabilityLqtyGain: "0",
  stakeAmount: "0",
  stakeEthGain: "0",
  stakeLqtyGain: "0",
  price: "0",
  ratio: "0",
  tokenKey: "eth",
  token: "ETH",
  liquidation: "0"
});

export const ubiquityTypes = ref([
  {
    totalCollateral: "0",
    price: "0",
    totalRatio: "0",
    tokenKey: "eth",
    token: "ETH",
    isRecoveryMode: false,
    borrowFee: "0",
    liquidation: "0",
    minDebt: "2000",
    liquidationReserve: "200"
  }
]);

export function useUbiquityPosition(
  collateralAmountRef: Ref = null,
  debtAmountRef: Ref = null
) {
  const { library } = useWeb3();
  const { onEvent } = useEventBus();
  const { activeAccount } = useDSA();

  const { isZero, times, div, max, minus, plus } = useBigNumber();
  const { getTokenByKey, valInt } = useToken();
  const { prices } = useBalances();

  const collateralToken = computed(() => getTokenByKey("eth"));
  const debtToken = computed(() => getTokenByKey("lusd"));
  const stakingToken = computed(() => getTokenByKey("lqty"));

  onEvent("protocol::liquity::refresh", fetchPosition);

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

  return {
    collateralToken,
    debtToken
  };
}

async function fetchPosition() {}

async function getTrove(user, web3) {
  const resolveABI = abis.resolver.liquity;
  const resolveAddr = addresses.mainnet.resolver.liquity;

  const liquityInstance = new web3.eth.Contract(
    resolveABI as AbiItem[],
    resolveAddr
  );

  try {
    const {
      trove,
      stake,
      stability
    } = await liquityInstance.methods.getPosition(user).call();
    const { collateral, debt, icr, price } = trove;
    const ratio =
      icr ===
      "115792089237316195423570985008687907853269984665640564039457584007913129639935"
        ? "0"
        : new BigNumber(1e18).dividedBy(icr).toString();

    return {
      collateral: new BigNumber(collateral).dividedBy(1e18).toString(),
      debt: new BigNumber(debt).dividedBy(1e18).toString(),
      stabilityAmount: new BigNumber(stability.deposit)
        .dividedBy(1e18)
        .toString(),
      stabilityEthGain: new BigNumber(stability.ethGain)
        .dividedBy(1e18)
        .toString(),
      stabilityLqtyGain: new BigNumber(stability.lqtyGain)
        .dividedBy(1e18)
        .toString(),
      stakeAmount: new BigNumber(stake.amount).dividedBy(1e18).toString(),
      stakeEthGain: new BigNumber(stake.ethGain).dividedBy(1e18).toString(),
      stakeLqtyGain: new BigNumber(stake.lusdGain).dividedBy(1e18).toString(),
      price: new BigNumber(price).dividedBy(1e18).toString(),
      ratio,
      tokenKey: "eth",
      token: "ETH",
      liquidation: ratio
    };
  } catch (error) {
    console.error(error);
    return {};
  }
}

async function getTroveTypes(web3) {
  try {
    const resolveABI = abis.resolver.liquity;
    const resolveAddr = addresses.mainnet.resolver.liquity;

    const liquityInstance = new web3.eth.Contract(
      resolveABI as AbiItem[],
      resolveAddr
    );
    const {
      borrowFee,
      ethTvl,
      isInRecoveryMode: isRecoveryMode,
      tcr,
      price
    } = await liquityInstance.methods.getSystemState().call();

    return [
      {
        totalCollateral: new BigNumber(ethTvl).dividedBy(1e18).toString(),
        price: new BigNumber(price).dividedBy(1e18).toString(),
        totalRatio: new BigNumber(1e18).dividedBy(tcr).toString(),
        tokenKey: "eth",
        token: "ETH",
        isRecoveryMode,
        borrowFee: new BigNumber(borrowFee).dividedBy(1e18).toString(),
        liquidation: new BigNumber(100).dividedBy(110).toString(),
        minDebt: new BigNumber(2000).toString(),
        liquidationReserve: "200"
      }
    ];
  } catch (error) {
    return [];
  }
}
