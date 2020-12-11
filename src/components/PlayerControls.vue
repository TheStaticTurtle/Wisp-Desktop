<template>
	<div class="row" style="background: #313131;padding-bottom: 16px;">
		<div class="col-md-2 col-lg-2 col-xl-2 text-light" style="padding-top: 15px;text-align: center;">
			<span class="d-block">
				<strong>{{ player.book_name }}</strong>
			</span>
			<span class="d-block">{{ player.chapter_name }}</span>
		</div>
		<div class="col-md-8 col-lg-8 col-xl-8">
			<div class="row" style="min-height: 65px;margin-top: 16px;">
				<div class="col" style="font-size: 20px;text-align: center;padding: 15px;">
					<a @click="()=>{if(enable_controls) $emit('playerControl','previous');}" v-bind:class="{'disabled-link':!enable_controls, 'text-light':enable_controls}" class="control-buttons " href="#" style="padding: 20px;">
						<i class="icon-control-start"></i>
					</a>
					<a @click="()=>{if(enable_controls) $emit('playerControl','playpause'); }" v-bind:class="{'disabled-link':!enable_controls, 'text-light':enable_controls}" class="control-buttons" href="#" style="padding: 20px;">
						<i v-bind:class="{ 'icon-control-pause': player.playing, 'icon-control-play': !player.playing }" class="icon-control-play"></i>
					</a>
					<a @click="()=>{if(enable_controls) $emit('playerControl','next'); }" v-bind:class="{'disabled-link':!enable_controls, 'text-light':enable_controls}" class="control-buttons" href="#" style="padding: 20px;">
						<i class="icon-control-end"></i>
					</a>
				</div>
			</div>
			<div class="row">
				<div class="col-2 text-right text-white" style="padding: 0px;">
					<span v-bind:class="{'disabled-link':!enable_controls}" >{{ getHumanPosition }}</span>
				</div>
				<div class="col-8 text-white d-flex justify-content-center align-items-center">
					<div class="progress" v-bind:class="{'disabled-progress':!enable_controls}"  style="width: 100%;height: 7px;">
						<div v-bind:class="{ 'progress-bar-striped': player.buffering_audio, 'bg-danger': player.playing, 'bg-warning': player.buffering_audio || !player.playing}" class="progress-bar progress-bar-animated" v-bind:aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100" v-bind:style="{width: progress+'%'}">
							<span class="sr-only">{{progress}}%</span>
						</div>
					</div>
				</div>
				<div class="col-2 text-white" style="padding: 0px;">
					<span v-bind:class="{'disabled-link':!enable_controls}" >{{ getHumanDuration }}</span>
				</div>
			</div>
		</div>
		<div class="col-md-2 col-lg-2 col-xl-2 d-flex flex-column justify-content-center">
			<div v-if="enable_controls" class="row" style="margin-top: 16px;margin-bottom: 16px;">
				<div class="col d-flex justify-content-center align-items-center" style="font-size: 20px;text-align: center;margin-bottom: -16px;">
					<a class="text-light" href="#" style="padding-right: 20px;">
						<i class="fa fa-volume-up"></i>
					</a>
					<input class="slider slider-thumb-red" type="range" id="myRange" min="0" max="100" value="50" style="height: 4px;">
				</div>
			</div>
			<div v-if="enable_controls" class="row" style="margin-top: 16px;margin-bottom: 16px;">
				<div class="col d-flex justify-content-center align-items-center" style="font-size: 20px;text-align: center;margin-bottom: -16px;">
					<a class="text-light" href="#" style="padding-right: 20px;">
						<i class="icon-speedometer"></i>
					</a>
					<input class="slider slider-thumb-orange" type="range" id="myRange-1" min="0" max="100" value="50" style="height: 4px;">
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "PlayerControls",
		computed: {
			getHumanPosition() {
				/*let a = ""+Math.floor(this.current_file_position/60)
				let b = ""+this.current_file_position%60
				a = a.length<2 ? "0"+a : a
				b = b.length<2 ? "0"+b : b
				return a+":"+b*/
				return new Date(this.player.current_file_position * 1000).toISOString().substr(11, 8)
			},
			getHumanDuration() {
				/*let a = ""+Math.floor(this.current_file_duration/60)
				let b = ""+this.current_file_duration%60
				a = a.length<2 ? "0"+a : a
				b = b.length<2 ? "0"+b : b
				return a+":"+b*/
				return new Date(this.player.current_file_duration * 1000).toISOString().substr(11, 8)
			},
		},
		watch: {
			player: {
				handler () {
					this.progress = this.player.buffering_audio ? 100 : (this.player.current_file_position / this.player.current_file_duration * 100)
				},
				deep: true
			},
		},

		props: {
			player: Object,
			enable_controls: Boolean
		},
		data() {
			return {
				progress: 0
			}
		}
		/*
		data() {
			return {
				buffering_audio: false,
				playing: false,

				book_name: "temp placehoder",
				chapter_name: "pt1",
				current_file_position: 0,
				current_file_duration: 0,

				current_volume: 1,
				current_speed: 1,

				sound_current: null,
				sound_next: null,
				file_sound_current: "",
				file_sound_next: "",
			}
		},
		methods: {
			toggle_play_pause() {
				if(this.playing) this.sound_current.pause()
				else this.sound_current.play()
			},
			start_play_file(file, next_file) {
				if(this.sound_current!=null) this.sound_current.pause();
				if(this.sound_next!=null) this.sound_next.pause();

				if(this.file_sound_current === "") {
					this.sound_current = new Audio("safe-file-protocol://"+encodeURIComponent(file));
					this.file_sound_current = file
					if(next_file !== "") {
						this.sound_next = new Audio("safe-file-protocol://"+encodeURIComponent(next_file));
						this.file_sound_next = next_file
					}
				}
				else if(file === this.file_sound_next) { //Do we already have the next file prepared ?
					this.sound_current = this.sound_next;
					this.file_sound_current = this.file_sound_next;

					if(next_file !== "") {
						this.sound_next = new Audio("safe-file-protocol://"+encodeURIComponent(next_file));
						this.file_sound_next = next_file
					}
				} else { //Nope reprepare it
					this.sound_current = new Audio("safe-file-protocol://"+encodeURIComponent(file));
					this.file_sound_current = file
					if(next_file !== "") {
						this.sound_next = new Audio("safe-file-protocol://"+encodeURIComponent(next_file));
						this.file_sound_next = next_file
					}
				}

				this.sound_current.play();
				this.sound_current.volume = this.current_volume;
				this.sound_current.playbackRate  = this.current_speed;

				const t = this;
				t.buffering_audio = true
				this.sound_current.addEventListener('canplaythrough', (event) => {
					console.log(event)
					t.buffering_audio = false
				});
				this.sound_current.addEventListener('play', () => {
					t.playing = true
				});
				this.sound_current.addEventListener('pause', () => {
					t.playing = true
				});
				this.sound_current.addEventListener('pause', () => {
					t.playing = false
				});
				this.sound_current.addEventListener('ended', () => {
					t.playing = false
				});
				this.sound_current.addEventListener('timeupdate', () => {
					t.current_file_position = t.sound_current.currentTime
					t.buffering_audio = false
				});
				this.sound_current.addEventListener('durationchange', () => {
					t.current_file_duration = t.sound_current.duration
				});
				this.sound_current.addEventListener('volumechange', () => {
					t.current_volume = t.sound_current.volume
				});
				this.sound_current.addEventListener('ratechange', () => {
					t.current_speed = t.sound_current.playbackRate
				});
			}
		}*/
	}
</script>

<style scoped>

</style>