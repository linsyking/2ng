---
title: "The Rust Programming Language: Three Easy Pieces"
date: 2023-12-13
tags:
  - teaching
  - programming_language
  - rust
---

:::tip Objectives

- Use `cargo`
- Ownership, borrowing, lifetime
- Traits
- Closures
- Vectors, Strings, Iterators
  :::

_Rust is like C, and unlike C._

---

## Why use Rust?

Reasons you should use Rust:

- Very **fast** binary performance
- Memory safe, thread safe
- Very **productive** (if used correctly)
- Cute crab
- Large community (comparing to OCaml and Haskell)
- Industrial-strength standard library
- No GCs

When you are writing compiling rust code:

<img src="$url(lab/crab1.png)"></img>

When you see 100 errors:

<img src="$url(lab/crab2.png)"></img>

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
\mathsf{Exp}\, e :&= \underline{n} | e_1 b e_2 | \mathsf{true} | \mathsf{false} | x\\
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

## Ownership

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

There are many ways to transfer ownership. For example,

```rs
let x = (y, z); // y and z are moved!
let k = (x, x); // Error! the second x uses x after move
```

```rs
fn m(a: String) -> String {
    a
}

fn main() {
    let x = String::from("hi");
    let y = m(x); // x is moved to the function
    // ...
}
```

