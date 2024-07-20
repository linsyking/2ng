---
title: "Puka: A Multi-platform 2D Game Engine with Concurrency Support"
date: 2024-4-17
tags:
  - game
---

## Introduction

[Puka](https://github.com/linsyking/puka) is a game engine with **simplicity** and **concurrency** in mind.

Users write lua codes, the engine parallelize them!

Watch [this video](https://www.youtube.com/watch?v=sGGZ147X8B0) to see a demonstration of the game engine.

## Technologies used

- C++: A compiled language
- [glm](https://github.com/g-truc/glm): A Math library
- [sol](https://github.com/ThePhD/sol2): Lua binding for C++
- [box2d](https://github.com/erincatto/box2d): A physics engine
- [SDL 2](https://www.libsdl.org): A rendering engine
- [Lua](https://www.lua.org/): Lua code execution engine
- [yyjson](https://github.com/ibireme/yyjson): JSON parser

## Core idea

Each component is assigned to a thread. Each thread has a lua virtual machine (VM).

When running lua (user) code, the VM lock is always acquired.

To access components in other VMs, we need a "third tmp VM" to pass the value.

We use the `ComponentProxy` to proxy the access to lua components.

For example, we want to get a component from VM2 to VM1 (assume this operation is done in VM1), the process is like this:

1. Release VM1 lock
2. Acquire VM2 lock
3. Acquire VM_tmp lock
4. Deep copy component from VM2 to VM_tmp
5. Release VM_tmp lock
6. Acquire VM1 lock
7. Acquire VM_tmp lock
8. Deep copy component from VM_tmp to VM1
9. Release VM_tmp lock

:::tip Think

**Why not directly deep copy the component from VM2 to VM1?**

Because that operation requires acquiring both VM locks, which may lead to deadlock.
:::

The core mechanism "deep copy" is done by:

```lua
lua_ref_raw copy(lua_ref_raw &obj, sol::state &target) {
    sol::type tp = obj.get_type();
    if (tp == sol::type::number) {
        if (obj.is<int>()) {
            return sol::make_object(target, obj.as<int>());
        } else {
            return sol::make_object(target, obj.as<double>());
        }
    } else if (tp == sol::type::boolean) {
        return sol::make_object(target, obj.as<bool>());
    } else if (tp == sol::type::string) {
        return sol::make_object(target, obj.as<std::string>());
    } else if (tp == sol::type::userdata) {
        if (obj.is<ComponentProxy>()) {
            return sol::make_object(target, obj.as<ComponentProxy>());
        } else if (obj.is<Actor *>()) {
            return sol::make_object(target, obj.as<Actor *>());
        } else if (obj.is<RigidbodyComponent *>()) {
            return sol::make_object(target, obj.as<RigidbodyComponent *>());
        } else {
            std::cerr << "warning: userdata type not registered\n";
        }
    } else if (tp == sol::type::function) {
        return sol::make_object(target, obj.as<sol::function>());
    } else if (tp == sol::type::table) {
        sol::table t     = obj.as<sol::table>();
        sol::table tcopy = target.create_table();
        for (auto it = t.begin(); it != t.end(); ++it) {
            auto [key, val] = *it;
            tcopy.set(copy(key, target), copy(val, target));
        }
        return tcopy;
    }
    return {};
}
```

## Demonstration source code

### Fib

```lua
return {
  fib = 0,
  fibb = function(self, n)
    if n <= 1 then
      return n
    end
    return self:fibb(n - 1) + self:fibb(n - 2)
  end,

  OnStart = function(self)
    Debug.Log(self.key)
    Debug.Log(self:fibb(self.fib))
    Application.Quit()
  end
}
```

### Write-back

```lua
return {
  itbl = {
    a = 1,
    b = 2,
    c = 3
  },
  func = function(self)
    for k, v in pairs(self.itbl) do
      Debug.Log(k .. " " .. v)
    end
  end,
  OnStart = function(self)
    if self.key == "c1" then
      self.other = self.actor:GetComponentByKey("c2")
      local data = self.other:get()
      data.itbl = {999,999}
      self.other:wb()
    end
  end,

  OnUpdate = function(self)
    local frame = Application.GetFrame()
    self:func()
    if frame == 10 then
      Application.Quit()
    end
  end
}
```
