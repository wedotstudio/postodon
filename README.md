# Postodon

Postodon is a fork of [toot](https://codeberg.org/kytta/toot) but provides some new customizations that fully optimize the current API. Check [here](README.orig.md) for the original documentation.

Besides the `text` and `instance`, this also use three more params in the URL so that it can fully utilize the undocumented mastodon share param(https://github.com/mastodon/mastodon/blob/c4a429ed47e85a6bbf0d470a41cc2f64cf120c19/app/serializers/manifest_serializer.rb#L63-L75):

- `url`: the URL to the shared item
- `titlte`: the title of the URL
- `sharedonly`: When enabled, the title and URL field will be read-only if they have content to prevent accidental removal.

## License

Licensed under the [GNU Affero General Public License, version 3](https://spdx.org/licenses/AGPL-3.0-only.html) 

