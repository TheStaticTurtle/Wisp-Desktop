<template>
	<div class="container-fluid d-flex flex-column" style="height: 100vh;  overflow-x: hidden;">

		<!--
		TODO: Find a pure css version of displaying this f-king navigation bar properly. Just gave up here
		Maybe rename the component to PlayerNavigationTiny strip down all un-nessearies parts and replace PlayerNavigation with a new one that imports PlayerNavigationTiny
		-->
		<PlayerNavigation
				v-if="current_view!=='LIBRARIES'"
				class="d-sm-none"
				style="margin: -15px; padding: 15px 0; width: calc(100% + 30px);"
				:display_player_related="enable_controls"
				:player="player" @navigationClick="navigationClick"
				:config="config"
		></PlayerNavigation>

		<AppSettings
				style="padding: 0 0; "
				v-if="current_view==='LIBRARIES' && !is_loading"
				@navigationClick="navigationClick"
		></AppSettings>

		<div v-if="current_view!=='LIBRARIES' && !is_loading" class="row d-flex flex-grow-1">
			<!--TODO: CF toto ln 4 -->
			<PlayerNavigation class="d-none d-sm-flex" :display_player_related="enable_controls" :player="player" @navigationClick="navigationClick"></PlayerNavigation>

			<PlayerLibrary class="" v-if="current_view === 'LIBRARY'" :books="books" @libraryBookClick="libraryBookClick" @libraryBookPlay="libraryBookPlay"></PlayerLibrary>
			<PlayerBook  v-if="current_view === 'BOOK'" :player_data="player" :book="book_view_display_which_book" @chapterPlayPause="chapterPlayPauseCtls"></PlayerBook>
		</div>

		<div v-if="is_loading"  class="offset-xl-0 row d-flex flex-grow-1 visible" style="padding-top: 25px;padding-left: 24px;padding-right: 24px;">
			<Loading v-bind:text="loading_text"></Loading>
		</div>

		<div class="w-100">
			<PlayerControls
					:enable_controls="enable_controls"
					:player="player"
					:config="config"
					@playerControl="playerControlCB"
					@VSUpdate="playerVSUpdate"
					@PositionUpdate="playerPositionUpdate"
					@GotoCurrentBook="playerGotoCurrentBook"
			></PlayerControls>
		</div>
	</div>
</template>

