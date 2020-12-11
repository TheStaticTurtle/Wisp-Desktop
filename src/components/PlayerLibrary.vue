<template>
	<div class="col-md-10 col-lg-10 col-xl-10 offset-xl-0 d-flex flex-column visible" style="padding-top: 25px;padding-left: 24px;padding-right: 24px;">
		<h1 class="text-light">My library</h1>
		<hr class="d-flex" style="background: #ffffff;width: 100%;">
		<div class="row d-flex flex-grow-1" style="overflow-y: auto;height: 1px;margin-bottom: 15px;">

			<LibraryItem v-for="(book, index) in books" :key="book.id" :name="book.name" :picture_url="book.picture_url" :id="index" @libraryBookClick="libraryBookClick"></LibraryItem>



			<div class="col-sm-3 col-md-2 col-lg-2 col-xl-2 offset-xl-0 align-self-start" style="padding: 5px;">
				<button @click="add_library" id="add_new_library" class="btn btn-warning" type="button" style="padding: 1px;">
					<a class="no-underline" href="#"><div class="card" style="border-width: 1px;border-color: #151515;">
						<div style="background: #1f1f1f;padding: 32px;">
							<i class="icon-plus" style="font-size: 64px;color: rgb(255,255,255);"></i>
						</div>
						<div class="card-body text-center text-white" style="padding-top: 6px;padding-bottom: 0px;padding-left: 7px;padding-right: 6px;background: #1f1f1f;">
							<p class="card-title" style="font-weight: lighter">Add a new book library</p>
						</div>
					</div>
					</a>
				</button>
			</div>

		</div>
	</div>
</template>

<script>
	import LibraryItem from "./LibraryItem";

	export default {
		name: "PlayerLibrary",
		components: { LibraryItem },
		props: {
			books: Array,
		},

		methods: {
			libraryBookClick(arg) {
				this.$emit('libraryBookClick', arg)
			},
			add_library() {
				this.$electron.ipcRenderer.send("add_new_library", "open_please");
			}
		}
	}
</script>

<style scoped>

</style>