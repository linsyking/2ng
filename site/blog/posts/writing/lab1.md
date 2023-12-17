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
- No GCs

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
\mathsf{Typ}\, \tau := \mathsf{i32} | \mathsf{i64} | \mathsf{u32} | \mathsf{u64} | \mathsf{bool} | \mathsf{char} | (\tau_1,\cdots, \tau_n) | ()
$$

There are also `i8`, `i16` etc. but we don't often use them.

Also note that we don't have vectors, arrays, lists and strings because those things include heap allocation and will be introduced later.

Let's define a few expressions:

$$
\begin{align*}
\mathsf{Exp}\, e :&= \underline{n} | b | \mathsf{true} | \mathsf{false} | x\\
&| \quad \mathsf{if}\, e_1\, \{ e_2 \} \\
&| \quad \mathsf{if}\, e_1\, \{ e_2 \} \, \mathsf{else} \, \{e_3\} \\
&| \quad (e_1,\cdots, e_n)\\
&| \quad \mathsf{let}\, x = e_1\\
&| \quad \mathsf{let}\, \mathsf{mut}\, x = e_1\\
&| \quad e_1;e_2\\
&| \quad \{e\}\\
&| \quad 'c'
\end{align*}
$$

- $b$ is binary operators for numerals and $x$ is variable
- variables in Rust is immutable by default
- The semantics of `;` (Semicolon) is very similar to OCaml
- $c$ is a unicode character

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

### Shadowing

Like many functional PLs, Rust support variable shadowing:

```rs
fn main() {
    let x = 1;  // Dead variable
    let x = 10;
    println!("{:?}", x);    // 10
}
```

### Mutable

You cannot write:

```rs
fn main() {
    let x = 1;
    x = 10; // Error!
    println!("{:?}", x);
}
```

Instead, you need to add `mut`:

```rs
fn main() {
    let mut x = 1;
    x = 10;
    println!("{:?}", x); // 10
}
```

### Ownership

What Rust wants to solve is the "memory-safe" problem.

> Memory safety is the property of a program where memory pointers used always point to **valid memory**, i.e. allocated and of the correct type/size.

:::warning
Rust doesn't ensure no memory leak. This is not part of memory safe property.

> Rust's memory safety guarantees make it difficult, but not impossible, to accidentally create memory that is never cleaned up (known as a memory leak). Preventing memory leaks entirely is not one of Rust's guarantees, meaning memory leaks are memory safe in Rust.

If you don't use cyclic `Rc`s, you'd probably not encounter memory leak though.
:::

:::info Ownership Rules
1. Each value in Rust has an owner.
2. There can only be one owner at a time.
3. When the owner goes out of **scope**, the value will be dropped.
:::

See [the tutorial on ownership](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#ownership-rules).

## Top-level Functions

The following notes have heavy dependencies on functions, so let's introduce them here.

Top-level functions are defined at the top level (not in a function!).

Exampls:

```rs
fn max(a: i32, b: i32) -> i32 {
    // ...
    // Returns an `i32`
}

fn main() { // Equivalent to `fn main() -> () {`
    // ...
    // Returns a `()`
}
```

## References

Now it's time to introduce th references!

There are two kinds of references in Rust:

- Immutable references: `&T`
- Mutable references: `&mut T`

Modify our types and expressions:

$$
\mathsf{Typ}\, \tau := \cdots | \& \tau | \& \mathsf{mut} \, \tau
$$


$$
\mathsf{Exp}\, e := \cdots | \& e | \& \mathsf{mut} \, e | *e
$$

References are *borrowing* values from its owner.

> As in real life, if a person owns something, you can borrow it from them. When you’re done, you have to give it back. You don’t own it.

## Vectors and Slices

In Rust, you may find that there are two kinds of strings: `&str` and `String`. Why do we need two?

Under the hood, strings can be modeled by *an array of chars*. A char is a new type that is stored as `u8`.

Therefore, we may first need to understand the difference between `Vec<T>` (`String`) and `&[T]` (`&str`).

All resources, including primitive ones (`Copy`able, size known at compile time) and heap-allocated data types (size of the inner data unknown at compile time), will be allocated to some memory address.

:::tip Note
Although Strings and vectors are non-copyable, they are still sized. Because they store the pointer.
:::

The primitive data types, like `i32`, which implements the `Copy` trait, is **stored on the stack** because the size is known at compile time.

On the other hand, the size of (inner data of) vectors, or arrays, cannot be determined during compile time, so it cannot live on the stack.

For the copyable data types, there is no `Move`. For example,

```rs
fn main() {
    let x = 12;
    let y = x;
    let z = x + y;
    println!("{:?}", z);
}
```

Here `x` is not moved to `y`, it is copied to `y`. As a result we can use `x` in `z`.

However for a non-copyable data type, for example, a `String`, the resource will be moved (transfer the ownership):

```rs
fn main() {
    let x = String::from("Hello");
    let y = x;  // Here `x` is moved to `y`
    let z = x;  // Error! use of moved value
    println!("{:?}", z);
}
```

The array data type is now added to our `Typ` and `Exp`:

$$
\mathsf{Typ}\, \tau := \cdots | [\tau ; \underline{n}]
$$


$$
\mathsf{Exp}\, e := \cdots | [e_1, \cdots, e_n]
$$

Arrays are allocated on the stack because its size is known.

## References & Books

- `rustup doc`
- [The Book](https://doc.rust-lang.org/book/) - A very nice introduction to rust newbies.
- [Comprehensive Rust](https://google.github.io/comprehensive-rust/index.html)
- [How not to learn Rust](https://dystroy.org/blog/how-not-to-learn-rust/)
- [The Rustonomicon](https://doc.rust-lang.org/nomicon/intro.html)
