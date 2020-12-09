<template>
	<tr class="custom_tr_body">
		<td class="text-center">{{ chapter.chapter_no }}</td>
		<td>{{ chapter.chapter_name }}</td>
		<td class="text-center">{{ getHumanDuration() }}</td>
	</tr>
</template>

<script>
	export default {
		name: "BookItem",
		props: {
			chapter: Object,
		},
		methods: {
			getHumanDuration() {
				return new Date((this.chapter.chapter_duration ? this.chapter.chapter_duration : 0) * 1000).toISOString().substr(11, 8)
			}
		}
	}
</script>

<style scoped>

</style>