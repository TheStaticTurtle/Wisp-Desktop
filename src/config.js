
const config_default = {
	"auto_continue_chapter": true,
}

export class Config {
	constructor(db) {
		this.db = db;

		this.db_config = {}
	}

	async init() {
		const lines_in_config = await this.db.models.Config.findAll()
		this.db_config = Object.fromEntries( lines_in_config.map(x => { return [x.key, x] }) );

		const default_config_keys = Object.keys(config_default);
		const db_config_keys = Object.keys(this.db_config);

		//Create keys that don't exist
		for (let i = 0; i < default_config_keys.length; i++) {
			if(!db_config_keys.includes(default_config_keys[i])) {
				await this.db.models.Config.create({ "key": default_config_keys[i], "value": config_default[default_config_keys[i]] }).catch(console.error);
				this.db_config[db_config_keys[i]] = config_default[default_config_keys[i]]
			}
		}

		//Delete keys that aren't in the default config
		for (let i = 0; i < db_config_keys.length; i++) {
			if(!default_config_keys.includes(db_config_keys[i])) {
				await this.db.models.Config.destroy({where: {key: db_config_keys[i]}})
				delete this.db_config[db_config_keys[i]]
			}
		}

		this.config = this.db_config
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

	set(key, value) {
		const t = this
		return new Promise(async function(resolve, reject) {
			if(!t.db_config.hasOwnProperty(key)) reject(new Error("Invalid key"));
			t.db_config[key].value = value
			t.db_config[key].save().then(resolve).catch(reject)
		})
	}

	get(key) {
		if(!this.db_config.hasOwnProperty(key)) throw new Error("Invalid key");
		return this.db_config[key].value;
	}
}