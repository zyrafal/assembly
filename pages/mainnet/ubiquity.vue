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

    <div class="mt-10 flex items-center">
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
    </div>

    <div class="mx-auto w-[512px] shadow rounded-[10px] px-8 py-12">

       <h3 class="text-primary-gray text-lg font-semibold mb-4">LP amout to Deposit (uAD3CRV-f)</h3>

      <UbqInput      />

<div class="mt-7"><button class="flex items-center justify-center flex-shrink-0 py-2 font-semibold text-white whitespace-no-wrap duration-75 ease-out transform rounded-[4px] select-none bg-ocean-blue-pure shadow-cta focus:outline-none dark:shadow-none px-8 h-16 w-full hover:-translate-y-px active:translate-y-px">Deposit <!----></button></div>

    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, computed } from "@nuxtjs/composition-api";
import BackIcon from "~/assets/icons/back.svg?inline";
import { useUbiquityPosition } from "~/composables/protocols/useUbiquityPosition";
import { useFormatting } from "~/composables/useFormatting";
import { useSearchFilter } from "~/composables/useSearchFilter";
import { useStatus } from "~/composables/useStatus";
import { useBigNumber } from "~/composables/useBigNumber";
import UbiquityIcon from "~/assets/icons/ubiquity.svg?inline";
import ButtonCTAOutlined from "~/components/common/input/ButtonCTAOutlined.vue";
import UbqInput from "~/components/common/input/InputNumeric.vue";

export default defineComponent({
  components: {
    UbiquityIcon,
    UbqInput
  },
  setup() {
    const {
    } = useUbiquityPosition();


    return {
    };
  }
});
</script>
