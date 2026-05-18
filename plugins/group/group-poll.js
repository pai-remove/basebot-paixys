const handler = async (
  m,
  {
    conn: conn,
    text: text,
    args: args,
    usedPrefix: usedPrefix,
    command: command,
  },
) => {
  let a = text.split("|").slice(1);
  if (!a[1])
    throw `"*• Example :* ${usedPrefix + command} *[message option|option]*`;
  if (a[12])
    throw `• Example :* ${usedPrefix + command} *[message option|option]*`;
  if (checkDuplicate(a)) throw `Not Same characters !`;
  const pollMessage = {
    name: text.split("|")[0],
    values: a,
    multiselect: !1,
    selectableCount: 1,
  };
  await conn.sendMessage(
    m.chat,
    {
      poll: pollMessage,
    },
    {
      quoted: m,
    },
  );
};
handler.help = ["poll"].map((a) => a + " *[create polling]*");
handler.tags = ["group"];
handler.command = ["poll"];

export default handler;

function checkDuplicate(arr) {
  return new Set(arr).size !== arr.length;
}
