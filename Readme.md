# Personal 2-ng blog

A second personal novel/game blog.

---

I'm trying to migrate docs from old blogs to this new blog.

This new SSG is much faster.

## Build Dependency

`Javascript` is slow, but currently the markdown parsing pipeline has special dependencies on it.

- NodeJS: run `pnpm i` after clone
- [soupault](https://soupault.app/)
- highlight
- ipe
- convert (imagemagick)
- make

Set your personal password for secret posts:

```bash
echo mypassword > .key
```

To build, run:

```bash
soupault
```

or

```bash
make dev
```

to listen changes.

Note that bulding process may require internet connection (ipe renderer).
