# Easing Functions Cheat Sheet

Simple cheat sheet to help developers pick the right easing function.

<a href="https://evilmartians.com/?utm_source=easings.net">
<img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg" alt="Sponsored by Evil Martians" width="236" height="54">
</a>

## Contributing

GitHub has great instructions on how to [set up Git], [fork a project] and
[make pull requests]. If you have a problem with Git, just send your files
directly to <andrey@sitnik.ru>.

[set up Git]:         http://help.github.com/set-up-git-redirect
[fork a project]:     http://help.github.com/fork-a-repo/
[make pull requests]: http://help.github.com/send-pull-requests/

### Translate

Just copy the `i18n/en.yml` file to `i18n/CODE.yml` (where `CODE` is
the lowercased [RFC 3066] language code of your target language,
for example `fr-ca` for Canadian French) and translate all messages.

[RFC 3066]: http://www.i18nguy.com/unicode/language-identifiers.html

### Test

1. To build the site and test your fix/translation you’ll need to have Ruby and
   Bundler installed. For example, in a Debian-based (e.g. Ubuntu) environment:

     ```sh
    sudo apt-get install ruby1.9.1 ruby1.9.1-dev
    sudo gem1.9.1 install bundler --no-user-install --bindir /usr/bin
     ```

2. Install project dependencies:

     ```sh
    bundle install --path=.bundle
     ```

3. That’s all. Run development server:

     ```sh
    bundle exec rake server
     ```

4. And open [localhost:3000] in browser.

[localhost:3000]: http://localhost:3000/
