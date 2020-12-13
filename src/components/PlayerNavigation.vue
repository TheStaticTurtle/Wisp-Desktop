<template>
	<div class="col-sm-3 col-lg-2 col-xl-2 flex-column" style="background: #1f1f1f;">
		<div class="row flex-grow-1">
			<div class="col text-light" style="padding-top: 16px;">
				<div class="row" style="padding-bottom: 4px;">
					<div class="col">
						<h1 class="app-title text-center">Wisp</h1>
					</div>
				</div>
				<div class="row" style="padding: 8px;padding-bottom: 4px;">
					<div class="col col-sm-12 pt-2 d-flex justify-content-center justify-content-sm-start">
						<a @click="goto_home" class="text-light no-underline" href="#" style="font-size: 20px;">
							<i class="icon-home" style="margin-right: 20px;"></i>Home
						</a>
					</div>
					<div class="col col-sm-12 pt-2 d-flex justify-content-center justify-content-sm-start">
						<a @click="goto_libraries" class="text-light no-underline" href="#" style="font-size: 20px;">
							<i class="icon-folder-alt" style="margin-right: 20px;"></i>Libraries
						</a>
					</div>
					<div class="col col-sm-12 pt-2 d-flex justify-content-center justify-content-sm-start">
						<a @click="resync_library" class="text-light no-underline" href="#" style="font-size: 20px;">
							<i class="icon-refresh" style="margin-right: 20px;"></i>Resync
						</a>
					</div>
				</div>
			</div>
		</div>
		<div v-if="display_player_related" class="row d-none d-sm-block">
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
			goto_libraries() {
				this.$emit('navigationClick', "LIBRARIES")
			},
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