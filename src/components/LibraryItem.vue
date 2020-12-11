<template>
	<div class="col-sm-3 col-md-2 col-lg-2 col-xl-2 offset-xl-0 align-self-start" style="padding: 5px;">
		<button @click="click" class="btn btn-primary" type="button" style="padding: 1px; width: 100%">
			<div class="card" style="border-width: 1px;border-color: #151515; width: 100%">

				<div style="position: relative; overflow: hidden; padding-bottom: 100%; display: flex; justify-content: center; background-color: #1f1f1f;">
					<img class="img" style="position: absolute; top: 0px; height: 100%;" v-bind:src="purl" @error="purl = imp.no_img"/>
				</div>

				<div class="card-body text-center text-white" style="padding-top: 6px;padding-bottom: 0px;padding-left: 7px;padding-right: 6px;background: #1f1f1f;">
					<p class="card-title" style="font-weight: lighter">{{ name }}</p>
				</div>
			</div>
		</button>
	</div>
</template>

<script>
	import no_img from '../assets/img/no_image.png';

	export default {
		name: "LibraryItem",
		props: {
			picture_url: String,
			name: String,
			id: Number,
		},
		data() {
			return {
				purl: this.picture_url,
				imp: {
					no_img:no_img
				}
			}
		},
		methods: {
			click() {
				this.$emit('libraryBookClick', this.id)
			}
		},
	}
</script>

<style scoped>

</style>