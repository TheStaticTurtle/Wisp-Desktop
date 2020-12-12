<template>
	<div class="row" style="background: #313131;padding-bottom: 16px;">
		<div class="col-12 col-lg-2 col-xl-2 text-light" style="padding-top: 15px;text-align: center;">
			<span class="d-block" @click="gotoBook" style="cursor: pointer">
				<strong>{{ player.book ? player.book.name : "" }}</strong>
			</span>
			<span class="d-block">{{ player.chapter ? player.chapter.chapter_name : ""}}</span>
		</div>
		<div class="col-12 col-lg-8 d-flex align-items-center">
			<div class="container-fluid">
				<div class="row" style="margin-top: 16px;">
					<div class="col pt-0 " style="font-size: 20px;text-align: center;padding: 15px;">
						<a @click="()=>{if(enable_controls) $emit('playerControl','previous');}" v-bind:class="{'disabled-link':!enable_controls, 'text-light':enable_controls}" class="no-underline control-buttons pt-md-0" href="#" style="padding: 20px;">
							<i class="icon-control-start"></i>
						</a>
						<a @click="()=>{if(enable_controls) $emit('playerControl','playpause'); }" v-bind:class="{'disabled-link':!enable_controls, 'text-light':enable_controls}" class="no-underline control-buttons pt-md-0" href="#" style="padding: 20px;">
							<i v-bind:class="{ 'icon-control-pause': player.playing, 'icon-control-play': !player.playing }" class="icon-control-play"></i>
						</a>
						<a @click="()=>{if(enable_controls) $emit('playerControl','next'); }" v-bind:class="{'disabled-link':!enable_controls, 'text-light':enable_controls}" class="no-underline control-buttons pt-md-0" href="#" style="padding: 20px;">
							<i class="icon-control-end"></i>
						</a>
					</div>
				</div>
				<div class="row">
					<div class="col-2 text-right text-white" style="padding: 0px;">
						<span v-bind:class="{'disabled-link':!enable_controls}" >{{ getHumanPosition }}</span>
					</div>
					<div class="col-8 text-white d-flex justify-content-center align-items-center">
						<div draggable="false" class="progress" v-bind:class="{'disabled-progress':!enable_controls}"  style="width: 100%;height: 7px;">
							<div
									v-bind:class="{ 'progress-bar-striped': player.buffering_audio, 'bg-danger': player.playing, 'bg-warning': player.buffering_audio || !player.playing}"
									class="progress-bar progress-bar-animated"
									v-bind:aria-valuenow="progress"
									aria-valuemin="0"
									v-bind:aria-valuemax="player.current_file_duration"
									v-bind:style="{width: (progress / player.current_file_duration * 100)+'%'}
								">
								<span class="sr-only">{{progress}}%</span>
							</div>
						</div>
						<input
								@mouseup="is_draging = false"
								@mousedown="is_draging = true"
								v-model="progress"
								v-bind:class="{'slider-thumb-red-dark':player.playing,'slider-thumb-orange-dark':player.buffering_audio || !player.playing, 'hidden': this.player.buffering_audio||this.player.current_file_duration===0}"
								style="position: absolute; top:10px; left:14px; height: 5px; width: calc(100% - 28px); z-index:2;"
								class="slider-progress"
								type="range"
								id="myRange2"
								min="0"
								v-bind:max="player.current_file_duration"
								step="1"
						>
					</div>
					<div class="col-2 text-white" style="padding: 0px;">
						<span v-bind:class="{'disabled-link':!enable_controls}" >{{ getHumanDuration }}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="col-12 col-lg-2 col-xl-2 d-flex flex-column justify-content-center">

			<div v-if="enable_controls"  class="row no-gutters m-0">
				<div class="col-1 col-sm-1 col-md-1 d-lg-none"></div>

				<div class="col col-lg-12 d-flex mt-1 justify-content-center" style="text-align: center;">
					<span class="">Volume: {{range_volume_control}}%</span>
				</div>
				<div class="col col-lg-12 d-flex align-items-center" style="font-size: 20px;text-align: center;">
					<a class="text-light" href="#" style="padding-right: 20px;">
						<i class="fa fa-volume-up"></i>
					</a>
					<input @dblclick="range_volume_control = 85" v-model="range_volume_control" class="slider slider-thumb-red" type="range" id="myRange" min="0" max="100"  style="height: 4px;">
				</div>

				<div class="col-2 d-sm-none d-md-none d-xl-none d-lg-none"/>
				<div class="col-12 d-sm-none d-md-none d-xl-none d-lg-none mb-1"/>
				<div class="col-1 d-sm-none d-md-none d-xl-none d-lg-none"/>

				<div class="col col-lg-12 d-flex mt-1 justify-content-center" style="text-align: center;">
					<span class="">Speed: {{range_speed_control}}%</span>
				</div>
				<div class="col col-lg-12 d-flex align-items-center" style="font-size: 20px;text-align: center;">
					<a class="text-light" href="#" style="padding-right: 20px;">
						<i class="icon-speedometer"></i>
					</a>
					<input @dblclick="range_speed_control = 100" v-model="range_speed_control" class="slider slider-thumb-orange" type="range" min="25" max="250" step="15" style="height: 4px;" >
				</div>

				<div class="col-2 col-sm-2 col-md-2 d-lg-none"></div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "PlayerControls",
		computed: {
			getHumanPosition() {
				return new Date((this.player.current_file_position ? this.player.current_file_position : 0) * 1000).toISOString().substr(11, 8)
			},
			getHumanDuration() {
				//return new Date(this.duration * 1000).toISOString().substr(11, 8)
				console.log(this.player.current_file_duration)
				return new Date((this.player.current_file_duration ? this.player.current_file_duration : 0) * 1000).toISOString().substr(11, 8)
			},
		},
		methods: {
			gotoBook() {
				this.$emit("GotoCurrentBook", {})
			},
			emitValues: function () {
				this.$emit("VSUpdate", {
					speed: this.processed_speed,
					volume: this.processed_volume
				})
			}
		},
		watch: {
			range_speed_control(chg) {
				this.processed_speed = chg / 100.0;
				this.emitValues();
			},
			range_volume_control(chg) {
				this.processed_volume = chg / 100.0;
				this.emitValues();
			},
			player: {
				handler () {
					this.progress = this.is_draging ? this.progress : (this.player.buffering_audio ? this.player.current_file_duration : this.player.current_file_position)
					/*this.duration = this.player.current_file_duration
					console.log(this.player.current_file_duration)*/
				},
				deep: true
			},
			progress(chg) {
				if(this.is_draging) this.$emit('PositionUpdate',chg)
			}
		},

		props: {
			player: Object,
			enable_controls: Boolean
		},
		data() {
			return {
				is_draging: false,

				drag_progress: 50,
				progress: 0,
				//duration: 0,

				range_speed_control: 100,
				range_volume_control: 85,
				processed_speed: 1,
				processed_volume: 1,
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
		*/

	}
</script>

<style scoped>

</style>