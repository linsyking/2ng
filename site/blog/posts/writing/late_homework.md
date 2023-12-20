---
title: How to prove that you finished your homework before due, but forgot to submit?
date: 2023-12-20
tags:
  - writings
---

This was an interesting question I though of when I was getting huge (1 pts) deduction for my late homework. I finished my homework before due but forgot to submit. I was thinking that whether it is possible to prove that I finished my homework before due.

There is a trivial and working solution:

:::details A simple solution
We can create a GitHub **public** repository and upload the encrypted homework before due. Later when we want to verify, we can show the secret to others and easily recover the original homework. As long as you trust GitHub and the encryption algorithm, you should believe that the homework is done before due.

You may also replace GitHub with any big social media, like Twitter or Instagram.
:::

In this example, Github acts as an *authority* that both students and teachers believe.

:::center
<img src="../svg/authority2.png" width="50%"/>
:::

However, there are some problems:

- What if I don't want others know that I was publishing those things? I want to do this **anonymously**!
- What if my homework is very large (say 10GB) and it's **impossible to upload** to the server (the authority)? I want to do coding and verifying locally for both students and teachers.

## Problem Description

Here is the problem:

::::info Problem Description
**The Late Homework Problem.** John is a student (*Prover*) and Peter is John's teacher (*Verifier*). Peter has many students and John is only one of them. Peter released some homework but he needed to leave campus for a while so he cannot grade students' homework. Peter wants his students to finish homework before due (during his leave) and when he came back, all students can prove to Peter that they finished their homework before due. However, there are some restrictions regarding how students can prove their homework finishing time:

- Homework is individual, no communication is allowed between students
- Students cannot communicate with Peter during his leave

John soon realized that it was impossible to prove without an external authority. He discussed with Peter and Peter allowed students to use an Internet authority. However, the authority must follow some rules:

- Students **cannot** send **anything** to the authority, they are only allowed to do some `GET` requests anonymously
- When sending the `GET` request, the authority can respond **anything** (e.g. return a program that can be run on student's computer)
- Peter can only communicate with the authority after his leave
- It's allowed to use the HTTP session for the server to identify if you are the same person accessing the authority in a few minutes (session expire time) (this is the only information you can send to the authority)

Assume that we can design the authority server and give it to Peter. How can we design it so that John can proves he did his homework before due and Peter can verify his statement?

:::center
<img src="../svg/authority1.png" width="40%"/>
:::
::::
