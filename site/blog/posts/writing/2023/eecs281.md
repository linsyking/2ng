---
title: EECS281 Notes
date: 2023-12-10
tags:
  - writings
  - course
---

:::tip
This is a final review note for EECS281 final exam.
:::

## Hash

`std::hash` hashes a data structure to `size_t`.

Usage:

```cpp
std::string str = "Hello";
std::size_t str_hash = std::hash<std::string>{}(str);
// Or
std::hash<std::string> str_hasher;
std::size_t str_hash str_hash = str_hasher(str);
```

::::info Think
How to dedfine `hash` for a custom struct?

:::details Solution
Easy way:

```cpp
struct CustomType {
    int field1;
    short field2;
    std::string field3;
    // ...

    std::string toString() const {
        return std::to_string(field1) + std::to_string(field2) + field3; // + ...
    }

    size_t hash() const {
        return std::hash<std::string>()(toString());
    }

};
```

Cited from https://stackoverflow.com/a/76722434.
:::

::::

### What do you need to do Hashing?

Let use our favorite Rust as example:

Let's say we define a custom struct (or enum):

```rs
struct Person {
    id: u32,
    name: String,
    phone: u64,
}
```

However, to use hashing, you need to implement `Hash` trait for this struct.

Again, you may want to directly use `derive` macro:

```rs
#[derive(Hash)]
struct Person {
    id: u32,
    name: String,
    phone: u64,
}
```

However, this derivation needs you to have `Eq` and `PartialEq` traits.

This is because you need to compare two elements when hashing.

### Collision resolution

Load factor $\alpha = N/M$ where $N$ are all the keys placed and $M$ is the size of the table.

- Separate Chaining (linked list) - $\alpha$ might be bigger than 1
- Linear Probing - try $t(key)+j \bmod M, j = 1,2, \cdots$
- Quadratic Probing - try $t(key)+j^2 \bmod M, j = 1,2, \cdots$
- Double Hashing - use two hash functions

The last three methods are similar, they are called **open addressing**. $\alpha < 1$.

## Trees, BST

I believe most students who took ENGR1510J learned this well.

## Structural properties

- Depth - `depth(root) = 1`
- Size
- Height - `height(leaf) = 1`

## BST Property

- `key(node)` > keys of node of all **left** subtree
- `key(node)` <= keys of node of all **right** subtree

## AVL

Self-balancing.

- Heights of children differ by at most 1.

Worst-case search/insert is $O(\log{N})$.
