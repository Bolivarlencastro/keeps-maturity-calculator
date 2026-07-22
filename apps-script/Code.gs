const SPREADSHEET_ID = "1VWSabu1Cg3gN0tK5uBHF4rp0hNgvMKn-P6_Fjd65k54";
const SCHEMA_VERSION = 1;
const LAYOUT_VERSION = 2;
const MAX_CELL_LENGTH = 45000;
let spreadsheetCache;

const SHEETS = {
  Usuarios: [
    "user_id", "nome", "email", "primeiro_acesso", "ultimo_acesso",
    "primeira_session_id", "ultima_session_id", "utm_source", "utm_medium",
    "utm_campaign", "utm_content", "utm_term", "referrer"
  ],
  Sessoes: [
    "session_id", "user_id", "started_at", "last_activity_at", "status",
    "last_event", "last_question_number", "questions_answered", "elapsed_seconds",
    "screen", "page_url", "utm_source", "utm_medium", "utm_campaign", "referrer"
  ],
  Respostas: [
    "event_id", "session_id", "user_id", "respondida_em", "tempo_desde_inicio_s",
    "question_key", "question_number", "dimension", "question_text", "answer_value",
    "answer_label"
  ],
  Eventos: [
    "event_id", "session_id", "user_id", "event_at", "event", "elapsed_seconds",
    "screen", "question_number", "questions_answered", "page_url", "payload_json"
  ],
  Resultados: [
    "session_id", "user_id", "completed_at", "duration_seconds", "total_score",
    "classification", "purpose", "diagnosis", "methodologies", "scalability",
    "operation", "productivity", "engagement", "indicators", "sustainability",
    "answers_json"
  ]
};

const ALLOWED_EVENTS = new Set([
  "diagnostic_cta_clicked", "lead_details_submitted", "lead_capture_error",
  "diagnostic_started", "question_viewed", "question_answered", "diagnostic_completed",
  "diagnostic_restarted", "session_paused", "consultation_requested", "whatsapp_click",
  "print_result"
]);

function doGet() {
  return jsonOutput_({ ok: true, service: "keeps-maturity-analytics", schemaVersion: SCHEMA_VERSION });
}

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    validatePayload_(payload);

    const cache = CacheService.getScriptCache();
    if (cache.get(payload.event_id)) return jsonOutput_({ ok: true, duplicate: true });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      ensureSchema_();
      recordEvent_(payload);
      updateSession_(payload);
      if (payload.event === "lead_details_submitted") updateUser_(payload);
      if (payload.event === "question_answered") recordAnswer_(payload);
      if (payload.event === "diagnostic_completed") recordResult_(payload);
      cache.put(payload.event_id, "1", 21600);
    } finally {
      lock.releaseLock();
    }

    return jsonOutput_({ ok: true });
  } catch (error) {
    console.error(error && error.stack ? error.stack : error);
    return jsonOutput_({ ok: false, error: "invalid_request" });
  }
}

function setup() {
  ensureSchema_();
  return { spreadsheetId: SPREADSHEET_ID, sheets: Object.keys(SHEETS) };
}

function parsePayload_(e) {
  const raw = e && e.postData && e.postData.contents;
  if (!raw || raw.length > 100000) throw new Error("Missing or oversized body");
  return JSON.parse(raw);
}

function validatePayload_(payload) {
  if (!payload || payload.schema_version !== SCHEMA_VERSION) throw new Error("Invalid schema");
  if (!isIdentifier_(payload.event_id) || !isIdentifier_(payload.session_id) || !isIdentifier_(payload.user_id)) {
    throw new Error("Invalid identifiers");
  }
  if (!ALLOWED_EVENTS.has(payload.event)) throw new Error("Invalid event");
}

function isIdentifier_(value) {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{8,80}$/.test(value);
}

function ensureSchema_() {
  const properties = PropertiesService.getScriptProperties();
  if (properties.getProperty("layoutVersion") === String(LAYOUT_VERSION)) return;
  const spreadsheet = spreadsheet_();
  Object.keys(SHEETS).forEach(name => {
    let sheet = spreadsheet.getSheetByName(name);
    if (!sheet) sheet = spreadsheet.insertSheet(name);
    const headers = SHEETS[name];
    const current = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    if (current.join("|") !== headers.join("|")) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length)
      .setBackground("#6750A4")
      .setFontColor("#FFFFFF")
      .setFontWeight("bold");
    sheet.autoResizeColumns(1, headers.length);
  });
  spreadsheet.getSheetByName("Usuarios").getRange("D:E").setNumberFormat("dd/mm/yyyy hh:mm:ss");
  spreadsheet.getSheetByName("Sessoes").getRange("C:D").setNumberFormat("dd/mm/yyyy hh:mm:ss");
  spreadsheet.getSheetByName("Respostas").getRange("D:D").setNumberFormat("dd/mm/yyyy hh:mm:ss");
  spreadsheet.getSheetByName("Eventos").getRange("D:D").setNumberFormat("dd/mm/yyyy hh:mm:ss");
  spreadsheet.getSheetByName("Resultados").getRange("C:C").setNumberFormat("dd/mm/yyyy hh:mm:ss");
  spreadsheet.getSheetByName("Respostas").setColumnWidth(9, 520);
  spreadsheet.getSheetByName("Eventos").setColumnWidth(11, 520);
  spreadsheet.getSheetByName("Resultados").setColumnWidth(16, 360);
  properties.setProperty("layoutVersion", String(LAYOUT_VERSION));
}

