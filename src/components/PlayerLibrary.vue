<template>
	<div class="col-12 col-sm-9 col-md-9 col-lg-10 col-xl-10 offset-xl-0 d-flex flex-column visible" style="padding-top: 25px;padding-left: 24px;padding-right: 24px;">

		<nav class="navbar navbar-light m-0 p-0 d-flex justify-content-center">
			<h1 class="text-light m-0 pr-3">My library</h1>

			<form class="form-inline  flex-grow-1 " style="padding-top: 7px" >
				<input v-model="searchTerms" class="form-control btn-outline-danger text-white mr-sm-2 bg-transparent" style="width: 100%" type="search" placeholder="Search" aria-label="Search">
			</form>
		</nav>

		<div class="row p-0" style="">
			<hr class="d-flex" style="background: #ffffff;width: 100%;">
		</div>
		<div class="row d-flex flex-grow-1" style="overflow-y: auto;height: 1px;margin-bottom: 15px;">

			<div
					v-for="(book,index) in actual_books" :key="book.id"
					@contextmenu.prevent="$refs.menu.open($event, { book: book, id: index })"
					class="col-6 col-sm-3 col-md-3 col-lg-2 col-xl-2 align-self-start"
					style="padding: 5px;">
				<LibraryItem  :book="book" :id="index" @libraryBookClick="libraryBookClick"></LibraryItem>
			</div>

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

			<VueContext ref="menu" v-slot="{ data }" class="bg-dark context-menu">
				<template v-if="data">
					<li><a @click="playBook(data.id)">Play</a></li>
					<li><a @click="libraryBookClick(data.id)">Display</a></li>
					<hr>
					<li><a @click="addBookToHidden(data)">Hide from library</a></li>
				</template>
			</VueContext>

		</div>

	</div>
</template>

<script>
	import LibraryItem from "./LibraryItem";
	const FlexSearch = require("flexsearch");
	import VueContext from 'vue-context';

	export default {
		name: "PlayerLibrary",
		components: { LibraryItem, VueContext },
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
			playBook(arg) {
				this.$emit('libraryBookPlay', arg)
			},
			libraryBookClick(arg) {
				this.$emit('libraryBookClick', arg)
			},
			addBookToHidden(arg) {
				this.$electron.ipcRenderer.send("add_hidden_file",
					arg.book.chapters.map(c => { return c.file_path })
				);
			},
			add_library() {
				this.$electron.ipcRenderer.send("add_new_library", "open_please");
			}
		}
	}
</script>

<style scoped>
	@import '~vue-context/dist/css/vue-context.css';
	@import "../assets/css/context_menu.css";
</style>