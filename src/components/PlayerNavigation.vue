<template>
	<div class="col-md-2 col-lg-2 col-xl-2 d-flex flex-column" style="background: #1f1f1f;">
		<div class="row flex-grow-1">
			<div class="col text-light" style="padding-top: 16px;">
				<div class="row" style="padding: 8px;padding-bottom: 4px;">
					<div class="col"><a class="text-light no-underline" href="#" style="font-size: 25px;"><i class="icon-home" style="margin-right: 20px;"></i>Home</a></div>
				</div>
				<div class="row" style="padding: 8px;padding-bottom: 4px;">
					<div class="col"><a class="text-light no-underline" href="#" style="font-size: 25px;"><i class="icon-magnifier" style="margin-right: 20px;"></i>Search</a></div>
				</div>
			</div>
		</div>
		<div v-if="display_player_related" class="row">
			<div class="col" style="padding-bottom: 8px;padding-right: 8px;padding-left: 8px;">
				<hr style="background: #ffffff;">
				<img style="width: 100%;" v-bind:src="player.image_url">
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "PlayerNavigation",
		props: {
			display_player_related: Boolean,
			player: Object,
		}
	}
</script>

<style scoped>

</style>