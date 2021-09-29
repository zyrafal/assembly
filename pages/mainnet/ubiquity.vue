<template>
  <div>
    <div>
      <nuxt-link
        to="/"
        class="text-[#C0C5D7] text-lg font-semibold flex items-center"
      >
        <BackIcon class="w-4 h-4 mr-3" />
        Apps
      </nuxt-link>
    </div>

    <div class="mt-10 flex items-center justify-between">
      <div class="flex items-center">
        <div
          style="background: radial-gradient(42.15% 42.15% at 48.94% 48.94%, #D6DAE0 75.67%, #F0F3F9 100%), #C4C4C4;"
          class="w-16 h-16 rounded-full flex items-center justify-center border border-[#CCDCF3]"
        >
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center bg-[#1874FF]"
          >
            <UbiquityIcon class="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 class="ml-4 text-primary-black text-2xl font-semibold">Ubiquity</h1>
      </div>

      <ButtonCTAOutlined
        class="px-4 h-9 w-[173px]"
        @click="$router.push({ hash: 'strategies?protocol=ubiquity' })"
      >
        Strategies

        <svg
          class="ml-auto"
          width="11"
          height="10"
          viewBox="0 0 11 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4.3815 8.76139C4.38149 8.99703 4.64068 9.1407 4.8405 9.01581L10.859 5.25425C11.047 5.13675 11.047 4.86295 10.859 4.74545L4.84088 0.984069C4.64108 0.859187 4.38189 1.00283 4.38188 1.23845L4.38179 2.97869C4.38178 3.14437 4.24747 3.27867 4.08179 3.27867L1.23894 3.27867C1.07325 3.27867 0.93894 3.41299 0.93894 3.57867L0.93894 6.42096C0.93894 6.58664 1.07325 6.72096 1.23894 6.72096L4.08159 6.72096C4.24728 6.72096 4.3816 6.85528 4.38159 7.02097L4.3815 8.76139Z"
            fill="#1874FF"
          />
        </svg>
      </ButtonCTAOutlined>
    </div>

    <div class="mt-10">
      <h2 class="text-primary-gray text-lg font-semibold">Overview</h2>

      <div
        class="px-1 mt-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-3 xl:gap-[18px]"
      >
        <div class="shadow rounded-lg py-8 px-6 flex">
          <div class="flex-1">
            <h3 class="text-2xl text-primary-black font-medium">
              {{ formatUsd(0.9912312) }}
            </h3>
            <p class="mt-4 text-primary-gray font-medium">
              Time Weighted Average Price
            </p>
          </div>
          <div class="flex items-center">
            <SVGPrice class="h-12 text-primary-gray" />
          </div>
        </div>

        <div class="shadow rounded-lg py-8 px-6 flex">
          <div class="flex-1">
            <h3 class="text-2xl text-primary-black font-medium">
              {{ formatNumber(23123) }}
            </h3>
            <p class="mt-4 text-primary-gray font-medium">
              LP locked in Bonding Shares
            </p>
          </div>
          <div class="flex items-center">
            <SVGBalance class="h-12" />
          </div>
        </div>

        <div class="shadow rounded-lg py-8 px-6 flex">
          <div class="flex-1">
            <h3 class="text-2xl text-primary-black font-medium">
              {{ formatPercent(0.081757) }}
            </h3>
            <p class="mt-4 text-primary-gray font-medium">Pool ownership</p>
          </div>
          <div class="flex items-center">
            <SVGPercent class="h-12 " />
          </div>
        </div>

        <div class="shadow rounded-lg py-8 px-6 flex">
          <div class="flex-1">
            <h3 class="text-2xl text-primary-black font-medium">
              {{ formatNumber(6732.91287312) }}
            </h3>
            <p class="mt-4 text-primary-gray font-medium">
              Pending UBQ rewards
            </p>
          </div>
          <div class="flex items-center">
            <SVGBalance class="h-12" />
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto w-[512px] shadow rounded-[10px] px-8 py-12 mt-[40px]">
      <div class="mt-7">
        <button
          class="flex items-center justify-center flex-shrink-0 py-2 font-semibold text-white whitespace-no-wrap duration-75 ease-out transform rounded-[4px] select-none bg-ocean-blue-pure shadow-cta focus:outline-none dark:shadow-none px-8 h-16 w-full hover:-translate-y-px active:translate-y-px"
          @click="openSupply"
        >
          Deposit
          <!---->
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, useRouter } from "@nuxtjs/composition-api";
import BackIcon from "~/assets/icons/back.svg?inline";
import { useUbiquityPosition } from "~/composables/protocols/useUbiquityPosition";
import { useFormatting } from "~/composables/useFormatting";
import { useSearchFilter } from "~/composables/useSearchFilter";
import { useStatus } from "~/composables/useStatus";
import { useBigNumber } from "~/composables/useBigNumber";

import SVGBalance from "@/assets/img/icons/balance.svg?inline";
import SVGPrice from "@/assets/img/icons/price.svg?inline";
import SVGPercent from "@/assets/img/icons/percent.svg?inline";

import UbiquityIcon from "~/assets/icons/ubiquity.svg?inline";
import ButtonCTAOutlined from "~/components/common/input/ButtonCTAOutlined.vue";
import UbqInput from "~/components/common/input/InputNumeric.vue";

export default defineComponent({
  components: {
    SVGBalance,
    SVGPrice,
    SVGPercent,
    BackIcon,
    UbiquityIcon,
    UbqInput,
    ButtonCTAOutlined
  },
  setup() {
    const router = useRouter();

    const {
      formatUsd,
      formatUsdMax,
      formatPercent,
      formatDecimal,
      formatNumber,
      shortenHash
    } = useFormatting();

    const {} = useUbiquityPosition();

    function openSupply() {
      console.log("open");
      router.push({ hash: "supply" });
    }
    return {
      formatUsd,
      formatUsdMax,
      formatPercent,
      formatDecimal,
      formatNumber,
      shortenHash,

      openSupply
    };
  }
});
</script>
