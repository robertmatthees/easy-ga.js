<?php
/*  easy-ga.php (version: 0.1)

    Easy to Set-up Google Analytics Tracking
    Supporting Enhanced Ecommerce Transactions (EC)
    & Respecting Data Privacy User Choices
    (Do-not-track Browser Settings & Opt-out Cookies)
    Docs: https://www.robert-matthees.de/ecommerce/easy-ga

    Copyright (C) 2018 Robert Matthees (contact: www.robert-matthees.de)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation Version 3.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

header("Cache-Control: no-cache, must-revalidate"); 
header("Pragma: no-cache");

//***ENJOY...
$host = get_host();

//***CREATE DATA FOR MEASUREMENT PROTOCOL TRACKING
$curldata = array(
 'v' => 1,
 'aip' => 1,
 'cid' => sprintf( '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
   mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),
   mt_rand( 0, 0xffff ),
   mt_rand( 0, 0x0fff ) | 0x4000,
   mt_rand( 0, 0x3fff ) | 0x8000,
   mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
 ),
 't' => 'pageview',
 'dh' => $host,
 'dp' => '/backend-tracking',
 'dt' => 'backend tracking'
);
$curldata = array_merge($curldata, $_POST);

//***CURL IT TO GOOGLE ANALYTICS
$url = 'https://www.google-analytics.com/collect';
$content = http_build_query($curldata);
$content = utf8_encode($content);
$ch = curl_init();
curl_setopt($ch,CURLOPT_USERAGENT, 'Kabs.de');
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HTTPHEADER,array('Content-type: application/x-www-form-urlencoded'));
curl_setopt($ch, CURLOPT_HTTP_VERSION,CURL_HTTP_VERSION_1_1);
curl_setopt($ch, CURLOPT_POST, TRUE);
curl_setopt($ch, CURLOPT_POSTFIELDS, $content);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
curl_exec($ch);
curl_close($ch);

//**SYMFONY GET_HOST FUNCTION
function get_host() {
    if ($host = $_SERVER['HTTP_X_FORWARDED_HOST']) {
        $elements = explode(',', $host);
        $host = trim(end($elements));
    } else {
        if (!$host = $_SERVER['HTTP_HOST']) {
            if (!$host = $_SERVER['SERVER_NAME']) {
                $host = !empty($_SERVER['SERVER_ADDR']) ? $_SERVER['SERVER_ADDR'] : '';
            }
        }
    }
    $host = preg_replace('/:\d+$/', '', $host);
    return trim($host);
}
?>