See [the tutorial on ownership](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#ownership-rules).

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

References are _borrowing_ values from its owner.

> As in real life, if a person owns something, you can borrow it from them. When you’re done, you have to give it back. You don’t own it.

### Dangling References

```rs
fn main() {
    let reference_to_nothing = dangle();
}

fn dangle() -> &String {
    let s = String::from("hello");

    &s
}
```

### Rules of References

- At any given time, you can have **either** one mutable reference **or** any number of immutable references.
- References must always be valid.

## Vectors and Slices

In Rust, you may find that there are two kinds of strings: `&str` and `String`. Why do we need two?

Under the hood, strings can be modeled by _an array of chars_. A char is a new type that is stored as `u8`.

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
\mathsf{Exp}\, e := \cdots | [e_1, \cdots, e_n] | e[\underline{n}] | e[\underline{n_1}..\underline{n_2}] | e[\underline{n_1}..=\underline{n_2}]
$$

Arrays are allocated on the stack because its size is known.

```rs
fn main() {
    let x = [1, 2, 3, 4, 5];
    println!("{}", x[0]); // 1
    let slice = &x[1..2];
    println!("{:?}", slice); // [2]
}
```

## Generics

```rs
fn fst<T>(a: &Vec<T>) -> &T{
    &a[0]
}
```

Adding some trait bounds:

```rs
fn fst<T: std::fmt::Display + Clone>(a: &Vec<T>) -> &T{
    let b = a.clone();
    println!("{}", b[0]);
    &a[0]
}
```

## Lifetime

Lifetimes are denoted with an apostrophe, like `'a`.

See [doc](https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html).

### Lifetime Elision

See [doc](https://doc.rust-lang.org/nomicon/lifetime-elision.html#lifetime-elision).

### Subtyping & Variance

Very PL, read the page above if you are interested!

(In reality, few uses it because it's too complicated)

The key idea is "covariance".

We use notation `F<T>` where `T` is lifetime and `F` is some special "container" including `&`, `&mut` etc.

We know that in a program, the lifetime of all variables is a **continuous** region of code.

:::success Definition
`'a` is a region of code, and

`'a: 'b` (`'a` subtypes `'b`) if and only if `'a` **completely contains** `'b`.
:::

We note that if `'a: 'b`, then `&'a: 'b`. This is called _covariant_.

However, if `'a: 'b`, then we cannot infer `&'a mut: &'b mut` and also no `&'b mut: &'a mut` (Why?). This is called _invariant_.

## Containers

### Box

Unique pointer. Mostly used.

### Rc

When you have multiple objects borrowing one object.

If cyclic reference is needed, you must use `Weak` pointer, memory leak otherwise.

### Cell & RefCell

Inner mutable mode, not recommended to use in safe Rust.

(It is used to implement linked list)

## Structs, Enums and Pattern Matching

You can use `#[derive(Debug, ...)]` to automatically implement those traits for your structs/enums.

- Pattern matching
- Pattern matching guard

## Closures

Closures are local functions that can capture some variables.

There are two kinds of closures: a standard one and a moved one.

```rs
|x| x + 1
// Means
fn _(x: &i32, <env>) -> i32{
    *x + 1
}
// Here <env> is the captured environment
```

```rs
|| x
// Means
fn _(<env>) -> i32{
    env.x
}
```

```rs
move |x| x + y       // y will be moved
```

## Trait System

Traits are very like typeclasses in Haskell. It is like specifying an interface (shared behaviors):

```rs
trait Qs {
    fn qs(&self) -> i32;
    fn qs2(&self, s: i32) -> i32;
}
```

You can do "subtrait" to require that it must also satisfy that trait. For example, the `Eq` trait is a subtrait of `PartialEq`.

Like implementing a trait, you may also implement some methods for a struct/enum.

Rust has a syntax sugar to call those methods. For example, when you are using a string:

```rs
let x = String::from("asd");
let y = x.len();
```

This `let y = x.len();` will be desugared to `let y = String::len(x)` is the signature of `len` function starts with a `self`, `&self`, or `&mut self`.

### Associative types

We can define some types in a trait. A famous example is the GAT design pattern in Rust:

[Reddit Post](https://www.reddit.com/r/rust/comments/ynvm8a/could_someone_explain_the_gats_like_i_was_5/)

We want to implement `map` for both `Result` and `Option`:

```rs
trait Mappable {
    type Item;
    type Result<U>;
    fn map<U, P: FnMut(Self::Item) -> U>(self, f: P) -> Self::Result<U>;
}
```

The `type` will be inferred when implementing the trait, like OCaml module type specification.

## Iterators

Iterators are very useful and Rust claims that they are zero-cost abstraction.

The most basic iterators are ranges. In python, you may have:

```py
for i in range(0, 10):
    print(i)
```

In Rust, you have:

```rs
for i in 0..10 {
    println!("{}", i);
}
```

This `0..10` will be evaluated to a iterator. (the object to iterate must implement the `Iterator` trait)

### `into_iter`, `iter`

The first one may use or not use reference, `iter` will enforce to use the reference (which is better).

Compare this:

```rs
let v = vec![1, 2, 3];
for vi in v.iter() {
    println!("{}", vi);
}
```

with

```rs
let v = vec![1, 2, 3];
for vi in v {   // = v.into_iter()
    println!("{}", vi);
}
```

### Enumerate

It's like `enumerate` in python:

```rs
let v = vec![1, 2, 3];
for (id: usize, v: &i32) in v.iter().enumerate() {
    println!("{}, {}", id, v);
}
```

### Zip

```rs
let v = vec![1, 2, 3];
let v2 = vec![1, 2, 3];
for (vv, v2v) in v.iter().zip(v2.iter()) {
    println!("{}, {}", vv, v2v);
}
```

### Iterator Mapping

For example, if we want to map every element to its successor, we can write:

```rs
let v = vec![1, 2, 3];
let nv: Vec<_> = v.iter().map(|x| x + 1).collect();
```

The `map` can also be chained.

There are also some other methods like `filter`, `find`.

## References & Books

- `rustup doc`
- [The Book](https://doc.rust-lang.org/book/) - A very nice introduction to rust newbies.
- [Comprehensive Rust](https://google.github.io/comprehensive-rust/index.html)
- [How not to learn Rust](https://dystroy.org/blog/how-not-to-learn-rust/)
- [The Rustonomicon](https://doc.rust-lang.org/nomicon/intro.html)
