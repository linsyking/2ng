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

Doing system calls is a way to enter the kernel mode and do privileged operations for applications.

The standard C library provides a portion of system call interface for Unix.

For example, you can directly use `fork` function to do the `fork` system call, use `printf` to print characters to `stdout` (which uses the `write` system call under the hood).

## Process

Process is an abstraction of **the running program** on the OS. Normally only one process can run on one CPU core, wither in user mode and kernel mode.

Unix models process as some `task_struct` struct. OS will switch processes (context switch) faster than every 100 ms (varies on different OS).

### Process state

A simple state diagram has five states.

:::center
![](https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Process_states.svg/600px-Process_states.svg.png)
:::

### Process Control Block (PCB)

To switch and restore processes, we need to represent a process internally in OS. It usually includes process state, pid, program counter, registers, memory info (base and limit registers, page tables, etc.), a list of open files, and other info OS needs.

In Linux, it is `task_struct`. The Linux kernel maintains a doubly linked list and a pointer to the PCB of current running process.

### Scheduling queues

There is a ready queue and several wait queues. When a process needs an I/O request, it will be put into an I/O wait queue and when the I/O resource is ready, OS will put the process again to the ready queue. Similarly there is a "child termination wait queue" (which we need for implementing shell).

## Process creation

Unix stores processes as a tree structure. Every process has a unique id (`pid`) and it may have child processes.

When a process create its child process via `fork`, data on the heap and stack will be "copied" (COW) and the open files will be inherited (duplicated).

You may think `fork` as entering a new parallel universe.

There are some system calls provided by Unix OS that can control processes.

## Interprocess Communication (IPC)

### Shared memory

On Unix, we can use `shm_open` to create shared-memory object.

### Message passing

This feature is provided by the OS and all the messages are stored in the kernel.

In Rust, there is a similar model for thread communication: the `mpsc` library.

## Pipes

There are two kinds of pipes in Unix: unnamed pipes and named pipes.

Differences: [answer](https://unix.stackexchange.com/questions/69057/what-are-the-advantages-of-using-named-pipe-over-unnamed-pipe).

### File descriptors

> A unique identifier (per process) that an operating system assigns to a file when it is opened

On Unix 0 is the stdin, 1 is stdout and 2 is stderr.

You can see them in `/proc/<pid>/fd`.

:::center
![](https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/File_table_and_inode_table.svg/450px-File_table_and_inode_table.svg.png)
:::

Different processes may have different file descriptors pointing to the same opened file.

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
<img src="$url(lab/p2.png)" style="width:60%" />
<img src="$url(lab/p2s.png)"  style="width:70%; margin-top: 3rem" />
:::

```sh
p1 | p2 | p3
```

:::center
<img src="$url(lab/p3.png)" style="width:80%" />
<img src="$url(lab/p3s.png)"  style="width:85%; margin-top: 3rem" />
:::

### Named pipes

Use `mkfifo` to create named pipes. You need to provide the file path.

:::warning
Named pipes in Unix OS are not bi-directional.
:::

### UNIX syscalls we need

_(The syscall name may not be exactly the same as below)_

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

## Final product

The source code of the project is on [my github repo](https://github.com/linsyking/OS-Notes/).
