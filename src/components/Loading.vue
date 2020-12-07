<template>
	<div class="container-fluid text-light d-flex flex-column justify-content-center align-items-center" style="height: 100%;">
		<div class="row no-gutters bounce animated infinite">
			<div class="col d-flex justify-content-center align-items-center">
				<div class="rubberBand animated infinite" style="width: 201px;height: 201px;border-radius: 50%;border-width: 4px;border-style: solid;position: relative;"></div>
				<i class="icon-music-tone-alt pulse animated infinite" style="font-size: 100px;position: absolute;/*transform: translateX(-0.6em);*/"></i>
			</div>
		</div>
		<div class="row" style="margin-top: 15px;">
			<div class="col">
				<h1>Loading</h1>
			</div>
		</div>
		<div v-if="text !== ''" class="row">
			<div class="col">
				<p>{{ text }}</p>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "Loading",
		props: {
			text: String
		}
	}
</script>

<style scoped>
	@import "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css";
</style>