function recordEvent_(payload) {
  const data = safeObject_(payload.data);
  append_("Eventos", [
    payload.event_id, payload.session_id, payload.user_id, eventDate_(payload), payload.event,
    seconds_(payload.elapsed_ms), text_(data.screen, 30), number_(data.question_number),
    number_(data.questions_answered), text_(payload.page_url, 1000), jsonCell_(data)
  ]);
}

function updateSession_(payload) {
  const sheet = sheet_("Sessoes");
  const row = findRow_(sheet, payload.session_id);
  const existing = row ? sheet.getRange(row, 1, 1, SHEETS.Sessoes.length).getValues()[0] : [];
  const data = safeObject_(payload.data);
  const attribution = safeObject_(payload.attribution);
  const startedAt = existing[2] || dateOrNow_(payload.started_at);
  const status = statusFor_(payload.event, existing[4]);

  upsert_(sheet, row, [
    payload.session_id, payload.user_id, startedAt, eventDate_(payload), status,
    payload.event, number_(data.question_number) || existing[6] || "",
    number_(data.questions_answered), seconds_(payload.elapsed_ms), text_(data.screen, 30),
    text_(payload.page_url, 1000), text_(attribution.utm_source, 200),
    text_(attribution.utm_medium, 200), text_(attribution.utm_campaign, 200),
    text_(payload.referrer, 1000)
  ]);
}

function updateUser_(payload) {
  const profile = safeObject_(payload.profile);
  const email = text_(profile.email, 254).toLowerCase();
  if (!email || email.indexOf("@") < 1) return;

  const sheet = sheet_("Usuarios");
  const row = findRow_(sheet, payload.user_id);
  const existing = row ? sheet.getRange(row, 1, 1, SHEETS.Usuarios.length).getValues()[0] : [];
  const attribution = safeObject_(payload.attribution);
  upsert_(sheet, row, [
    payload.user_id, text_(profile.name, 120), email, existing[3] || eventDate_(payload),
    eventDate_(payload), existing[5] || payload.session_id, payload.session_id,
    text_(attribution.utm_source, 200), text_(attribution.utm_medium, 200),
    text_(attribution.utm_campaign, 200), text_(attribution.utm_content, 200),
    text_(attribution.utm_term, 200), text_(payload.referrer, 1000)
  ]);
}

function recordAnswer_(payload) {
  const data = safeObject_(payload.data);
  append_("Respostas", [
    payload.event_id, payload.session_id, payload.user_id, eventDate_(payload),
    seconds_(payload.elapsed_ms), text_(data.question_key, 30), number_(data.question_number),
    text_(data.dimension, 80), text_(data.question_text, 1000), number_(data.answer_value),
    text_(data.answer_label, 120)
  ]);
}

function recordResult_(payload) {
  const data = safeObject_(payload.data);
  const scores = safeObject_(data.scores);
  const sheet = sheet_("Resultados");
  const row = findRow_(sheet, payload.session_id);
  upsert_(sheet, row, [
    payload.session_id, payload.user_id, eventDate_(payload), seconds_(payload.elapsed_ms),
    number_(data.total_score), text_(data.classification, 80), number_(scores.purpose),
    number_(scores.diagnosis), number_(scores.methodologies), number_(scores.scalability),
    number_(scores.operation), number_(scores.productivity), number_(scores.engagement),
    number_(scores.indicators), number_(scores.sustainability), jsonCell_(safeObject_(data.answers))
  ]);
}

function statusFor_(eventName, current) {
  if (eventName === "diagnostic_completed") return "concluido";
  if (eventName === "diagnostic_restarted") return "reiniciado";
  if (eventName === "session_paused") return current === "concluido" ? current : "pausado";
  if (eventName === "diagnostic_started") return "iniciado";
  if (eventName === "question_viewed" || eventName === "question_answered") return "em_andamento";
  return current || "identificado";
}

function sheet_(name) {
  return spreadsheet_().getSheetByName(name);
}

function spreadsheet_() {
  if (!spreadsheetCache) spreadsheetCache = SpreadsheetApp.openById(SPREADSHEET_ID);
  return spreadsheetCache;
}

function append_(name, values) {
  sheet_(name).appendRow(values);
}

function findRow_(sheet, id) {
  if (sheet.getLastRow() < 2) return 0;
  const match = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1)
    .createTextFinder(id).matchEntireCell(true).findNext();
  return match ? match.getRow() : 0;
}

function upsert_(sheet, row, values) {
  const targetRow = row || sheet.getLastRow() + 1;
  sheet.getRange(targetRow, 1, 1, values.length).setValues([values]);
}

function safeObject_(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function text_(value, maxLength) {
  return value == null ? "" : String(value).slice(0, maxLength || 500);
}

function number_(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : "";
}

function seconds_(milliseconds) {
  const value = number_(milliseconds);
  return value === "" ? "" : Math.max(0, Math.round(value / 1000));
}

function eventDate_(payload) {
  return dateOrNow_(payload.event_at);
}

function dateOrNow_(value) {
  const date = value ? new Date(value) : new Date();
  return isNaN(date.getTime()) ? new Date() : date;
}

function jsonCell_(value) {
  return JSON.stringify(value).slice(0, MAX_CELL_LENGTH);
}

function jsonOutput_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
