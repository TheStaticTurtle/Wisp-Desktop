<template>
    <div class="col-sm-3 col-md-2 col-lg-2 col-xl-2 offset-xl-0 align-self-start" style="padding: 5px;">
        <button class="btn btn-primary" type="button" style="padding: 1px;">
            <div class="card" style="border-width: 1px;border-color: #151515;">
                <img class="img-fluid card-img-top w-100 d-block" v-bind:src="image_url">
                <div class="card-body text-center text-white" style="padding-top: 6px;padding-bottom: 0px;padding-left: 7px;padding-right: 6px;background: #1f1f1f;">
                    <p class="card-title" style="font-weight: lighter">{{ title }}</p>
                </div>
            </div>
        </button>
    </div>
</template>

<script>
	export default {
		name: "LibraryItem",
		props: {
			image_url: String,
			title: String,
			id: String
        }
	}
</script>

<style scoped>

</style>