<script>
	import PlayerControls from "./PlayerControls";
	import PlayerLibrary from "./PlayerLibrary";
	import PlayerNavigation from "./PlayerNavigation";
	import Loading from "./Loading";
	import PlayerBook from "./PlayerBook";
	import AppSettings from "./AppSettings";

	export default {
		name: 'Player',
		components: {AppSettings, PlayerBook, Loading, PlayerNavigation, PlayerLibrary, PlayerControls},
		data() {
			return {
				current_view: 'LIBRARY',

				enable_controls: false,

				is_loading: false,
				loading_text: "",

				book_view_display_which_book: null,

				libraries: [],
				books: [],
				config: {},

				player: {
					image_url: "",
					book: null,
					chapter: null,

					buffering_audio: false,
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
		watch: {
			player: {
				handler () {
					this.enable_controls = this.player.playing || this.player.sound_current != null
				},
				deep: true
			},
		},
		methods: {
			libraryBookClick(arg) {
				this.book_view_display_which_book = this.books[Math.max(Math.min(arg,this.books.length-1),0)];
				this.current_view = 'BOOK'
			},
			libraryBookPlay(arg) {
				this.$electron.ipcRenderer.send("player_read_new_book_request", this.books[Math.max(Math.min(arg,this.books.length-1),0)]);
			},
			navigationClick(arg) {
				switch (arg) {
					case "HOME":
						this.current_view = 'LIBRARY'
						break;
					case "LIBRARIES":
						this.current_view = 'LIBRARIES'
						break;
					default:
						console.log(arg)
						break;
				}
			},
			chapterPlayPauseCtls(arg) {
				if(arg.action === "pause" || arg.what.unique_hash === this.player.chapter_uh) this.player_toggle_pause()
				else {
					this.$electron.ipcRenderer.send("player_read_new_chapter_request", arg.what)
				}
				console.log(arg)
			},

			send_player_status_over_ipc() {
				this.$electron.ipcRenderer.send("player_update", {
					playing: this.player.playing,
					book: this.player.book,
					chapter: this.player.chapter,
					current_file_position: this.player.current_file_position,
					current_file_duration: this.player.current_file_duration,
					current_volume: this.player.current_volume,
					current_speed: this.player.current_speed,
				});
			},
			playerPositionUpdate(arg) {
				this.player.sound_current.currentTime = arg
			},
			playerVSUpdate(arg) {
				this.player.sound_current.playbackRate = arg.speed;
				this.player.sound_current.volume = arg.volume;
				this.send_player_status_over_ipc();
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
					case "fastbackward":
						this.$electron.ipcRenderer.send("player_control_request", arg)
						this.player.sound_current.currentTime -= this.config.jump_delay
						break;
					case "fastforward":
						this.$electron.ipcRenderer.send("player_control_request", arg)
						this.player.sound_current.currentTime += this.config.jump_delay
						break;
					default:
						break;
				}
				this.send_player_status_over_ipc();
			},
			playerGotoCurrentBook() {
				this.book_view_display_which_book = this.player.book;
				this.current_view = 'BOOK'
			},

			handler_chapter_end() {
				//console.log(this)
				if(this.player.file_sound_next !== "" && this.config.auto_continue_chapter) {
					this.$electron.ipcRenderer.send("player_control_request", "next")
				}
				this.send_player_status_over_ipc();
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
					}
					this.player.file_sound_next = next_file
				}
				else if(file === this.player.file_sound_next) { //Do we already have the next file prepared ?
					this.player.sound_current = this.player.sound_next;
					this.player.file_sound_current = this.player.file_sound_next;

					if(next_file !== "") {
						this.player.sound_next = new Audio("safe-file-protocol://"+encodeURIComponent(next_file));
					}
					this.player.file_sound_next = next_file
				} else { //Nope reprepare it
					this.player.sound_current = new Audio("safe-file-protocol://"+encodeURIComponent(file));
					this.player.file_sound_current = file
					if(next_file !== "") {
						this.player.sound_next = new Audio("safe-file-protocol://"+encodeURIComponent(next_file));
					}
					this.player.file_sound_next = next_file
				}

				this.player.sound_current.play();
				this.player.sound_current.volume = this.player.current_volume;
				this.player.sound_current.playbackRate  = this.player.current_speed;

				this.send_player_status_over_ipc();

				const t = this;
				t.player.buffering_audio = true
				this.player.sound_current.addEventListener('canplaythrough', () => {
					t.player.buffering_audio = false
					t.send_player_status_over_ipc();
				});
				this.player.sound_current.addEventListener('play', () => {
					t.player.playing = true
					t.send_player_status_over_ipc();
				});
				this.player.sound_current.addEventListener('pause', () => {
					t.player.playing = true
					t.send_player_status_over_ipc();
				});
				this.player.sound_current.addEventListener('pause', () => {
					t.player.playing = false
					t.send_player_status_over_ipc();
				});
				this.player.sound_current.addEventListener('ended', () => {
					t.player.playing = false
					t.handler_chapter_end()
					t.send_player_status_over_ipc();
				});
				this.player.sound_current.addEventListener('timeupdate', () => {
					t.player.current_file_position = t.player.sound_current.currentTime
					t.player.current_file_duration = t.player.sound_current.duration
					t.player.buffering_audio = false
					t.send_player_status_over_ipc();
				});
				this.player.sound_current.addEventListener('durationchange', () => {
					t.player.current_file_duration = t.player.sound_current.duration
					t.send_player_status_over_ipc();
				});
				this.player.sound_current.addEventListener('volumechange', () => {
					t.player.current_volume = t.player.sound_current.volume
					t.send_player_status_over_ipc();
				});
				this.player.sound_current.addEventListener('ratechange', () => {
					t.player.current_speed = t.player.sound_current.playbackRate
					t.send_player_status_over_ipc();
				});
			}
		},
		mounted() {
			const t = this

			this.$electron.ipcRenderer.send("force_reload");
			this.$electron.ipcRenderer.send("get_libraries");
			this.$electron.ipcRenderer.send("config_get");

			this.$electron.ipcRenderer.on('config_update', (e, data) => {
				t.config = data
				console.log("config_update")
			})

			this.$electron.ipcRenderer.on('player_chapter_update', (e, data) => {
				console.log(data)
				t.player.book = data.book
				t.player.chapter = data.chapter
				t.player_start_new_file(
					data.chapter.file_path,
					data.next_chapter !== null ? data.next_chapter.file_path : "",
				)
				console.log("player_chapter_update")
			})


			/*
				Event listeners concerning  the library
			 */
			this.$electron.ipcRenderer.on('loading', () => {
				t.loading_text = "";
				t.is_loading = true;
				console.log("loading")
			})
			this.$electron.ipcRenderer.on('end_loading', () => {
				t.is_loading = false;
				console.log("end_loading")
			})
			this.$electron.ipcRenderer.on('library_load_text', (event, arg) => {
				t.loading_text = arg
				console.log("library_load_text")
			})
			this.$electron.ipcRenderer.on('library_update', (event, arg) => {
				this.current_view = 'LIBRARY'
				t.books = arg;
				console.log("library_update")
			})
			this.$electron.ipcRenderer.on('libraries_update', (event, arg) => {
				t.libraries = arg
				console.log("libraries_update")
			})


		},
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
