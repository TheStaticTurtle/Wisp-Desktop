<template>
	<div class="container-fluid d-flex flex-column" style="height: 100%;">
		<div class="row flex-grow-1">
			<PlayerNavigation :display_player_related="display_player" :player="player"></PlayerNavigation>
			<PlayerLibrary :books="books"></PlayerLibrary>
		</div>
		<PlayerControls v-if="display_player" :player="player"></PlayerControls>
	</div>
</template>

<script>
	import PlayerControls from "./PlayerControls";
	import PlayerLibrary from "./PlayerLibrary";
	import PlayerNavigation from "./PlayerNavigation";
	export default {
		name: 'Player',
		components: {PlayerNavigation, PlayerLibrary, PlayerControls},
		/*props: {
          msg: String
        }*/
		data() {
			return {
				display_player: true,
				books: [
					{
						title: "HP01: Harry Potter And The Sorcerer Stone",
						image_url: "https://kbimages1-a.akamaihd.net/5c287314-3696-47c6-b70c-50ce17d5a99a/1200/1200/False/harry-potter-and-the-sorcerer-s-stone-3.jpg",
						id: "aergzqesdfezfrgtyhujkio"
					},
					{
						title: "HP02: Harry Potter And The Chamber Of Secrets",
						image_url: "https://kbimages1-a.akamaihd.net/eb9e1d90-5a4e-43e3-96a6-bba9a55f5c83/353/569/90/False/harry-potter-and-the-chamber-of-secrets-8.jpg",
						id: "azqesdfrgtyhekguzefregjkio"
					},
					{
						title: "HP03: Harry Potter And The Prisoner Of Askaban",
						image_url: "https://play-lh.googleusercontent.com/_b0GMcmNNohcFugJ-89sG3XAexek1A0EacfTcDoCfTVbz4hKGP6PIQ1Psme66qZBGmeR537rJON2rA",
						id: "azqfzeergfesdfrgtyhujkio"
					},
					{
						title: "HP04: Harry Potter And The Goblet Of Fire",
						image_url: "https://m.media-amazon.com/images/I/51g0LdfhtvL.jpg",
						id: "azqezgfesdfrgtyhujkeio"
					},
					{
						title: "HP05: Harry Potter And The Order Of The Phoenix",
						image_url: "https://m.media-amazon.com/images/I/51ok3DFBrRL._SL500_.jpg",
						id: "azqefzgfesdfrgtyhujkio"
					},
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
