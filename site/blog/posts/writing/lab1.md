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

## Pointerless, Referenceless Rust

To introduce the real-world rust, we may first start with a very limited subset of the language and extend it step by step.

Now consider a language without pointer and references.

Let's first write down some primitive types:

$$
\mathsf{Typ}\, \tau := \mathsf{i32} | \mathsf{i64} | \mathsf{u32} | \mathsf{u64} | \mathsf{bool} | (\tau_1,\cdots, \tau_n) | ()
$$

There are also `i8`, `i16` etc. but we don't often use them.

Also note that we don't have vectors, arrays, lists and strings because those things include heap allocation and will be introduced later.

Let's define a few expressions:

$$
\begin{align*}
\mathsf{Exp}\, e :&= \mathsf{Num}[n] | b | \mathsf{true} | \mathsf{false} | x\\
&| \quad \mathsf{if}\, e_1\, \{ e_2 \} \\
&| \quad \mathsf{if}\, e_1\, \{ e_2 \} \, \mathsf{else} \, \{e_3\} \\
&| \quad (e_1,\cdots, e_n)\\
&| \quad \mathsf{let}\, x = e_1\\
&| \quad e_1;e_2\\
&| \quad \{e\}
\end{align*}
$$

$b$ is binary operators for numerals and $x$ is variable.

However, you must need to write expressions in functions (which hasn't be defined).

Try writing some code in a rust project (initialized by `cargo`).

To initialize a project, run:

```bash
cargo new proj_name
```

Then go to `src/main.rs`.

Change the file content to this:

```rs
fn main() {
    let x = ();
    println!("{:?}", x);
}
```

Change `()` to some expressions and run your program:

```bash
cargo run
```

You are allowed to write

```rs
fn main() {
    let x = if true {7;};
    println!("{:?}", x);
}
```

but not

```rs
fn main() {
    let x = if true {7};
    println!("{:?}", x);
}
```

## References & Books

- `rustup doc`
- [The Book](https://doc.rust-lang.org/book/) - A very nice introduction to rust newbies.
- [Comprehensive Rust](https://google.github.io/comprehensive-rust/index.html)
- [How not to learn Rust](https://dystroy.org/blog/how-not-to-learn-rust/)
- [The Rustonomicon](https://doc.rust-lang.org/nomicon/intro.html)
