# Easing Functions Cheat Sheet

Simple cheat sheet to help developers pick the right easing function.

## Contributing

GitHub has great instructions on how to [set up Git], [fork a project] and
[make pull requests]. If you have a problem with Git, just send your files
directly to <andrey@sitnik.ru>.

[RFC 3066]:          http://www.i18nguy.com/unicode/language-identifiers.html
[set up Git]:        http://help.github.com/set-up-git-redirect
[fork project]:      http://help.github.com/fork-a-repo/
[make pull request]: http://help.github.com/send-pull-requests/

### Translate

Just copy the `i18n/en.yml` file to `i18n/CODE.yml` (where `CODE` is 
the [RFC 3066] language code of your target language) and translate all
messages.

### Test

To build the site and test your fix/translation you’ll need to have Ruby and
Bundler installed. For example, in a Debian-based (e.g. Ubuntu) environment:

```sh
sudo apt-get install ruby1.9.1 ruby1.9.1-dev
sudo gem1.9.1 install bundler --no-user-install --bindir /usr/bin
```

That’s all. To build HTML just execute:

```sh
bundle exec rake build
```

During development, you can run the `watch` task to rebuild the site on
every file change:

```sh
bundle exec rake watch
```
