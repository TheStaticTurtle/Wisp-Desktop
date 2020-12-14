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



		<ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
			<li class="nav-item" role="presentation">
				<a class="active no-underline text-light app-nav" id="nav-settings-general" data-toggle="pill" href="#settings-general" role="tab" aria-controls="settings-general" aria-selected="true">
					<h2 class="m-0 p-1 pl-3 pr-3">General</h2>
				</a>
			</li>
			<li class="nav-item" role="presentation">
				<a class="no-underline text-light app-nav" id="nav-settings-libs" data-toggle="pill" href="#settings-libs" role="tab" aria-controls="settings-libs" aria-selected="false">
					<h2 class="m-0 p-1 pl-3 pr-3">Libraries</h2>
				</a>
			</li>
		</ul>

		<div class="tab-content" id="pills-tabContent">
			<div class="tab-pane fade show active" id="settings-general" role="tabpanel" aria-labelledby="nav-settings-general">
				....
			</div>
			<div class="tab-pane fade" id="settings-libs" role="tabpanel" aria-labelledby="nav-settings-libs">

				<table class="table table-hover">
					<thead class="text-light">
					<tr class="custom_tr_head">
						<th>Path</th>
						<th class="text-nowrap text-center" style="width: 1%;"><i class="icon-wrench"></i></th>
					</tr>
					</thead>
					<tbody class="text-light">
					<tr v-for="(library) in libraries" v-bind:key="library.id">
						<td>{{ library.path }}</td>
						<td>
							<a class="no-underline text-light p-2" href="#" title="More options"><i class="icon-options"></i></a>
							<a @click="resync_library(library)" class="no-underline text-light p-2 " href="#" title="Rescan this library"><i class="icon-refresh"></i></a>
							<a @click="delete_library(library)" class="no-underline text-danger p-2" data-toggle="modal" data-target="#confirmModal" title="Delete this library"><i class="icon-trash"></i></a>
						</td>
					</tr>
					</tbody>
				</table>

			</div>
		</div>

		<!-- Modal -->
		<div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content"  style="background: #1f1f1f;">
					<div class="modal-header">
						<h4 class="modal-title" id="confirmModalLabel">You sure about that?</h4>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						{{ modal_text }}
					</div>
					<div class="modal-footer border-0">
						<button type="button" class="btn btn-warning" data-dismiss="modal">Nope</button>
						<button @click="confirm_action" type="button" data-dismiss="modal" class="btn btn-danger">Yup</button>
					</div>
				</div>
			</div>
		</div>


	</div>
</template>

<script>
	export default {
		name: "AppLibraries",
		components: {  },
		props: {
			libraries: Array,
		},
		mounted() {
		},
		data() {
			return {
				modal_text: "",
				delete_library_selected: null
			}
		},
		watch: {
		},
		methods: {
			resync_library(lib) {
				this.$electron.ipcRenderer.send("force_resync", lib)
			},
			delete_library(lib) {
				this.modal_text = "You asked to delete the library at path: "+lib.path
				this.delete_library_selected = lib
			},
			confirm_action() {
				if(this.delete_library_selected !== null) {
					this.$electron.ipcRenderer.send("delete_library", this.delete_library_selected)
					this.delete_library_selected = null
				}
			},
			goto_home() {
				this.$emit('navigationClick', "HOME")
			},
		}
	}
</script>

<style scoped>

</style>