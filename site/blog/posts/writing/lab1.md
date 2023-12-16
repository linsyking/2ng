---
title: "The Rust Programming Language: Containers, Closures and Unsafe Rust"
date: 2023-12-13
tags:
  - teaching
  - programming_language
---

:::tip Objectives
- Use `cargo`
- Move and borrow semantics
- Primitives
- Macros
- FP Features
- Traits
- Mutable programming
- Unsafe Rust
- Writing tests
- Closures
- Lifetime
:::

*Rust is like C, and unlike C.*

---

## Why use Rust?

Reasons you should use Rust:

- Very **fast** binary performance
- Memory safe, thread safe
- Very **productive** (if used correctly)
- Cute crab
- Large community (comparing to Ocaml and Haskell)
- Industrial-strength standard library

When you are writing compiling rust code:

<img src="../lab/crab1.png"></img>

When you see 100 errors:

<img src="../lab/crab2.png"></img>

## Mindset

- Please read compile errors
- Do not use design patterns and coding styles from other languages
- Use community libraries
- Do not try writing "recursive data structures"
- Do not use references in struct unless necessary

:::tip Think
Why do we need new programming languages like Rust?
:::

And most importantly, Rust has nothing to do with Genshin Impact.

## Coding Environment

- Install [rustup](https://rustup.rs/)
- Use a (modern) IDE/Editor

Run once after installation:

```bash
rustup default stable
```

You can run `rustup update` to update toolchains(compilers, analyzer, etc.).

We only use `stable` channel features in this lab.

You should be able to run the following commands:

- `cargo`
- `rustc`
- `rustup`

## Pointerless, Referenceless Rust Type System

To introduce the real-world rust type system, we may first start with a very limited subset of the language and extend it step by step.



## References & Books

- `rustup doc`
- [The Book](https://doc.rust-lang.org/book/) - A very nice introduction to rust newbies.
- [Comprehensive Rust](https://google.github.io/comprehensive-rust/index.html)
- [How not to learn Rust](https://dystroy.org/blog/how-not-to-learn-rust/)
- [The Rustonomicon](https://doc.rust-lang.org/nomicon/intro.html)
