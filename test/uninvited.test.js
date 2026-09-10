import assert from "node:assert/strict";
import { test } from "node:test";

import { isUninvited } from "../src/uninvited.js";

const bot = { userId: "900", roleIds: ["800"] };

test("only an explicit ping that leaves the bot out counts", () => {
  const cases = [
    ["hello everyone", false],
    ["<@111> look at this", true],
    ["<@!111> legacy nickname form", true],
    ["<@&700> role the bot does not hold", true],
    ["<@900> the bot itself", false],
    ["<@111> <@900> bot alongside someone else", false],
    ["<@&800> a role the bot holds", false],
    ["<@111> <@&800> someone plus a role the bot holds", false],
    ["@everyone @here", false],
    ["<#123> channel mention", false],
  ];

  for (const [content, expected] of cases) {
    assert.equal(isUninvited(content, bot), expected, content);
  }
});
