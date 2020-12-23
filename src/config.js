
const config_default = {
	"auto_continue_chapter": true,
	"player_current_volume": 0.85,
	"player_current_speed": 1,
	"jump_delay": 10,

	"status_playing": false,
	"status_book_unique_hash": "",
	"status_chapter_unique_hash": "",
	"status_current_file_position": 0,
}

export class Config {
	constructor(db) {
		this.db = db;

		this.db_config = {}
	}

	async init() {
		let lines_in_config = await this.db.models.Config.findAll()
		this.db_config = Object.fromEntries( lines_in_config.map(x => { return [x.key, x]; }) );

		//Create keys that don't exist
		for (const key in config_default) {
			if(!this.db_config.hasOwnProperty(key)) {
				this.db_config[key] = await this.db.models.Config.create({ "key": key, "value": config_default[key] }).catch(console.error);
			}
		}

		//Delete keys that aren't in the default config
		for (const key in this.db_config) {
			if(!config_default.hasOwnProperty(key)) {
				await this.db.models.Config.destroy({where: {key: key}})
				delete this.db_config[key]
			}
		}

		lines_in_config = await this.db.models.Config.findAll()
		this.db_config = Object.fromEntries( lines_in_config.map(x => { return [x.key, x]; }) );
	}

	force_sync() {
		const t = this
		return new Promise(async function(resolve, reject) {
			try {
				for (const key in t.db_config) {
					await t.db_config[key].save()
				}
			} catch (e) { reject(e) }
			resolve()
		})
	}

	async set(key, value) {
		this.db_config[key].value = value;
		await this.db_config[key].save()
	}

	get(key) {
		if(!this.db_config.hasOwnProperty(key)) throw new Error("Invalid key");
		return this.db_config[key].value;
	}

	get_all_mapped() {
		let ret = {}
		for (const dbConfigKey in this.db_config) {
			ret[dbConfigKey] = this.db_config[dbConfigKey].value
		}
		return ret
	}
}