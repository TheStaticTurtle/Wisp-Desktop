<template>
	<tr class="custom_tr_body" @mouseover="is_hover = true" @mouseleave="is_hover = false">

		<td v-if="!is_hover && !is_playing_this_one" class="text-center">{{ chapter.chapter_no }}</td>
		<td v-if="!is_hover && is_playing_this_one" class="text-center" style="padding-top: 14px;"><i class="icon-volume-2" style="font-size: 19px;"></i></td>

		<td v-if="is_hover && !is_playing_this_one" class="text-center" style="padding: 8px;"><button class="btn btn-success float-none d-xl-flex mx-auto justify-content-xl-center align-items-xl-center" type="button" style="padding: 2px 4px;"><i class="icon-control-play" style="font-size: 15px;"></i></button></td>
		<td v-if="is_hover && is_playing_this_one" class="text-center" style="padding: 8px;"><button class="btn btn-secondary float-none d-xl-flex mx-auto justify-content-xl-center align-items-xl-center" type="button" style="padding: 2px 4px;"><i class="icon-control-pause" style="font-size: 15px;"></i></button></td>

		<td>{{ chapter.chapter_name }}</td>
		<td class="text-center">{{ getHumanDuration() }}</td>
	</tr>
</template>

<script>
	export default {
		name: "BookItem",
		props: {
			chapter: Object,
			is_playing_this_one: Boolean,
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
		mounted() {
			const t = this;
			this.$electron.ipcRenderer.on('player_chapter_update', (event, new_chapter) => {
				t.is_playing_this_one = t.chapter.unique_hash === new_chapter.chapter.unique_hash
			})
		},
		data() {
			return {
				is_hover: false,
			}
		}
	}
</script>

<style scoped>

</style>