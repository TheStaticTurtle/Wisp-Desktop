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
		<PlayerControls v-if="display_controls" :player="player" @playerControl="playerControlCB"></PlayerControls>
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
		data() {
			return {
				current_view: 'LIBRARY',

				display_controls: true,

				is_loading: false,
				loading_text: "",

				book_view_display_which_book: null,

				books: [],

				player: {
					image_url: "https://play-lh.googleusercontent.com/_b0GMcmNNohcFugJ-89sG3XAexek1A0EacfTcDoCfTVbz4hKGP6PIQ1Psme66qZBGmeR537rJON2rA",
					book_name: "HP03: Harry Potter And The Prisoner Of Askaban",
					chapter_name: "Chapter 09 - Grim defeat",

					playing: false,

					current_file_position: 0,
					current_file_duration: 0,

					current_volume: 1,
					current_speed: 1,

					sound_current: null,
					sound_next: null,
					file_sound_current: "",
					file_sound_next: "",
				},
			}
		},
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

			send_player_status_over_ipc() {

				this.$electron.ipcRenderer.send("player_update", {
					playing: this.player.playing,
					current_file_position: this.player.current_file_position,
					current_file_duration: this.player.current_file_duration,
					current_volume: this.player.current_volume,
					current_speed: this.player.current_speed,
					file_sound_current: this.player.file_sound_current,
					file_sound_next: this.player.file_sound_next,
				});
			},
			playerControlCB(arg) {
				switch (arg) {
					case "playpause":
						this.player_toggle_pause();
						break;
					case "previous":
						if(this.player.current_file_position > 5) {
							this.player.sound_current.currentTime = 0;
							arg = "restart_file";
						}
					// Fallthrough is normal here
					case "next":
						this.$electron.ipcRenderer.send("player_control_request", arg)
						break;
					default:
						break;
				}
			},
			player_toggle_pause() {
				if(this.player.playing) this.player.sound_current.pause();
				else this.player.sound_current.play();
				this.send_player_status_over_ipc();
			},
			player_start_new_file(file, next_file) {
				if(this.player.sound_current!=null) this.player.sound_current.pause();
				if(this.player.sound_next!=null) this.player.sound_next.pause();

				if(this.player.file_sound_current === "") {
					this.player.sound_current = new Audio("safe-file-protocol://"+encodeURIComponent(file));
					this.player.file_sound_current = file
					if(next_file !== "") {
						this.player.sound_next = new Audio("safe-file-protocol://"+encodeURIComponent(next_file));
						this.player.file_sound_next = next_file
					}
				}
				else if(file === this.player.file_sound_next) { //Do we already have the next file prepared ?
					this.player.sound_current = this.player.sound_next;
					this.player.file_sound_current = this.player.file_sound_next;

					if(next_file !== "") {
						this.player.sound_next = new Audio("safe-file-protocol://"+encodeURIComponent(next_file));
						this.player.file_sound_next = next_file
					}
				} else { //Nope reprepare it
					this.player.sound_current = new Audio("safe-file-protocol://"+encodeURIComponent(file));
					this.player.file_sound_current = file
					if(next_file !== "") {
						this.player.sound_next = new Audio("safe-file-protocol://"+encodeURIComponent(next_file));
						this.player.file_sound_next = next_file
					}
				}

				this.player.sound_current.play();
				this.player.sound_current.volume = this.player.current_volume;
				this.player.sound_current.playbackRate  = this.player.current_speed;

				this.send_player_status_over_ipc();

				const t = this;
				t.player.buffering_audio = true
				this.player.sound_current.addEventListener('canplaythrough', () => {
					t.player.buffering_audio = false
					this.send_player_status_over_ipc();
				});
				this.player.sound_current.addEventListener('play', () => {
					t.player.playing = true
					this.send_player_status_over_ipc();
				});
				this.player.sound_current.addEventListener('pause', () => {
					t.player.playing = true
					this.send_player_status_over_ipc();
				});
				this.player.sound_current.addEventListener('pause', () => {
					t.player.playing = false
					this.send_player_status_over_ipc();
				});
				this.player.sound_current.addEventListener('ended', () => {
					t.player.playing = false
					this.send_player_status_over_ipc();
				});
				this.player.sound_current.addEventListener('timeupdate', () => {
					t.player.current_file_position = t.player.sound_current.currentTime
					t.player.buffering_audio = false
					this.send_player_status_over_ipc();
				});
				this.player.sound_current.addEventListener('durationchange', () => {
					t.player.current_file_duration = t.player.sound_current.duration
					this.send_player_status_over_ipc();
				});
				this.player.sound_current.addEventListener('volumechange', () => {
					t.player.current_volume = t.player.sound_current.volume
					this.send_player_status_over_ipc();
				});
				this.player.sound_current.addEventListener('ratechange', () => {
					t.player.current_speed = t.player.sound_current.playbackRate
					this.send_player_status_over_ipc();
				});
			}
		},
		mounted() {
			const t = this

			this.$electron.ipcRenderer.send("force_reload");

			this.$electron.ipcRenderer.on('player_chapter_update', (e, data) => {
				console.log(data)
				t.player.image_url = data.book.picture_url
				t.player.book_name = data.book.name
				t.player.chapter_name = data.chapter.chapter_name
				t.player_start_new_file(
					data.chapter.file_path,
					data.next_chapter !== null ? data.next_chapter.file_path : "",
				)
			})

			/*
				Event listeners concerning  the library
			 */
			this.$electron.ipcRenderer.on('library_load', () => {
				t.loading_text = "";
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
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
