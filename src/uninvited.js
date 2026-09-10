const USER_TAG = /<@!?(\d+)>/g;
const ROLE_TAG = /<@&(\d+)>/g;

/** Whether `content` explicitly pings someone without including the bot; reply pings, @everyone and @here never count. */
export function isUninvited(content, bot) {
  const userMatches = content.matchAll(USER_TAG);
  const pingedUserIds = [...userMatches].map((match) => match[1]);

  const roleMatches = content.matchAll(ROLE_TAG);
  const pingedRoleIds = [...roleMatches].map((match) => match[1]);

  const nobodyPinged = pingedUserIds.length === 0 && pingedRoleIds.length === 0;
  if (nobodyPinged) {
    return false;
  }

  const botPingedDirectly = pingedUserIds.includes(bot.userId);
  if (botPingedDirectly) {
    return false;
  }

  const botPingedViaRole = pingedRoleIds.some((roleId) => bot.roleIds.includes(roleId));
  if (botPingedViaRole) {
    return false;
  }

  return true;
}
