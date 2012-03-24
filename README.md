# Easing Functions Cheat Sheet

Simple cheat sheet to help developer pick right easing function.

## Contributing

GitHub has great instructions, how to [set up Git], [fork project] and
[make pull request]. If you have a problem with Git, just send me files to
<andrey@sitnik.ru>.

[RFC 3066]:          http://www.i18nguy.com/unicode/language-identifiers.html
[set up Git]:        http://help.github.com/set-up-git-redirect
[fork project]:      http://help.github.com/fork-a-repo/
[make pull request]: http://help.github.com/send-pull-requests/

### Translate

Just copy `i18n/en.yml` file to `i18n/CODE.yml` (where `CODE` is [RFC 3066]
language code) and translate all messages.

### Test

To build site and test your fix/translation you’ll need to have Ruby and
Bundler installed. For example, in a Debian-based (e.g. Ubuntu) environment:

```sh
sudo apt-get install ruby1.9.1 ruby1.9.1-dev
sudo gem1.9.1 install bundler --no-user-install --bindir /usr/bin
```

That’s all. To build HTML just execute:

```sh
bundle exec rake build
```

While development, you can run `watch` task to rebuild site on every files
change:

```sh
bundle exec rake watch
```
