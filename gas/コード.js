const SHEET_NAME = PropertiesService.getScriptProperties().getProperty("SHEET_NAME");

// Webページを返す
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('食材検索アプリ');
}

// 料理名一覧（A列）を全件返す：ページ初回ロード時に1回だけ呼ぶ（候補用）
function getDishNames() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  return sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat()
    .map(v => String(v || '').trim())
    .filter(Boolean);
}

// ★追加：料理→食材配列 の辞書をまとめて返す（初回に1回だけ）
function getAllRecipes() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return {};

  const values = sheet.getRange(2, 1, lastRow - 1, 2).getValues(); // [料理名, 食材一覧]
  const map = {};

  for (const [name, raw] of values) {
    const dish = String(name || '').trim();
    if (!dish) continue;

    const items = String(raw || '')
      .split(/[\n,、]/)
      .map(s => s.trim())
      .filter(Boolean);

    map[dish] = items;
  }
  return map;
}

// ※互換のため残しているが、この版ではフロントから呼ばない（遅くなる原因）
function getIngredients(dishName) {
  dishName = (dishName || '').trim();
  if (!dishName) return [];

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const values = sheet.getRange(2, 1, lastRow - 1, 2).getValues(); // [ [料理名, 食材], ... ]
  for (const [name, raw] of values) {
    if (String(name || '').trim() === dishName) {
      return String(raw || '')
        .split(/[\n,、]/)
        .map(s => s.trim())
        .filter(Boolean);
    }
  }
  return [];
}
