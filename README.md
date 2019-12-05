# mathematicians

Mathematician identities used for anonymized student identities in Desmos Classroom

## Contributing

To update the info for a mathematician, find their directory in [data/](data/).
Edit `bio.txt` to modify the text of their bio, and make sure to add an entry
for each source we should cite in the corresponding `metadata.toml` file.

Example `metadata.toml`:

```toml
name = "Ada Lovelace"

[[sources]]
name = "Wikipedia"
url = "https://en.wikipedia.org/..."

[[sources]]
name = "Some Other Site"
url = "https://some.other.site.com"
```

To add a new mathematician, just add a new directory
`data/your-mathematicians-name` containing `bio.txt` and `metadata.toml` files.

