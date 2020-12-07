<template>
	<div class="container-fluid d-flex flex-column" style="height: 100%;">
		<div class="row flex-grow-1">
			<PlayerNavigation v-if="!is_loading" :display_player_related="display_player" :player="player"></PlayerNavigation>
			<PlayerLibrary v-if="!is_loading" :books="books"></PlayerLibrary>

			<div v-if="is_loading"  class="col-md-12 col-lg-12 col-xl-12 offset-xl-0 d-flex flex-column visible" style="padding-top: 25px;padding-left: 24px;padding-right: 24px;">
				<Loading v-bind:text="loading_text"></Loading>
			</div>
		</div>
		<PlayerControls v-if="display_player" :player="player"></PlayerControls>
	</div>
</template>

<script>
	import PlayerControls from "./PlayerControls";
	import PlayerLibrary from "./PlayerLibrary";
	import PlayerNavigation from "./PlayerNavigation";
	import Loading from "./Loading";

	export default {
		name: 'Player',
		components: {Loading, PlayerNavigation, PlayerLibrary, PlayerControls},
		/*props: {
          msg: String
        }*/
		mounted() {
			const t = this
			this.$electron.ipcRenderer.on('library_load', (event, arg) => {
				switch (arg) {
					case "start":
						t.is_loading = true;
						break;
					default:
						t.is_loading = false
						break;
				}
			})
			this.$electron.ipcRenderer.on('library_load_text', (event, arg) => {
				t.loading_text = arg
			})
			this.$electron.ipcRenderer.on('library_update', (event, arg) => {
				t.books = arg
			})

		},
		data() {
			return {
				display_player: true,
				is_loading: false,
				loading_text: "",
				books: [
					/*{
						name: "HP01: Harry Potter And The Sorcerer Stone",
						picture_url: "https://kbimages1-a.akamaihd.net/5c287314-3696-47c6-b70c-50ce17d5a99a/1200/1200/False/harry-potter-and-the-sorcerer-s-stone-3.jpg",
						id: "aergzqesdfezfrgtyhujkio"
					}, */
				],
				player: {
					image_url: "https://play-lh.googleusercontent.com/_b0GMcmNNohcFugJ-89sG3XAexek1A0EacfTcDoCfTVbz4hKGP6PIQ1Psme66qZBGmeR537rJON2rA",
					book_name: "HP03: Harry Potter And The Prisoner Of Askaban",
					chapter_name: "Chapter 09 - Grim defeat",
					chapter_position: 8*60+35,
					chapter_duration: 35*60+1,
				},
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
