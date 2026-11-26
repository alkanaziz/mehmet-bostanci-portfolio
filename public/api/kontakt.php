<?php
/**
 * Contact form handler (runs on the Hetzner webhosting, PHP 8).
 *
 * The static site posts here with fetch() and Accept: application/json; without
 * JavaScript the plain form post is answered with a redirect back to /kontakt/.
 * Both sites (bostanci-art.de and the mirror) post to https://bostanci-art.de, so
 * all mail leaves from one server (relevant for SPF).
 *
 * Nothing is stored except a short-lived, hashed per-IP counter for rate limiting.
 */

declare(strict_types=1);

const RECIPIENT       = 'info@bostanci-art.de';
const SENDER          = 'noreply@bostanci-art.de';
const SENDER_NAME     = 'Bostanci Art Website';
const ALLOWED_ORIGINS = ['https://bostanci-art.de', 'https://www.bostanci-art.de', 'https://bostanci-art.alkanaziz.com'];
const DEFAULT_FORM    = 'https://bostanci-art.de/kontakt/';
const MIN_SECONDS     = 3;   // humans need longer than this to fill the form
const MAX_PER_HOUR    = 5;   // messages per IP address and hour
const MAX_LENGTH      = ['name' => 100, 'email' => 200, 'subject' => 150, 'message' => 5000];

date_default_timezone_set('Europe/Berlin');

// Local testing only: allow one more origin, e.g. KONTAKT_EXTRA_ORIGIN=http://127.0.0.1:8090
$allowedOrigins = ALLOWED_ORIGINS;
if (getenv('KONTAKT_EXTRA_ORIGIN')) {
    $allowedOrigins[] = (string) getenv('KONTAKT_EXTRA_ORIGIN');
}

$origin    = $_SERVER['HTTP_ORIGIN'] ?? '';
$wantsJson = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');

header('X-Robots-Tag: noindex');
header('Cache-Control: no-store');
if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Content-Type, Accept');
    header('Vary: Origin');
}

/** JSON for fetch(), otherwise a redirect back to the form page (no JavaScript). */
function respond(int $status, string $code): never
{
    global $wantsJson, $allowedOrigins;
    if ($wantsJson) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $code === 'ok', 'code' => $code]);
        exit;
    }
    $back    = DEFAULT_FORM;
    $referer = parse_url($_SERVER['HTTP_REFERER'] ?? '');
    if (isset($referer['scheme'], $referer['host'])) {
        $refOrigin = $referer['scheme'] . '://' . $referer['host'] . (isset($referer['port']) ? ':' . $referer['port'] : '');
        if (in_array($refOrigin, $allowedOrigins, true)) {
            $back = $refOrigin . '/kontakt/';
        }
    }
    header('Location: ' . $back . '?status=' . rawurlencode($code) . '#kontaktformular', true, 303);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($method !== 'POST') {
    header('Allow: POST, OPTIONS');
    respond(405, 'method');
}
// Browsers send Origin with every POST; reject posts from foreign websites.
if ($origin !== '' && !in_array($origin, $allowedOrigins, true)) {
    respond(403, 'origin');
}

$field = static fn(string $name): string => trim((string) ($_POST[$name] ?? ''));

// Spam traps: a hidden field only bots fill in, and a minimum time on the page.
// Bots get a normal "ok" so they do not learn anything.
if ($field('website') !== '') {
    respond(200, 'ok');
}
$started = (int) $field('started');
if ($started > 0 && (time() - intdiv($started, 1000)) < MIN_SECONDS) {
    respond(200, 'ok');
}

// Single-line fields: no line breaks (prevents mail header injection).
$singleLine = static fn(string $v): string => trim(preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $v) ?? '');
$name    = $singleLine($field('name'));
$email   = $singleLine($field('email'));
$subject = $singleLine($field('subject'));
$message = str_replace("\r\n", "\n", $field('message'));
$message = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $message) ?? '';

$values = ['name' => $name, 'email' => $email, 'subject' => $subject, 'message' => $message];
foreach (MAX_LENGTH as $key => $max) {
    if (mb_strlen($values[$key]) > $max) {
        respond(422, 'invalid');
    }
}
if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, 'invalid');
}

// Rate limit per IP (hashed, kept for one hour).
$dir = sys_get_temp_dir() . '/bostanci-kontakt';
if (!is_dir($dir)) {
    @mkdir($dir, 0700, true);
}
$file  = $dir . '/' . hash('sha256', 'bostanci-kontakt|' . ($_SERVER['REMOTE_ADDR'] ?? '')) . '.json';
$now   = time();
$times = is_file($file) ? (json_decode((string) file_get_contents($file), true) ?: []) : [];
$times = array_values(array_filter($times, static fn($t) => is_int($t) && $t > $now - 3600));
if (count($times) >= MAX_PER_HOUR) {
    respond(429, 'rate');
}

$site = in_array($origin, $allowedOrigins, true) ? parse_url($origin, PHP_URL_HOST) : 'bostanci-art.de';
$body = "Neue Nachricht über das Kontaktformular auf {$site}\n\n"
    . "Name:    {$name}\n"
    . "E-Mail:  {$email}\n"
    . 'Betreff: ' . ($subject !== '' ? $subject : '–') . "\n\n"
    . $message . "\n\n"
    . '-- ' . "\n"
    . 'Gesendet am ' . date('d.m.Y \u\m H:i') . " Uhr. Mit \"Antworten\" geht die Antwort direkt an {$email}.\n";

$headers = [
    'From'                      => mb_encode_mimeheader(SENDER_NAME, 'UTF-8', 'Q') . ' <' . SENDER . '>',
    'Reply-To'                  => $email,
    'MIME-Version'              => '1.0',
    'Content-Type'              => 'text/plain; charset=UTF-8',
    'Content-Transfer-Encoding' => '8bit',
    'X-Mailer'                  => 'bostanci-art-kontakt',
];
$mailSubject = mb_encode_mimeheader('Kontaktformular: ' . ($subject !== '' ? $subject : 'Neue Nachricht'), 'UTF-8', 'Q');

if (!mail(RECIPIENT, $mailSubject, $body, $headers, '-f' . SENDER)) {
    error_log('kontakt.php: mail() failed');
    respond(500, 'error');
}

$times[] = $now;
@file_put_contents($file, json_encode($times), LOCK_EX);
respond(200, 'ok');
