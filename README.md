# Wisp
Wisp is a NodeJS audiobook reader. It's using Electron and VueJS offering a great compatibility across platforms. It is still under development and anyone that wants to contribute to this project is welcome.
Furthermore, it first started as a playground for me to learn electron and improve my VueJS so the code might not be up to everyone standard

**When running in development mode, the database will reset at each launch. This, however is disabled will running in production.**

# Launching / Building

Thanks to the vue electron builder module launching the project is done with the command `npm run electron:serve` and build the project is done with `npm run electron:build`. But be warned I did not test build in a platform other than windows and tho some build options might be missing from the `vue.config.js` file

# File formats

I've only tested mp3 and wav files, but I think all formats used for browsers should work.

Audo files must be tagged correctly (See last screenshot for an example):
  - A file should be chapter
  - The album tag is the book name
  - The number tag is the number of the chapter
  - The image tag is the book image


# Screenshots
- Main screen:

![Main screen](https://data.thestaticturtle.fr/ShareX/2020/12/18/electron_2020-12-18_18-39-43.png)

- Loading screen:

![Loading screen](https://data.thestaticturtle.fr/ShareX/2020/12/18/electron_2020-12-18_18-40-18.png)

- Chapter tag example:

![Chapter tag example](https://data.thestaticturtle.fr/ShareX/2021/06/30/Mp3tag_2021-06-30_16-17-03.png)



