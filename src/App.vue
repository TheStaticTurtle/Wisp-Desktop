<template>
	<!--
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
	</head>
	-->
	<div id="app" class="text-light" style="background: #252525;height: 100vh;">
		<!-- <img alt="Vue logo" src="./assets/logo.png"> -->
		<Player></Player>
		<Notifications></Notifications>
	</div>


	<!--
		<script>if (typeof module === 'object') {window.module = module; module = undefined;}</script>
		<script src="assets/js/jquery.min.js"></script>
		<script src="assets/bootstrap/js/bootstrap.min.js"></script>
		<script>if (window.module) module = window.module;</script>
	-->
</template>


<style>
	@import './assets/fonts/font-awesome.min.css';
	@import './assets/fonts/simple-line-icons.min.css';
	@import './assets/css/Slider-Range.css';
	@import './assets/css/styles.css';
</style>


<script>
	//import HelloWorld from './components/HelloWorld.vue'
	import Player from './components/Player.vue'
	import Notifications from "./components/Notifications";

	/*if (process.env.NODE_ENV !== 'development') */window.__static = require('path').join(__dirname, '/assets').replace(/\\/g, '\\\\')

	export default {
		name: 'WhisperBook',
		components: {
			Notifications,
			Player,
		}
	}
</script>
