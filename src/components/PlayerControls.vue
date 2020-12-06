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
				<div class="col" style="font-size: 20px;text-align: center;padding: 15px;"><a class="text-light control-buttons" href="#" style="padding: 20px;"><i class="icon-control-start"></i></a><a class="text-light control-buttons" href="#" style="padding: 20px;"><i class="icon-control-play"></i></a><a class="text-light control-buttons" href="#" style="padding: 20px;"><i class="icon-control-end"></i></a></div>
			</div>
			<div class="row">
				<div class="col-2 text-right text-white" style="padding: 0px;">
					<span>{{ getHumanPosition }}</span>
				</div>
				<div class="col-8 text-white d-xl-flex justify-content-xl-center align-items-xl-center">
					<div class="progress" style="width: 100%;height: 7px;">
						<div class="progress-bar bg-danger" v-bind:aria-valuenow="getProgressPercentage" aria-valuemin="0" aria-valuemax="100" v-bind:style="{width: getProgressPercentage+'%'}">
							<span class="sr-only">{{getProgressPercentage}}%</span>
						</div>
					</div>
				</div>
				<div class="col-2 text-white" style="padding: 0px;">
					<span>{{ getHumanDuration }}</span>
				</div>
			</div>
		</div>
		<div class="col-md-2 col-lg-2 col-xl-2 d-flex flex-column justify-content-center">
			<div class="row" style="margin-top: 16px;margin-bottom: 16px;">
				<div class="col d-flex justify-content-center align-items-center" style="font-size: 20px;text-align: center;margin-bottom: -16px;"><a class="text-light" href="#" style="padding-right: 20px;"><i class="fa fa-volume-up"></i></a><input class="custom-range slider" type="range" id="myRange" min="0" max="100" value="50" style="height: 4px;"></div>
			</div>
			<div class="row" style="margin-top: 16px;margin-bottom: 16px;">
				<div class="col d-flex justify-content-center align-items-center" style="font-size: 20px;text-align: center;margin-bottom: -16px;"><a class="text-light" href="#" style="padding-right: 20px;"><i class="icon-speedometer"></i></a><input class="custom-range slider" type="range" id="myRange-1" min="0" max="100" value="50" style="height: 4px;"></div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "PlayerControls",
		computed: {
			getHumanPosition() {
				let a = ""+Math.floor(this.player.chapter_position/60)
				let b = ""+this.player.chapter_position%60
				a = a.length<2 ? "0"+a : a
				b = b.length<2 ? "0"+b : b
				return a+":"+b
			},
			getHumanDuration() {
				let a = ""+Math.floor(this.player.chapter_duration/60)
				let b = ""+this.player.chapter_duration%60
				a = a.length<2 ? "0"+a : a
				b = b.length<2 ? "0"+b : b
				return a+":"+b
			},
			getProgressPercentage() {
				console.log(this.player.chapter_duration)
				console.log( this.player.chapter_position)
				const a = Math.floor(this.player.chapter_duration / this.player.chapter_position * 100);
				console.log(a);
				return a;
			}
		},
		props: {
			player: Object,
		}
	}
</script>

<style scoped>

</style>