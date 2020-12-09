<template>
	<div class="container-fluid d-flex flex-column" style="height: 100%;">
		<div class="row flex-grow-1">
			<template  v-if="!is_loading">
				<PlayerNavigation :display_player_related="display_controls" :player="player" @navigationClick="navigationClick"></PlayerNavigation>
				<PlayerLibrary v-if="current_view === 'LIBRARY'" :books="books" @libraryBookClick="libraryBookClick"></PlayerLibrary>
				<PlayerBook v-if="current_view === 'BOOK'" :book="book_view_display_which_book"></PlayerBook>
			</template >

			<div v-if="is_loading"  class="col-md-12 col-lg-12 col-xl-12 offset-xl-0 d-flex flex-column visible" style="padding-top: 25px;padding-left: 24px;padding-right: 24px;">
				<Loading v-bind:text="loading_text"></Loading>
			</div>
		</div>
		<PlayerControls v-if="display_controls" :player="player"></PlayerControls>
	</div>
</template>

<script>
	import PlayerControls from "./PlayerControls";
	import PlayerLibrary from "./PlayerLibrary";
	import PlayerNavigation from "./PlayerNavigation";
	import Loading from "./Loading";
	import PlayerBook from "./PlayerBook";

	//const Audio = require("./../controllers/AudioPlayer")
	//const {Howl} = require('howler');

	export default {
		name: 'Player',
		components: {PlayerBook, Loading, PlayerNavigation, PlayerLibrary, PlayerControls},
		/*props: {
          msg: String
        }*/
		methods: {
			libraryBookClick(arg) {
				this.book_view_display_which_book = this.books[Math.max(Math.min(arg,this.books.length-1),0)];
				this.current_view = 'BOOK'
			},
			navigationClick(arg) {
				switch (arg) {
					case "HOME":
						this.current_view = 'LIBRARY'
						break;
					default:
						console.log(arg)
						break;
				}
			},
			change_file(file_path) {
				if(this.sound!=null) this.sound.pause();
				this.sound = new Audio("safe-file-protocol://"+file_path);
				/*this.sound = new Howl({
					src: ["safe-file-protocol://"+file_path],
					autoplay: false,
					loop: false,
					html5: true,
					volume: 0.5,
					onstart: function() {
						console.log('Started!');
					},
					onpause: function() {
						console.log('Paused!');
					},
					onend: function() {
						console.log('Finished!');
					},
					onseek : function(arg) {
						console.log('Seek: '+arg);
					}
				});*/
				this.sound.addEventListener('canplaythrough', function () {
					console.log("now")
				});
				return this.sound
			}
		},
		mounted() {

			const t = this
			this.$electron.ipcRenderer.send("force_reload");

			this.$electron.ipcRenderer.on('new_file', (e, data) => {
				this.change_file(data)
				console.log("START")
				this.sound.play()
				console.log("STARTE")
			})

			this.$electron.ipcRenderer.on('library_load', () => {
				t.loading_text = "";
				/*switch (arg) {
					case "start":
						t.is_loading = true;
						break;
					default:
						t.is_loading = false
						break;
				}*/
			})
			this.$electron.ipcRenderer.on('loading', () => {
				t.is_loading = true;
			})
			this.$electron.ipcRenderer.on('end_loading', () => {
				t.is_loading = false;
			})

			this.$electron.ipcRenderer.on('library_load_text', (event, arg) => {
				t.loading_text = arg
			})
			this.$electron.ipcRenderer.on('library_update', (event, arg) => {
				this.current_view = 'LIBRARY'
				t.books = arg;
			})

		},
		data() {
			return {
				sound: null,

				current_view: 'LIBRARY',

				display_controls: true,

				is_loading: false,
				loading_text: "",

				book_view_display_which_book: null,


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
