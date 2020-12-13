<template>
	<div class="col d-flex flex-column visible" style="">
		<nav class="navbar navbar-light m-0 p-0 d-flex mt-3">
			<div class="row w-100">
				<div class="col">
					<button @click="goto_home" class="btn btn-lg btn-outline-light">
						<i class="icon-arrow-left" style="margin-right: 20px;"></i>Back
					</button>
				</div>
				<div class="col d-flex justify-content-center">
					<h1 class="app-title">Wisp libraries</h1>
				</div>
				<div class="col">
				</div>
			</div>
		</nav>
	</div>
</template>

<script>
	export default {
		name: "AppLibraries",
		components: {  },
		props: {
		},
		mounted() {
		},
		data() {
			return {
			}
		},
		watch: {
		},
		methods: {
			goto_home() {
				this.$emit('navigationClick', "HOME")
			},
		}
	}
</script>

<style scoped>

</style>