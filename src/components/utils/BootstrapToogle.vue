<template>
	<input type="checkbox"/>
</template>

<script>
	window.jQuery = window.$ = require('jquery');


	export default {
		name: "BootstrapToogle",
		props: {
			value: Boolean,
			options: {
				type: Object,
				default: () => ({})
			},
			disabled: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {
				updating: false,
			};
		},
		computed: {
			$$el() {
				return window.jQuery(this.$el)
			}
		},
		watch: {
			value(newValue) {
				if(this.updating) { return; }
				this.$$el.bootstrapToggle(newValue ? 'on' : 'off');
			},
			disabled(newValue) {
				this.$$el.bootstrapToggle(newValue ? 'disable' : 'enable');
			},
		},
		mounted() {
			if (this.value) this.$el.checked = true
			this.$$el.bootstrapToggle(this.options)
			if (this.disabled) this.$$el.bootstrapToggle('disable')
			this.$$el.change(() => {
				this.updating = true;
				this.$emit('input', this.$$el.prop('checked'));
				this.$nextTick( () => this.updating = false );
			})
		},
		beforeDestroy() {
			this.$$el.off('change')
		}

	}
</script>

<style scoped>

</style>