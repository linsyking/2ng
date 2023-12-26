---
title: "Writing a UNIX Shell in Rust"
date: 2023-12-22
tags:
  - teaching
  - unix
  - shell
  - rust
  - operating_system
---

## System calls

System calls are APIs provided by the operating system.
They are created so that applications can access system resources and use convenient features (like creating processes, do file I/O).

Linux has about 380 system calls. Windows has more (about 2000).

Doing system calls is the only way to enter the kernel mode and do privileged operations.

`libc` provides an abstraction over Unix system calls.

For example, you can directly use `fork` function to do the `fork` system call.

## Process

Process is a set of features the OS provide. Normally only one process can run on one CPU core.
Unix models process as some `task_struct` struct. OS will switch processes about every 100 ms (varies on different OS).

Unix stores processes as a tree structure. Every process has a unique id (`pid`) and it may have child processes.

When a process create its child process via `fork`, data on the heap and stack will be "copied" (COW) and the open files will be inherited (duplicated).

You may think `fork` as entering a new parallel universe.

There are some system calls provided by Unix OS that can control processes.

### UNIX syscalls we need

*(The syscall name may not be exactly the same as below)*

- `fork`: used to fork a process
- `exec`: run a new process image in the current process
- `dup2`: duplicate a file descriptor
- `wait`: wait for child processes to complete
- `pipe`: create (unnamed) pipes

## What is a shell?

Try `bash`, `zsh`, or `fish`.

## Our Unix shell features

- Subprocess creation
- Background execution
- Pipes and redirection

Download the [exercise zip](https://github.com/linsyking/OS-Notes/releases/download/lab2/exercise.zip).

Tasks:

- Understand the structure of the code
- Write a `check_prog` function
- Add L/R-redirection call
- Add pipe support

## "Frontend" - Lexer and Parser

We first need to parse the user input.

A hand-written lexer and parser is provided.

## Pipes

There are two kinds of pipes in Unix: unnamed pipes and named pipes.

Differences: [answer](https://unix.stackexchange.com/questions/69057/what-are-the-advantages-of-using-named-pipe-over-unnamed-pipe).

### Unnamed pipes

Rule: **read end will be blocked if there exists any write end**.

:::tip Think
It makes sense to close the write end in the parent process because the read end cannot tell whether there is still input coming.
But why is it necessary to close the read end in the child process? (It will not block any process)
:::

```sh
p1 | p2
```

:::center
<img src="../lab/p2.png" style="width:60%" />
<img src="../lab/p2s.png"  style="width:70%; margin-top: 3rem" />
:::

```sh
p1 | p2 | p3
```

:::center
<img src="../lab/p3.png" style="width:80%" />
<img src="../lab/p3s.png"  style="width:85%; margin-top: 3rem" />
:::

## Final product

The source code of the project is on [my github repo](https://github.com/linsyking/OS-Notes/).
