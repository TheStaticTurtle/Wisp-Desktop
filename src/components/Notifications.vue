<template>
	<!--<div class="container justify-content-end" style="position: absolute;right: 0;top: 0; z-index:10000;margin: 6px;margin-top: 12px;">
		<div class="row d-flex justify-content-end">-->
			<div class="col-4" style="position: absolute;right: 0;top: 0; z-index:10000;padding: 6px;padding-top: 12px; overflow-y: auto; max-height: 100vh">
				<!-- <div class="alert alert-info" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><span><strong>Alert</strong> text.</span></div> -->


				<div
						v-for="(notification,index) in notifications"
						v-bind:key="index"
						v-bind:class="{'alert-danger':notification.type==='error', 'alert-info':notification.type==='info', 'alert-warning':notification.type==='warn' }"
						class="alert"
						role="alert">
					<button @click="remove(index)" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>
					<span><strong>{{ notification.title }}</strong></span>
					<p style="font-size: 13px;margin-bottom: 0px;">{{ notification.text }}</p>
					<div v-if="notification.collapse !== undefined">
						<a  class="btn btn-link btn-sm text-danger" data-toggle="collapse" aria-expanded="true" v-bind:aria-controls="'collapse-'+index" v-bind:href="'#collapse-'+index" role="button" style="padding: 0px;">
							<i class="icon-arrow-down d-inline-block"></i>
							&nbsp;{{notification.collapse_title}}
						</a>
						<div class="collapse" v-bind:id="'collapse-'+index" style="padding: 8px;border-radius: 8px;background: #ffffff;font-size: 11px">
							<p style="margin-bottom: 0px;">{{ notification.collapse }}</p>
						</div>
					</div>
				</div>


			</div>
		<!--</div>
	</div>-->
</template>

<script>
	export default {
		name: "Notifications",
		methods: {
			remove(index) {
				this.notifications.splice(index, 1);
			}
		},
		mounted() {
			const t = this;
			this.$electron.ipcRenderer.on('ui_notify', (event, n) => {
				t.notifications.push(n)
			})
		},
		data() {
			return {
				notifications: [],
			}
		}
	}
</script>

<style scoped>

</style>