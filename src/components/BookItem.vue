<template>
	<tr
			class="custom_tr_body"
			@mouseover="is_hover = true"
			@mouseleave="is_hover = false"
			@dblclick="$emit('chapterPlayPause', {action:'play', what:chapter})"
	>

		<td v-if="!is_hover && ( !playing || !is_playing_this_one )" class="text-center">{{ chapter.chapter_no }}</td>
		<td v-if="!is_hover && is_playing_this_one && playing" class="text-center" style="padding-top: 14px;padding-bottom: 0px;"><i class="icon-volume-2" style="font-size: 19px;"></i></td>

		<td v-if="is_hover && ( !playing || !is_playing_this_one )" class="text-center" style="padding: 8px; padding-top: 13px;padding-bottom: 0px;">
			<button @click="$emit('chapterPlayPause', {action:'play', what:chapter})" class="btn btn-success float-none d-flex mx-auto justify-content-center align-items-center" type="button" style="padding: 2px 4px;">
				<i class="icon-control-play" style="font-size: 15px;"></i>
			</button>
		</td>
		<td v-if="is_hover && is_playing_this_one && playing" class="text-center" style="padding: 8px; padding-top: 14px; padding-bottom: 0px;">
			<button @click="$emit('chapterPlayPause', {action:'pause'})" class="btn btn-secondary float-none d-flex mx-auto justify-content-center align-items-center" type="button" style="padding: 2px 4px;">
				<i class="icon-control-pause" style="font-size: 17px;"></i>
			</button>
		</td>

		<td v-bind:class="{'text-danger':is_playing_this_one}"  >{{ chapter.chapter_name }}</td>
		<td class="text-center">{{ getHumanDuration() }}</td>
	</tr>
</template>

<script>
	export default {
		name: "BookItem",
		props: {
			chapter: Object,
			player_data: Object
		},
		data() {
			return {
				is_hover: false,
				is_playing_this_one: false,
				playing: false,
			}
		},
		methods: {
			getHumanDuration() {
				return new Date((this.chapter.chapter_duration ? this.chapter.chapter_duration : 0) * 1000).toISOString().substr(11, 8)
			},
			play() {
				this.$electron.ipcRenderer.send("player_play_chapter")
			},
			pause() {
				this.$electron.ipcRenderer.send("player_pause")
			}
		},
		watch: {
			player_data: {
				handler () {
					this.is_playing_this_one = this.chapter.unique_hash === this.player_data.chapter.unique_hash
					this.playing = this.player_data.playing
				},
				deep: true
			},
		},
		/*mounted() {
			const t = this;
			this.$electron.ipcRenderer.on('player_chapter_update', (event, new_chapter) => {
				t.is_playing_this_one = t.chapter.unique_hash === new_chapter.chapter.unique_hash
				t.is_playing_this_one = t.chapter.unique_hash === this.player_data.chapter_uh
			})
			this.$electron.ipcRenderer.on('player_update', (event, data) => {
			})
		},*/
	}
</script>

<style scoped>

</style>