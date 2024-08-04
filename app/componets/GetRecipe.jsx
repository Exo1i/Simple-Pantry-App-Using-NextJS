"use client";
function _0xa707() {
  const _0x1e252f = [
    "133029arsENz",
    "5023588OwjLyv",
    "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",
    "15598370PZaEzi",
    "14BlCKoj",
    "3881549JCcyLI",
    "48LfYpCM",
    "6hvOLUB",
    "517143idHlnI",
    "11WJqjWy",
    "5ErAPIX",
    "106249mOWpeo",
    "2952936tAqhdv",
  ];
  _0xa707 = function () {
    return _0x1e252f;
  };
  return _0xa707();
}
const _0x21d3df = _0x5394;
function _0x5394(_0xa0b253, _0x3a1f2d) {
  const _0xa707dd = _0xa707();
  return (
    (_0x5394 = function (_0x539432, _0x40a396) {
      _0x539432 = _0x539432 - 0x79;
      let _0x47146a = _0xa707dd[_0x539432];
      return _0x47146a;
    }),
    _0x5394(_0xa0b253, _0x3a1f2d)
  );
}
(function (_0x32466d, _0x4136b1) {
  const _0x1910a6 = _0x5394,
    _0x3cebc8 = _0x32466d();
  while (!![]) {
    try {
      const _0x5d4daa =
        parseInt(_0x1910a6(0x83)) / 0x1 +
        (-parseInt(_0x1910a6(0x7c)) / 0x2) *
          (-parseInt(_0x1910a6(0x80)) / 0x3) +
        (parseInt(_0x1910a6(0x79)) / 0x4) * (parseInt(_0x1910a6(0x82)) / 0x5) +
        (-parseInt(_0x1910a6(0x7f)) / 0x6) * (parseInt(_0x1910a6(0x7d)) / 0x7) +
        (parseInt(_0x1910a6(0x7e)) / 0x8) * (parseInt(_0x1910a6(0x85)) / 0x9) +
        (-parseInt(_0x1910a6(0x7b)) / 0xa) * (parseInt(_0x1910a6(0x81)) / 0xb) +
        parseInt(_0x1910a6(0x84)) / 0xc;
      if (_0x5d4daa === _0x4136b1) break;
      else _0x3cebc8["push"](_0x3cebc8["shift"]());
    } catch (_0x3884c3) {
      _0x3cebc8["push"](_0x3cebc8["shift"]());
    }
  }
})(_0xa707, 0xc0af1);
const x = _0x21d3df(0x7a);

export default async function GetRecipe(itemData) {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${x}`,
          "HTTP-Referer": `https://pantry-app-two.vercel.app/`, // Optional, for including your app on openrouter.ai rankings.
          "X-Title": "Pantry Tracker", // Optional. Shows in rankings on openrouter.ai.
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages: [
            {
              role: "user",
              content: `Suggest a recipe for this item: ${itemData.productName}`,
            },
          ],
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();

      return data.choices[0].message.content;
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching recipe:", error);
  }
}
