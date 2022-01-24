<script>
  import CustomInput from "./CustomInput.svelte";
  import Toggle from "./Toggle.svelte";

  import { isValidEmail } from './validation.js';

	export let appName;

  let val = 'If u click "save", input will be cleared!';
  let selectedOption = 2;
  let price = 0;
  let agreed;
  let favColor = 'green';
  let myLang = ['tamil'];
  let howYouKnow = 'internet';
  let userNameInput;
  let elemetRf;
  let enteredEmail = '';
  let isFormValid = false;

  $: console.log(selectedOption);
  $: console.log('Price :', price);
  $: console.log('Agree? ', agreed);
  $: console.log('Fav. color :', favColor);
  $: console.log('Known Languages :', myLang);
  $: console.log('How I know you? ', howYouKnow);
  $: console.log(elemetRf);
  $: if(isValidEmail(enteredEmail)) {
    isFormValid = true;
  } else {
    isFormValid = false;
  }

  function saveData() {
    // const inputVal = document.getElementById('username').value;
    // console.log(inputVal);
    console.log(userNameInput.value);
    // calling exported functiom to clear input in customInput comp.
    elemetRf.emptyMyInput(); // elementRf is the local ref
  }
</script>

<style>
  .capitalize-it {
    text-transform: capitalize;
  }

  .invalid {
    border: 1px solid red;
  }
</style>

<h1 class="capitalize-it">{appName}!</h1>
<CustomInput bind:inputVal={val} bind:this="{elemetRf}" />
<Toggle bind:chosenOption="{selectedOption}" />
<input type="number" bind:value="{price}">
<label>
  <input type="checkbox" bind:checked="{agreed}">
  Agree to term?
</label>

<h2>Favorite color?</h2>
<label>
  <input type="radio" name="color" value="red" bind:group="{favColor}">
  Red
</label>
<label>
  <input type="radio" name="color" value="green" bind:group="{favColor}">
  Green
</label>
<label>
  <input type="radio" name="color" value="white" bind:group="{favColor}">
  White
</label>

<h2>Known Languages?</h2>

<label>
  <input type="checkbox" name="lang" value="tamil" bind:group="{myLang}">
  Tamil
</label>
<label>
  <input type="checkbox" name="lang" value="english" bind:group="{myLang}">
  English
</label>
<label>
  <input type="checkbox" name="lang" value="urdu" bind:group="{myLang}">
  Urdu
</label>

<h2>How you know about us?</h2>
<select bind:value="{howYouKnow}">
  <option value="whatsapp">WhatsApp Group</option>
  <option value="newspaper">Newspaper</option>
  <option value="internet">Some website / Blog</option>
  <option value="frind">My friend</option>
</select>

<hr>
<!-- Binding to element ref -->
<input type="text" id="username" bind:this="{userNameInput}">
<button on:click="{saveData}">Save</button>

<h2>Form Validation</h2>

<form on:submit|preventDefault>
  <input type="email" bind:value="{enteredEmail}" class="{isValidEmail(enteredEmail) ? '' : 'invalid'}">
  <button type="submit" disabled={!isFormValid}>Submit</button>
</form>