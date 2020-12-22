<template>
	<!--<div class="col-6 col-sm-3 col-md-3 col-lg-2 col-xl-2 align-self-start" style="padding: 5px;">-->
		<button @click="click" class="btn btn-danger btn-no-hover" type="button" style="padding: 1px; width: 100%;" v-bind:style="{'background-color': book.border_color, 'background-color': book.border_color, 'border-color': book.border_color}">
			<div class="card" style="border-width: 1px;border-color: #151515; width: 100%">

				<div style="position: relative; overflow: hidden; padding-bottom: 100%; display: flex; justify-content: center; background-color: #1f1f1f;">
					<img class="img" style="position: absolute; top: 0px; height: 100%; max-height: 250px; max-width: 250px"  v-bind:src="purl" @error="has_errored_image = true"/>
				</div>

				<div class="card-body text-center text-white" style="padding-top: 6px;padding-bottom: 0px;padding-left: 7px;padding-right: 6px;background: #1f1f1f;">
					<p class="card-title" style="font-weight: lighter">{{ book.name }}</p>
				</div>
			</div>
		</button>
	<!--</div>-->
</template>

<script>
	import no_img from '../assets/img/no_image.png';

	export default {
		name: "LibraryItem",
		components: {  },
		props: {
			book: Object,
			id: Number,
		},
		computed: {
			purl() {
				return this.has_errored_image ? this.imp.no_img : this.book.picture_url;
			}
		},
		data() {
			return {
				has_errored_image: false,
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