<script>
  export let inputVal;

  export function emptyMyInput() {
    inputVal = '';
  }

  $: console.log(inputVal);
</script>

<input type="text" bind:value="{inputVal}">