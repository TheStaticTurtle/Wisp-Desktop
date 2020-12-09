<template>
	<div class="col-md-10 col-lg-10 col-xl-10 offset-xl-0 d-flex flex-column visible" style="padding-top: 8px;padding-left: 16px;padding-right: 16px;">
		<div class="row no-gutters d-flex flex-grow-1" style="overflow-y: scroll;height: 1px;margin-bottom: 15px;">
			<div class="col" style="padding: 5px;">
				<div class="row no-gutters d-flex flex-row">
					<div class="col-md-3" style="padding: 16px;"><img class="img-fluid" v-bind:src="book.picture_url"></div>
					<div class="col" style="padding-top: 16px;margin-left: 16px;">
						<h1 class="text-light">{{ book.name }}</h1>
						<p class="text-muted" style="margin-bottom: 4px;">By: {{ getBookReaders(book) }}</p>
						<p class="text-muted">{{ book.chapters.length }} Chapters {{ getHumanBookDuration(book) }}</p><button class="btn btn-danger btn-lg" type="button"><i class="icon-control-play" style="margin-right: 16px;"></i>Start listening</button></div>
				</div>
				<div class="row no-gutters d-flex flex-row">
					<div class="col text-light">
						<hr style="margin: 0px;margin-bottom: 16px;margin-top: 8px;background: #ffffff;">
						<div class="table-responsive text-light">
							<table class="table table-hover">
								<thead class="text-light">
								<tr class="custom_tr_head">
									<th class="text-nowrap text-center" style="width: 1%;">#</th>
									<th>Title</th>
									<th class="text-nowrap text-center" style="width: 1%;"><i class="icon-clock"></i></th>
								</tr>
								</thead>
								<tbody class="text-light">

								<BookItem v-for="(chapter, index) in book.chapters" :key="book.id+'_'+index" :chapter="chapter" ></BookItem>

								<!--
								<tr class="custom_tr_body">
									<td class="text-center">222</td>
									<td>Chapter 02 - The scar</td>
									<td class="text-center">18:41</td>
								</tr>
								<tr class="custom_tr_body">
									<td class="text-center" style="padding: 8px;"><button class="btn btn-success float-none d-xl-flex mx-auto justify-content-xl-center align-items-xl-center" type="button" style="padding: 5px;"><i class="icon-control-play" style="font-size: 18px;"></i></button></td>
									<td>Chapter 02 - The scar</td>
									<td class="text-center">18:41</td>
								</tr>
								<tr class="custom_tr_body">
									<td class="text-center" style="padding: 8px;"><button class="btn btn-secondary float-none d-xl-flex mx-auto justify-content-xl-center align-items-xl-center" type="button" style="padding: 5px;"><i class="icon-control-pause" style="font-size: 18px;"></i></button></td>
									<td>Chapter 02 - The scar</td>
									<td class="text-center">18:41</td>
								</tr>
								<tr class="custom_tr_body">
									<td class="text-center" style="padding-top: 14px;"><i class="icon-volume-2" style="font-size: 19px;"></i></td>
									<td>Chapter 02 - The scar</td>
									<td class="text-center">18:41</td>
								</tr>
								-->
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import BookItem from "./BookItem";

	export default {
		name: "PlayerBook",

		components: { BookItem },
		props: {
			book: Object,
		},
		methods: {
			getBookReaders() {
				const arr = this.book.chapters.map(x => x.chapter_artist)
				const unique = arr.filter(function(elem, pos) { return arr.indexOf(elem) === pos; });
				return unique.join(", ")
			},
			getHumanBookDuration() {
				const arr = this.book.chapters.map(x => (x.chapter_duration ?  x.chapter_duration : 0));
				const time = arr.reduce((a, b) => a + b, 0)
				return new Date(time * 1000).toISOString().substr(11, 8)
			}
		}
	}
</script>

<style scoped>

</style>