<template>
	<div class="example">{{ msg }}
		<img src="./assets/hiroseSuzu.jpg" alt="">
	</div>
</template>

<script>
	export default {
		data() {
			return {
				msg: 'niconiconi!'
			}
		}
	}
</script>

<style lang="scss">
	.example {
		color: red;
		display: flex;
		transform: translate(10px, 50px)
	}
</style>