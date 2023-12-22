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

## What is a shell?

## Features

- Subprocess creation
- Background execution
- Pipes and redirection

## UNIX syscalls we need

*(The syscall name may not be exactly the same as below)*

- `fork`: used to fork a process
- `exec`: run a new process image in the current process
- `dup2`: duplicate a file descriptor
- `wait`: wait for child processes to complete
- `pipe`: manage pipes between processes
