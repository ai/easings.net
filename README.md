# Easing Functions Cheat Sheet

Simple cheat sheet to help developers pick the right easing function.

See the [easing effects](https://easings.net/)

<a href="https://evilmartians.com/?utm_source=easings.net">
<img src="https://evilmartians.com/badges/sponsored-by-evil-martians.svg" alt="Sponsored by Evil Martians" width="236" height="54">
</a>

## Npm installing
```sh
npm install easings.net
```

## Usage
```
import easings from 'easings.net'

const stepValue = easings.easeInQuad(x) // 0 <= x <= 1
```

## Contributing

GitHub has great instructions on how to [set up Git], [fork a project] and
[make pull requests]. If you have a problem with Git, just send your files
directly to <andrey@sitnik.ru>.

[set up Git]:         https://docs.github.com/en/github/getting-started-with-github/set-up-git
[fork a project]:     https://docs.github.com/en/github/getting-started-with-github/fork-a-repo
[make pull requests]: https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests

### Translate

Just copy the `i18n/en.yml` file to `i18n/CODE.yml` (where `CODE` is
the lowercased [RFC 3066] language code of your target language,
for example `fr-ca` for Canadian French) and translate all messages.

[RFC 3066]: http://www.i18nguy.com/unicode/language-identifiers.html

### Test

1. Install project dependencies:

     ```sh
    yarn install
     ```

2. That’s all. Run development server:

     ```sh
    yarn run start
     ```

3. And open [localhost:1234] in browser.
