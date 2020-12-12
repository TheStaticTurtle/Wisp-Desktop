<template>
	<div class="col-md-10 col-lg-10 col-xl-10 offset-xl-0 d-flex flex-column visible" style="padding-top: 25px;padding-left: 24px;padding-right: 24px;">

		<nav class="navbar navbar-light m-0 p-0">
			<h1 class="text-light m-0">My library</h1>

			<form class="form-inline ml-3 flex-grow-1 " style="padding-top: 7px" >
				<input v-model="searchTerms" class="form-control btn-outline-danger text-white mr-sm-2 bg-transparent" style="width: 100%" type="search" placeholder="Search" aria-label="Search">
			</form>
		</nav>

		<div class="row p-0" style="">
			<hr class="d-flex" style="background: #ffffff;width: 100%;">
		</div>
		<div class="row d-flex flex-grow-1" style="overflow-y: auto;height: 1px;margin-bottom: 15px;">

			<LibraryItem v-for="(book,index) in actual_books" :key="book.id" :book="book" :id="index" @libraryBookClick="libraryBookClick"></LibraryItem>

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
	const FlexSearch = require("flexsearch");


	export default {
		name: "PlayerLibrary",
		components: { LibraryItem },
		props: {
			books: Array,
		},
		mounted() {
			this.updateSearchResult("");
			console.log(this.books)
			this.search_index = FlexSearch.create({
				depth: 3,
				doc: {
					id: "unique_hash",
					field: "name"
				}
			});
			this.search_index.add(this.books)
		},
		data() {
			return {
				searchTerms: "",
				actual_books: [],
				search_index: null,
			}
		},
		watch: {
			searchTerms: {
				handler: function(val) {
					this.updateSearchResult(val);
				},
				deep: true
			},
			books: {
				handler: function(new_books) {
					this.search_index.clear()
					this.search_index.add(new_books)
				},
				deep: true
			}
		},
		methods: {
			async updateSearchResult(arg) {
				if (arg === "") {
					this.actual_books = this.books;
					return;
				}
				this.actual_books = await this.search_index.search(arg)
			},
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