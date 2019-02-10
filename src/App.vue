<template>
	<div class="example">{{ msg }}
		<img src="./assets/hiroseSuzu.jpg" alt="">
	</div>
</template>

<script>
	export default {
		data() {
			return {
				msg: process.env.NODE_ENV 
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