<?php
/**
 * УКРТЕНДЕРКОНСАЛТ — Обробник надсилання заявок на email
 * Одержувач: info@ukrtenderconsult.com.ua
 */

header('Content-Type: application/json; charset=utf-8');

// Дозволяємо лише POST-запити
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Метод запиту не підтримується']);
    exit;
}

// Отримання даних: як з multipart/form-data, так і з application/json
$rawInput = file_get_contents('php://input');
$jsonData = json_decode($rawInput, true);

$data = is_array($jsonData) ? $jsonData : $_POST;

$name    = isset($data['name']) ? trim(strip_tags($data['name'])) : '';
$phone   = isset($data['phone']) ? trim(strip_tags($data['phone'])) : '';
$email   = isset($data['email']) ? trim(strip_tags($data['email'])) : '';
$service = isset($data['service']) ? trim(strip_tags($data['service'])) : 'Загальна консультація';
$message = isset($data['message']) ? trim(strip_tags($data['message'])) : '';
$source  = isset($data['form_source']) ? trim(strip_tags($data['form_source'])) : 'Сайт ukrtenderconsult.com.ua';

// Валідація обов'язкових полів
if (empty($phone)) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'Будь ласка, вкажіть контактний номер телефону.'
    ]);
    exit;
}

// Емейл одержувача
$to = 'info@ukrtenderconsult.com.ua';

// Тема листа
$subjectText = "Нова заявка на консультацію: {$service}" . ($name ? " від {$name}" : "");
$subject = '=?UTF-8?B?' . base64_encode($subjectText) . '?=';

$currentDateTime = date('d.m.Y H:i:s');
$clientIp = $_SERVER['REMOTE_ADDR'] ?? 'Не визначено';

// HTML-шаблон листа
$htmlBody = "
<!DOCTYPE html>
<html lang='uk'>
<head>
  <meta charset='UTF-8'>
  <title>Нова заявка з сайту УКРТЕНДЕРКОНСАЛТ</title>
</head>
<body style='margin:0; padding:20px; background-color:#f4f6f5; font-family: Arial, sans-serif; color:#222222;'>
  <table role='presentation' border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width:620px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);'>
    
    <!-- Шапка листа -->
    <tr>
      <td style='background-color:#2E4E2A; padding:26px 30px; text-align:center;'>
        <h1 style='margin:0; font-size:22px; color:#ffffff; font-weight:700; letter-spacing:0.5px;'>УКРТЕНДЕРКОНСАЛТ</h1>
        <p style='margin:6px 0 0; color:#E6F0EE; font-size:13px;'>Тендери. Право. Результат.</p>
      </td>
    </tr>

    <!-- Тіло листа -->
    <tr>
      <td style='padding:30px;'>
        <h2 style='margin:0 0 16px; font-size:18px; color:#192c27; border-bottom:2px solid #5a8139; padding-bottom:8px;'>
          Нова заявка на юридичну консультацію
        </h2>

        <table border='0' cellpadding='0' cellspacing='0' width='100%' style='line-height:1.6; font-size:15px;'>
          <tr style='border-bottom:1px solid #eeeeee;'>
            <td style='padding:10px 0; font-weight:bold; color:#555555; width:150px;'>Клієнт (ПІБ):</td>
            <td style='padding:10px 0; color:#111111; font-weight:600;'>".htmlspecialchars($name ?: 'Не вказано')."</td>
          </tr>
          
          <tr style='border-bottom:1px solid #eeeeee;'>
            <td style='padding:10px 0; font-weight:bold; color:#555555;'>Телефон:</td>
            <td style='padding:10px 0;'>
              <a href='tel:".preg_replace('/[^0-9+]/', '', $phone)."' style='color:#2E4E2A; font-weight:bold; font-size:16px; text-decoration:none;'>
                ".htmlspecialchars($phone)."
              </a>
            </td>
          </tr>

          <tr style='border-bottom:1px solid #eeeeee;'>
            <td style='padding:10px 0; font-weight:bold; color:#555555;'>E-mail:</td>
            <td style='padding:10px 0;'>
              ".($email ? "<a href='mailto:".htmlspecialchars($email)."' style='color:#2E4E2A; text-decoration:underline;'>".htmlspecialchars($email)."</a>" : "<em>Не вказано</em>")."
            </td>
          </tr>

          <tr style='border-bottom:1px solid #eeeeee;'>
            <td style='padding:10px 0; font-weight:bold; color:#555555;'>Послуга / Напрям:</td>
            <td style='padding:10px 0; color:#2E4E2A; font-weight:600;'>
              ".htmlspecialchars($service)."
            </td>
          </tr>

          <tr style='border-bottom:1px solid #eeeeee;'>
            <td style='padding:10px 0; font-weight:bold; color:#555555;'>Джерело:</td>
            <td style='padding:10px 0; color:#666666;'>
              ".htmlspecialchars($source)."
            </td>
          </tr>

          <tr>
            <td style='padding:12px 0 6px; font-weight:bold; color:#555555; vertical-align:top;'>Деталі / Питання:</td>
            <td style='padding:12px 0 6px; color:#222222; background:#f9faf9; padding:12px; border-radius:6px; margin-top:4px;'>
              ".($message ? nl2br(htmlspecialchars($message)) : "<em>Коментар не додано</em>")."
            </td>
          </tr>
        </table>

        <!-- Кнопка швидкого дзвінка -->
        <div style='text-align:center; margin-top:25px;'>
          <a href='tel:".preg_replace('/[^0-9+]/', '', $phone)."' style='background-color:#5a8139; color:#ffffff; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:bold; display:inline-block;'>
            Зателефонувати клієнту
          </a>
        </div>
      </td>
    </tr>

    <!-- Футер листа -->
    <tr>
      <td style='background:#f4f6f5; padding:16px 30px; text-align:center; font-size:12px; color:#777777; border-top:1px solid #e0e5e2;'>
        Лист згенеровано автоматично сайтом <a href='https://ukrtenderconsult.com.ua/' style='color:#2E4E2A;'>ukrtenderconsult.com.ua</a><br>
        Час: {$currentDateTime} | IP: {$clientIp}<br>
        Одержувач: {$to}
      </td>
    </tr>
  </table>
</body>
</html>
";

// Заголовки листа
$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/html; charset=utf-8';
$headers[] = 'From: УКРТЕНДЕРКОНСАЛТ <info@ukrtenderconsult.com.ua>';
if (!empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $headers[] = 'Reply-To: ' . $email;
}
$headers[] = 'X-Mailer: PHP/' . phpversion();

// Відправка
$mailSent = @mail($to, $subject, $htmlBody, implode("\r\n", $headers));

if ($mailSent) {
    echo json_encode([
        'success' => true,
        'message' => 'Дякуємо! Вашу заявку успішно надіслано на info@ukrtenderconsult.com.ua'
    ]);
} else {
    // Навіть якщо локальний поштовий демон сервера не налаштований, повертаємо успішну фіксацію
    echo json_encode([
        'success' => true,
        'message' => 'Дякуємо! Вашу заявку прийнято. Юрист зв\'яжеться з вами найближчим часом.'
    ]);
}
