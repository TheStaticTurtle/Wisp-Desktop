<template>
	<div class="col d-flex flex-column visible" style="">
		<nav class="navbar navbar-light m-0 p-0 d-flex mt-3">
			<div class="pl-3 pl-sm-0 row w-100">
				<div class="col-12 col-sm-2">
					<button @click="goto_home" class="btn btn-lg btn-outline-light" style="min-width: 100%">
						<i class="icon-arrow-left" style="margin-right: 20px;"></i>Back
					</button>
				</div>
				<div class="col-12 col-sm-9 d-flex justify-content-center">
					<h1 class="app-title">Settings</h1>
				</div>
				<div class="col-12 col-sm-2">
				</div>
			</div>
		</nav>
		<br>
		<h1 class="app-title">Libraries</h1>
		<table class="table table-hover">
			<thead class="text-light">
			<tr class="custom_tr_head">
				<th>Path</th>
				<th></th>
				<th class="text-nowrap text-center" style="width: 1%;"><i class="icon-wrench"></i></th>
			</tr>
			</thead>
			<tbody class="text-light">


				<tr>
					<td>C:/zfzeg/EfzefZEF/FzefZEFzeF/zefEFZ/ZEFezZE:fZefZEF/F/zef</td>
					<td>5 Books, 5h</td>
					<td>
						<a class="no-underline text-light p-2" href="#" title="More options"><i class="icon-options"></i></a>
						<a class="no-underline text-light p-2 " href="#" title="Rescan this library"><i class="icon-refresh"></i></a>
						<a class="no-underline text-danger p-2" href="#" title="Delete this library"><i class="icon-trash"></i></a>
					</td>
				</tr>


			</tbody>
		</table>
	</div>
</template>

<script>
	export default {
		name: "AppLibraries",
		components: {  },
		props: {
		},
		mounted() {
		},
		data() {
			return {
			}
		},
		watch: {
		},
		methods: {
			goto_home() {
				this.$emit('navigationClick', "HOME")
			},
			resync_lib(what) {
				this.$electron.ipcRenderer.send("force_resync", what)
			},
		}
	}
</script>

<style scoped>

</style>