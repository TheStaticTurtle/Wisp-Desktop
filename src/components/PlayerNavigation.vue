<template>
	<div class="col-md-2 col-lg-2 col-xl-2 d-flex flex-column" style="background: #1f1f1f;">
		<div class="row flex-grow-1">
			<div class="col text-light" style="padding-top: 16px;">
				<div class="row" style="padding: 8px;padding-bottom: 4px;">
					<div class="col"><a @click="goto_home" class="text-light no-underline" href="#" style="font-size: 25px;"><i class="icon-home" style="margin-right: 20px;"></i>Home</a></div>
				</div>
				<div class="row" style="padding: 8px;padding-bottom: 4px;">
					<div class="col"><a class="text-light no-underline" href="#" style="font-size: 25px;"><i class="icon-magnifier" style="margin-right: 20px;"></i>Search</a></div>
				</div>
				<div class="row" style="padding: 8px;padding-bottom: 4px;">
					<div class="col"><a @click="reload_library" class="text-light no-underline" href="#" style="font-size: 25px;"><i class="icon-reload" style="margin-right: 20px;"></i>Reload</a></div>
				</div>
				<div class="row" style="padding: 8px;padding-bottom: 4px;">
					<div class="col"><a @click="resync_library" class="text-light no-underline" href="#" style="font-size: 25px;"><i class="icon-refresh" style="margin-right: 20px;"></i>Resync</a></div>
				</div>
			</div>
		</div>
		<div v-if="display_player_related" class="row">
			<div class="col" style="padding-bottom: 8px;padding-right: 8px;padding-left: 8px;">
				<hr style="background: #ffffff;">
				<img style="width: 100%;" v-bind:src="player.book.picture_url">
			</div>
		</div>
	</div>
</template>

<script>

	export default {
		name: "PlayerNavigation",
		methods: {
			goto_home() {
				this.$emit('navigationClick', "HOME")
			},
			reload_library() {
				this.$electron.ipcRenderer.send("force_reload");
			},
			resync_library() {
				this.$electron.ipcRenderer.send("force_resync");
			}
		},
		props: {
			display_player_related: Boolean,
			player: Object,
		}
	}
</script>

<style scoped>

</style>